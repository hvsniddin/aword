from django.contrib import admin
from django.urls import include, path

from rest_framework.permissions import AllowAny
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

api_schema_view = get_schema_view(
    openapi.Info(
        'aword API',
        'v1',
        'aword API endpoint documentation'
    ),
    public=True,
    permission_classes=(AllowAny,)
)

urlpatterns = [
    path('stats/', admin.site.urls),

    path('api', api_schema_view.with_ui('swagger')),
    path('account/', include('account.urls')),
    path('game/', include('game.urls')),
]
