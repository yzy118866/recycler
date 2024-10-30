from huey.contrib.djhuey import db_task

from recycler.models import CompanyContract
from recycler.services.parse_fkko import parse_fkko


@db_task()
def task_parse_contract_fkko(contract: CompanyContract):
    parse_fkko(contract)
