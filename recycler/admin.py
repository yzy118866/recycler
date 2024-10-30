from django.contrib import admin

from recycler.models import (
    FKKO,
    Company,
    CompanyContract,
    Landfill,
    NonComplianceReport,
    Ticket,
    TicketTemplate,
)


class CompanyContractInline(admin.TabularInline):
    model = CompanyContract
    extra = 0


class FKKOInline(admin.TabularInline):
    model = FKKO
    extra = 0


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "status", "customer", "created_at")
    inlines = [CompanyContractInline, FKKOInline]
    list_filter = ("status",)
    search_fields = ("name", "customer")


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("id", "fkko", "status", "created_at")
    list_filter = ("fkko__company", "status")
    search_fields = ("car_num",)
    autocomplete_fields = ("fkko", "author")
    date_hierarchy = "created_at"


@admin.register(TicketTemplate)
class TicketTemplateAdmin(admin.ModelAdmin):
    list_display = ("id", "company", "fkko")
    autocomplete_fields = ("fkko", "company")


@admin.register(FKKO)
class FKKOAdmin(admin.ModelAdmin):
    list_display = ("id", "company", "code", "name")
    search_fields = ("code", "name")


@admin.register(Landfill)
class LandfillAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "location")
    search_fields = ("name", "location")


@admin.register(NonComplianceReport)
class NonComplianceReportAdmin(admin.ModelAdmin):
    list_display = ("id", "car_model", "car_num")
    list_filter = ("ticket__company",)
    search_fields = ("car_model", "car_num", "car_driver", "description")
