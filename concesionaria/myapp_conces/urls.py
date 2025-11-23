"""
URLs Públicas - myapp_conces
=============================
Todas las URLs aquí son de acceso público, no requieren autenticación.
Prefijo: / (raíz del sitio)

Estructura:
- / → Página principal
- /catalogo/ → Catálogo de vehículos disponibles
- /contacto/ → Formulario de contacto
- /auto/<id>/ → Detalle público de un vehículo
- /buscar/ → Búsqueda de vehículos
"""

from django.urls import path
from . import views

# Namespace para las URLs públicas
app_name = 'public'

urlpatterns = [
    # ========================================================================
    # PÁGINAS PRINCIPALES - Acceso público
    # ========================================================================
    path('', views.index, name='index'),
    path('catalogo/', views.catalogo, name='catalogo'),
    path('contacto/', views.contacto, name='contacto'),
    
    # ========================================================================
    # FUNCIONALIDADES PÚBLICAS - Sin autenticación
    # ========================================================================
    path('auto/<int:automovil_id>/', views.detalle_automovil, name='detalle_auto'),
    path('buscar/', views.buscar_automovil, name='buscar_automovil'),

    # ===================== PROCESO DE COMPRA =====================
    path('carrito/', views.ver_carrito, name='ver_carrito'),
    path('carrito/agregar/<int:automovil_id>/', views.agregar_al_carrito, name='agregar_al_carrito'),
    path('carrito/eliminar/<int:item_id>/', views.eliminar_del_carrito, name='eliminar_del_carrito'),
    path('carrito/finalizar/', views.finalizar_compra, name='finalizar_compra'),
]
