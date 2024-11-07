from typing import Iterable, OrderedDict

from drf_writable_nested.mixins import UniqueFieldsMixin
from drf_writable_nested.serializers import WritableNestedModelSerializer
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from accounts.models import ROLES_BUH, ROLES_BUH_INN, User
from accounts.serializers import UserShortSerializer
from accounts.utils import user_has_role
from recycler.models import (
    FKKO,
    Company,
    CompanyContract,
    Landfill,
    NonComplianceReport,
    Ticket,
    TicketTemplate,
)
from recycler.services.ticket import generate_ticket_num


class UserRoleSerializer(serializers.BaseSerializer):
    def _get_user(self) -> User | None:
        """Get request user"""
        request = self.context.get("request")
        user: User | None = getattr(request, "user")
        if user and user.is_authenticated:
            return user
        return None

    # def _get_role(self):
    #     """Get current user role"""
    #     user = self._get_user()
    #     if user:
    #         return get_user_role(user)
    #     return None


class AuthorSerializer(UserRoleSerializer):
    _force_set_author = True

    def create(self, validated_data):
        user = self._get_user()
        create = self.instance is None

        if create and user and (self._force_set_author or "author" not in validated_data):
            # Set author on create
            validated_data["author"] = user

        return super().create(validated_data)

    def get_initial(self):
        res = super().get_initial()
        return res


class HideFieldsSerializer(serializers.BaseSerializer):
    _hidden_field_value = None  # Value of hidden fields

    def _get_hidden_fields(self) -> Iterable[str]:
        """Get list of hidden fields"""
        return []

    def _hide_fields(self, data: OrderedDict) -> OrderedDict:
        """Set hidden fields to null"""
        hidden_fields = self._get_hidden_fields()
        for field in hidden_fields:
            if field in data:
                data[field] = self._hidden_field_value

        return data

    def to_representation(self, instance):
        res = super().to_representation(instance)
        res = self._hide_fields(res)
        return res


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()


class FileUploadResponseSerializer(serializers.Serializer):
    image = serializers.CharField()


###


class CompanyContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyContract
        exclude = ()
        extra_kwargs = {
            "file": {
                "required": False,
            },
            "company": {
                "required": False,
            },
        }


class FKKOSerializer(UserRoleSerializer, HideFieldsSerializer, WritableNestedModelSerializer):
    class Meta:
        model = FKKO
        exclude = ()

    def get_unique_together_validators(self):
        # Remove unique_together validators
        return []

    def get_fields(self):
        f = super().get_fields()
        return f

    def _get_hidden_fields(self) -> Iterable[str]:
        res = set()
        user = self._get_user()
        if not user or not user_has_role(user, ROLES_BUH_INN, include_admin=True):
            # Price only for internal buh's
            res.add("price")
        return res


class CompanyShortSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    fkko = FKKOSerializer(many=True, required=False)

    class Meta:
        model = Company
        fields = ("id", "name", "fkko", "contract_num", "contract_date")


class LandfillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landfill
        exclude = ()


class TicketTemplateSerializer(UniqueFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = TicketTemplate
        exclude = ()


class TicketSerializer(AuthorSerializer, serializers.ModelSerializer):
    company = CompanyShortSerializer(read_only=True)
    landfill = LandfillSerializer(read_only=True)
    landfill_id = serializers.PrimaryKeyRelatedField(
        queryset=Landfill.objects.all(), source="landfill", write_only=True
    )
    company_id = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), source="company", write_only=True)

    fkko = FKKOSerializer(read_only=True)
    fkko_id = serializers.PrimaryKeyRelatedField(queryset=FKKO.objects.all(), source="fkko", write_only=True)
    author = UserShortSerializer(required=False, read_only=True)

    report_sent = serializers.SerializerMethodField()
    price_actual = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        exclude = ()
        read_only_fields = ("author", "waste_image")  # "status",

    def create(self, validated_data):
        if company := validated_data["company"]:
            company: Company
            if company.sum_actual is not None and company.sum_actual <= 0:
                raise ValidationError("Недостаточный баланс компании")
            validated_data["num"] = generate_ticket_num(company)

        return super().create(validated_data)

    def get_report_sent(self, obj: Ticket):
        rep = obj.noncompliance_reports.first()
        if rep:
            return rep.pk
        return None

    def get_price_actual(self, obj: Ticket):
        user = self._get_user()
        if not user or not user_has_role(user, ROLES_BUH, include_admin=True):
            return None
        return obj.price_actual


class TicketShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ("id", "num", "company")


class NonComplianceReportSerializer(AuthorSerializer, serializers.ModelSerializer):
    ticket = TicketSerializer(read_only=True)
    ticket_id = serializers.PrimaryKeyRelatedField(queryset=Ticket.objects.all(), source="ticket", write_only=True)
    author = UserShortSerializer(required=False, read_only=True)

    class Meta:
        model = NonComplianceReport
        exclude = ()
        read_only_fields = ("author", "ticket")


class CompanySerializer(AuthorSerializer, WritableNestedModelSerializer):
    author = UserShortSerializer(required=False, read_only=True)
    contracts = CompanyContractSerializer(many=True, required=False, read_only=True)
    fkko = FKKOSerializer(many=True, required=False)
    ticket_template = TicketTemplateSerializer(required=False)

    landfill = LandfillSerializer(read_only=True, required=False)
    landfill_id = serializers.PrimaryKeyRelatedField(
        queryset=Landfill.objects.all(), source="landfill", write_only=True, required=False
    )

    class Meta:
        model = Company
        exclude = ()
        read_only_fields = ("status", "author")


class CompanyBuhExtSerializer(CompanySerializer):
    class Meta(CompanySerializer.Meta):
        # fields = ("id", "name", "fkko", "contract_num", "contract_date", "contracts")
        exclude = ()
        read_only_fields = ("status", "author", "contracts", "fkko")
