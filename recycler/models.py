from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class TicketStatus(models.TextChoices):
    CREATED = "cr", _("Создан")
    PROCESSING = "pr", _("В обработке")
    ARCHIVE = "ar", _("Архив")
    NON_COMPLIANCE = "nc", _("Несоответствие")
    ERROR = "er", _("Ошибка")


class CompanyStatus(models.TextChoices):
    CREATED = "cr", _("Создан")
    READY = "re", _("Готов к работе")


class ModelDates(models.Model):
    created_at = models.DateTimeField(_("Дата создания"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Дата редактирования"), auto_now=True)

    class Meta:
        abstract = True


class Landfill(ModelDates):
    name = models.CharField(_("Название"), max_length=100)
    location = models.CharField(_("Локация текстом"), max_length=255, null=True, blank=True)

    class Meta:
        verbose_name = _("Наименование площадки")
        verbose_name_plural = _("Наименование площадок")

    def __str__(self) -> str:
        return self.name


class Company(ModelDates):
    author = models.ForeignKey(
        User,
        models.SET_NULL,
        verbose_name=_("Автор"),
        related_name="company_author",
        null=True,
        blank=True,
    )
    name = models.CharField(_("Название"), max_length=100)
    status = models.CharField(
        _("Статус"),
        choices=CompanyStatus.choices,
        default=CompanyStatus.CREATED,
        max_length=2,
    )
    landfill = models.ForeignKey(
        Landfill,
        models.CASCADE,
        verbose_name="Наименование площадки",
        related_name="companies",
        null=True,
        blank=True,
    )

    customer = models.CharField(_("Заказчик"), max_length=100, null=True, blank=True)
    contract_num = models.CharField(_("Номер договора"), max_length=100, null=True, blank=True)
    contract_date = models.DateField(_("Дата договора"), null=True, blank=True)
    sum_actual = models.FloatField(_("Сумма фактическая"), max_length=100, null=True, blank=True)
    sum_overall = models.FloatField(_("Сумма общая"), max_length=100, null=True, blank=True)

    contracts: models.QuerySet["CompanyContract"]
    fkko: models.QuerySet["FKKO"]
    ticket_template: "TicketTemplate"

    class Meta:
        verbose_name = _("Компания")
        verbose_name_plural = _("Компании")

    def __str__(self) -> str:
        return self.name

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None) -> None:
        super().save(force_insert, force_update, using, update_fields)
        try:
            self.ticket_template
        except TicketTemplate.DoesNotExist:
            TicketTemplate.objects.create(company=self)

    def balance_increase(self, amount: int | float):
        self.sum_actual = models.F("sum_actual") + amount
        self.save(update_fields=["sum_actual"])
        self.refresh_from_db()

    def balance_decrease(self, amount: int | float):
        self.sum_actual = models.F("sum_actual") - amount
        self.save(update_fields=["sum_actual"])
        self.refresh_from_db()


class CompanyContract(ModelDates):
    file = models.FileField(_("Файл договора"))
    name = models.CharField(_("Название"), max_length=100)
    company = models.ForeignKey(
        Company,
        models.CASCADE,
        verbose_name=_("Компания"),
        related_name="contracts",
    )

    class Meta:
        verbose_name = _("Контракт")
        verbose_name_plural = _("Контракты")

    def __str__(self) -> str:
        return self.name


class FKKO(ModelDates):
    code = models.CharField(_("Код"), max_length=100)
    name = models.CharField(_("Наименование кода"), max_length=255)
    security_class = models.CharField(_("Класс опасности"), max_length=100, blank=True)
    price = models.FloatField(_("Стоимость"))
    company = models.ForeignKey(
        Company,
        models.CASCADE,
        verbose_name=_("Компания"),
        related_name="fkko",
    )
    contract = models.ForeignKey(
        CompanyContract,
        models.CASCADE,
        verbose_name=_("Контракт"),
        related_name="fkko",
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = _("ФККО")
        verbose_name_plural = _("ФККО")
        unique_together = ("code", "company")

    def __str__(self):
        return f"{self.company.name} - {self.name}"


class BaseTicket(models.Model):
    fkko = models.ForeignKey(FKKO, models.CASCADE, verbose_name=_("ФККО"), null=True)
    car_num = models.CharField(_("Номер машины"), max_length=100, blank=True)
    mass_full = models.FloatField(_("Масса полная"), null=True, blank=True)
    mass_empty = models.FloatField(_("Масса пустая"), null=True, blank=True)

    class Meta:
        abstract = True


class TicketTemplate(BaseTicket):
    fkko = models.ForeignKey(FKKO, models.CASCADE, verbose_name=_("ФККО"), null=True, blank=True)
    company = models.OneToOneField(
        Company,
        models.CASCADE,
        verbose_name="Компания",
        related_name="ticket_template",
    )

    class Meta:
        verbose_name = _("Шаблон талона")
        verbose_name_plural = _("Шаблоны талона")


class Ticket(BaseTicket, ModelDates):
    num = models.CharField(_("Номер талона"), max_length=50, null=True, blank=True, unique=True)
    car_model = models.CharField(_("Номер машины"), max_length=100, blank=True)
    author = models.ForeignKey(
        User,
        models.SET_NULL,
        verbose_name=_("Автор"),
        related_name="ticket_author",
        null=True,
        blank=True,
    )
    company = models.ForeignKey(
        Company,
        models.CASCADE,
        verbose_name="Компания",
        related_name="tickets",
    )
    landfill = models.ForeignKey(
        Landfill,
        models.CASCADE,
        verbose_name="Наименование площадки",
        related_name="tickets",
        null=True,
        blank=False,
    )
    status = models.CharField(
        _("Статус"),
        choices=TicketStatus.choices,
        default=TicketStatus.CREATED,
        max_length=2,
    )
    approve_status = models.BooleanField(_("Статус подтверждения"), null=True)

    ticket_volume = models.CharField(_("Объем в талоне"), max_length=50, null=True, blank=True)
    actual_volume = models.CharField(_("Объем фактический"), max_length=50, null=True, blank=True)
    short_name = models.CharField(_("Отход кратко"), max_length=100, null=True, blank=True)
    waste_image = models.ImageField(_("Фото отхода"), null=True, blank=True)  # For non-compliance report

    noncompliance_reports: models.QuerySet["NonComplianceReport"]

    class Meta:
        verbose_name = _("Талон")
        verbose_name_plural = _("Талоны")
        ordering = ["-created_at"]

    def __str__(self):
        return f"#{self.pk}"

    # @property
    # def price_ticket(self):
    #     if not self.ticket_volume or not self.fkko:
    #         return 0

    #     return (float(self.ticket_volume) / 1000) * self.fkko.price

    @property
    def mass_contents(self):
        return (self.mass_full or 0) - (self.mass_empty or 0)

    @property
    def price_actual(self):
        if not self.mass_full or not self.mass_empty or not self.fkko:
            return 0

        return (float(self.mass_contents)) * self.fkko.price


class NonComplianceReport(ModelDates):
    author = models.ForeignKey(
        User,
        models.SET_NULL,
        verbose_name=_("Автор"),
        related_name="noncompliance_author",
        null=True,
        blank=True,
    )
    ticket = models.ForeignKey(
        Ticket,
        models.CASCADE,
        verbose_name="Талон",
        related_name="noncompliance_reports",
    )

    car_model = models.CharField(_("Наименование транспортного средства"), max_length=50, blank=True)
    car_num = models.CharField(_("Номер машины"), max_length=100, blank=True)
    car_driver = models.CharField(_("ФИО водителя"), max_length=100, blank=True)
    description = models.TextField(_("Описание"), blank=True)
