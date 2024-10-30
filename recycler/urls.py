from rest_framework import routers

from recycler.views import (
    CompanyContractViewset,
    CompanyViewset,
    LandfillViewset,
    NonComplianceReportViewset,
    TicketViewset,
)

router = routers.DefaultRouter()

router.register("companies", CompanyViewset)
router.register("contracts", CompanyContractViewset)
router.register("tickets", TicketViewset)
router.register("landfills", LandfillViewset)
router.register("reports", NonComplianceReportViewset)
