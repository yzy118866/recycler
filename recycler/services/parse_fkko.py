import logging
import os
import re

from docx.api import Document
from rest_framework.exceptions import APIException

from recycler.models import FKKO, CompanyContract

log = logging.getLogger("parse_fkko")


def extract_numbers(text: str) -> str:
    return re.sub(r"[^\d]*", "", text)


def parse_fkko(contract: CompanyContract):
    """Parse FKKP list from docx file table"""

    file_path = contract.file.path
    file_ext = os.path.splitext(file_path)[1]

    if file_ext not in [".docx"]:
        raise APIException(f"Неверное расширение файла ({file_ext}). Парсинг ФККО работает только с DOCX.", code=422)

    document = Document(file_path)

    fkko_list: list[FKKO] = []
    for table in document.tables:
        for i, row in enumerate(table.rows):
            cell_texts = list(cell.text for cell in row.cells)
            if len(cell_texts) != 4:
                break
            ## -- Process row
            code: str = extract_numbers(cell_texts[1])
            name = cell_texts[2]
            price = extract_numbers(cell_texts[3])

            if not code or not price.isdigit():
                log.warning(f"Skipped invalid row: {cell_texts}")
                continue

            price = int(price)

            fkko_list.append(FKKO(contract=contract, company=contract.company, code=code, price=price, name=name))

    res = FKKO.objects.bulk_create(
        fkko_list,
        update_conflicts=True,
        unique_fields=["code", "company"],
        update_fields=["name", "price"],
    )
    updated_count = len(res)
    log.info(f"Updated FKKO: {updated_count}")
    return updated_count
