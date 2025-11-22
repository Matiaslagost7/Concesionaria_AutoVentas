"""
URLs principales de la aplicación Concesionaria
==================================================
Estructura organizativa:
- / → URLs públicas (catálogo, contacto, etc.)
- /panel/ → URLs administrativas (inventario, gestión)
- /admin/ → Panel de administración de Django
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ========================================================================
    # PANEL DE ADMINISTRACIÓN DJANGO
    # ========================================================================
    path('admin/', admin.site.urls),
    
    # ========================================================================
    # URLs PÚBLICAS - Sin autenticación requerida
    # ========================================================================
    path('', include('myapp_conces.urls')),
    
    # ========================================================================
    # URLs ADMINISTRATIVAS - Panel de gestión con autenticación
    # ========================================================================
    path('panel/', include('myapp_login.urls')),
]

# ============================================================================
# CONFIGURACIÓN PARA ARCHIVOS MULTIMEDIA (Solo en desarrollo)
# ============================================================================
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)