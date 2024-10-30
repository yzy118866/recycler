from django.http import HttpRequest, HttpResponseForbidden, JsonResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import decorators, parsers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.models import ROLES_ADMIN, ROLES_BUH_EXT, ROLES_BUH_INN, ROLES_EXT, ROLES_INN, User, UserRole
from accounts.permissions import RolePermission
from accounts.utils import roles_join, user_has_role
from recycler.models import (
    Company,
    CompanyContract,
    Landfill,
    NonComplianceReport,
    Ticket,
)
from recycler.serializers import (
    CompanyBuhExtSerializer,
    CompanyContractSerializer,
    CompanySerializer,
    CompanyShortSerializer,
    FileUploadResponseSerializer,
    FileUploadSerializer,
    LandfillSerializer,
    NonComplianceReportSerializer,
    TicketSerializer,
)
from recycler.services.parse_fkko import parse_fkko


def extend_all_methods(
    schema, methods: list[str] = ["create", "destroy", "list", "partial_update", "retrieve", "update"]
):
    """Extend all view methods"""
    res = {}
    for method_name in methods:
        res[method_name] = schema
    return res


@extend_schema_view(**extend_all_methods(extend_schema(responses={200: CompanySerializer})))
class CompanyViewset(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    search_fields = ("name", "customer")
    permission_classes = [RolePermission(ROLES_BUH_INN, allow_safe=True)]

    def get_serializer_class(self):
        if user_has_role(self.request.user, ROLES_BUH_EXT, include_admin=True):
            return CompanyBuhExtSerializer
        if not user_has_role(self.request.user, ROLES_BUH_INN, include_admin=True):
            return CompanyShortSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        qs = super().get_queryset()
        user: User = self.request.user  # type: ignore
        if user.company and user_has_role(user, ROLES_EXT, include_admin=False):
            return qs.filter(id=user.company_id)  # type: ignore
        return qs


class CompanyContractViewset(viewsets.ModelViewSet):
    queryset = CompanyContract.objects.all()
    serializer_class = CompanyContractSerializer
    search_fields = ("name",)
    permission_classes = [
        RolePermission(ROLES_BUH_INN, allow_safe=False)
        # | (RolePermission(ROLES_BUH_EXT, allow_safe=False) & permissions.ReadOnly)
    ]
    parser_classes = (parsers.MultiPartParser, parsers.JSONParser)

    @action(detail=True)
    def parse_fkko(self, request, pk=None):
        contract = get_object_or_404(self.get_queryset(), pk=pk)

        res = parse_fkko(contract)

        return Response({"ok": True, "count": res})


class TicketViewset(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [RolePermission(roles_join(ROLES_EXT, ROLES_INN), allow_safe=True)]
    filterset_fields = ["company", "status", "author"]
    # parser_classes = (parsers.MultiPartParser,)

    def get_queryset(self):
        qs = super().get_queryset()
        user: User = self.request.user  # type: ignore
        if user_has_role(user, ROLES_EXT) and user.company:
            qs = qs.filter(company=user.company)
        return qs

    @extend_schema(
        request=FileUploadSerializer,
        responses=FileUploadResponseSerializer,
    )
    @decorators.action(["patch"], detail=True, parser_classes=[parsers.MultiPartParser])
    def upload_waste_image(self, request: HttpRequest, pk=None):
        ticket = get_object_or_404(Ticket, pk=pk)

        if not user_has_role(request.user, [UserRole.OTV, UserRole.DISPATCHER], include_admin=True):
            return HttpResponseForbidden()

        uploaded_file = request.FILES.get("file")
        ticket.waste_image = uploaded_file
        ticket.save(update_fields=["waste_image"])

        return JsonResponse({"image": str(ticket.waste_image)})


class LandfillViewset(viewsets.ModelViewSet):
    queryset = Landfill.objects.all()
    serializer_class = LandfillSerializer
    permission_classes = [RolePermission(ROLES_ADMIN, allow_safe=True)]
    search_fields = ["name", "location"]


class NonComplianceReportViewset(viewsets.ModelViewSet):
    queryset = NonComplianceReport.objects.all()
    serializer_class = NonComplianceReportSerializer
    permission_classes = [
        RolePermission({UserRole.MANAGER}, allow_safe=False) | RolePermission(ROLES_INN, allow_safe=True)
    ]

    def get_queryset(self):
        user = self.request.user

        # Admin can see all reports, user only own.
        if user_has_role(user, ROLES_BUH_INN) or user_has_role(user, {UserRole.MANAGER}):
            return self.queryset

        return self.queryset.filter(author=user)
