import logging

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from recycler.models import CompanyContract, Ticket, TicketStatus
from recycler.tasks import task_parse_contract_fkko


@receiver(post_save, sender=CompanyContract)
def signal_company_contract_created(sender, instance, created, **kwargs):
    if created:  # Run FKKO parsing in background
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
