import logging

from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.db import connection

from recycler.models import CompanyContract, Ticket, TicketStatus, Landfill, NonComplianceReport
from recycler.tasks import task_parse_contract_fkko

@receiver(pre_save, sender=Landfill)
def signal_landfill_on_change(sender, instance, **kwargs):
    if instance.id is None:
        return

    previous = Landfill.objects.get(id=instance.id)
    if previous.name != instance.name or previous.location != instance.location:
        logging.info(f"Landfill updated: {previous.name} -> {instance.name}")

@receiver(pre_save, sender=NonComplianceReport)
def signal_non_compliance_on_change(sender, instance, **kwargs):
    if instance.id is None:
        return

    previous = NonComplianceReport.objects.get(id=instance.id)
    if previous.description != instance.description:
        logging.info(f"Non-compliance report updated: {previous.description} -> {instance.description}")

@receiver(post_save, sender=CompanyContract)
def signal_company_contract_created(sender, instance, created, **kwargs):
    if created:
        logging.info(f"Planned task for created company contract: {instance}")
        task_parse_contract_fkko(instance)


@receiver(pre_save, sender=Ticket)
def signal_ticket_on_change(sender, instance: Ticket, **kwargs):
    if instance.id is None:
        return

    previous = Ticket.objects.get(id=instance.id)

    status_changed = previous.status != instance.status
    approve_status_changed = previous.approve_status != instance.approve_status

    if status_changed or approve_status_changed:

        if previous.status == TicketStatus.ARCHIVE and previous.approve_status:
            logging.info(f"Reverting balance due to status/approval change: +{previous.price_actual}")
            previous.company.balance_increase(previous.price_actual)

        if instance.status == TicketStatus.ARCHIVE and instance.approve_status:
            logging.info(f"Decreasing balance for archived approved ticket: -{instance.price_actual}")
            instance.company.balance_decrease(instance.price_actual)

@receiver(post_delete)
def reset_sequence_on_delete(sender, instance, **kwargs):
    """
    Сбросить sequence для всех моделей после удаления объекта.
    """
    model_name = sender._meta.db_table
    if model_name != 'sqlite_sequence':
        reset_sequence_sql = f"DELETE FROM sqlite_sequence WHERE name = '{model_name}'"
        with connection.cursor() as cursor:
            cursor.execute(reset_sequence_sql)
        logging.info(f"Resetting sequence for model: {model_name}")