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
        pass
    else:
        previous = Ticket.objects.get(id=instance.id)
        if previous.status != instance.status:
            logging.info(f"Ticket status change: {previous.status} => {instance.status}")
            if instance.status == TicketStatus.ARCHIVE:
                logging.info(f"Decreasing company balance: {instance.price_actual}")
                instance.company.balance_decrease(instance.price_actual)
            elif previous.status == TicketStatus.ARCHIVE:
                logging.info(f"Increasing company balance: {instance.price_actual}")
                instance.company.balance_increase(instance.price_actual)
