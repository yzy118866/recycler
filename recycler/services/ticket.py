from django.utils import timezone

from recycler.models import Company, Ticket


def generate_ticket_num(company: Company) -> str:
    """Generate ticket num"""
    date_str = timezone.now().strftime("%d.%m.%Y")
    prefix_arr = []

    if company.contract_num:
        prefix_arr.append(company.contract_num)
    prefix_arr.append(date_str)

    prefix = "/".join(prefix_arr)
    #
    last_ticket = Ticket.objects.filter(num__isnull=False, num__startswith=prefix).order_by("-num").first()
    if last_ticket and last_ticket.num:
        last_num = int(last_ticket.num.rsplit("/", 1)[-1])
    else:
        last_num = 0

    new_num = last_num + 1

    return f"{prefix}/{new_num}"
