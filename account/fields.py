from django_case_insensitive_field import CaseInsensitiveFieldMixin
from django.db.models import CharField

class CaseInsensitiveCharField(CaseInsensitiveFieldMixin, CharField):
    pass
