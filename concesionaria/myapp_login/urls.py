"""
URLs del Panel Administrativo - myapp_login
============================================
Todas las URLs aquí requieren autenticación y permisos específicos.
Prefijo: /panel/

Estructura:
- /panel/login/ → Iniciar sesión
- /panel/register/ → Registrar usuario  
- /panel/logout/ → Cerrar sesión
- /panel/inventario/ → Ver inventario completo
- /panel/crear/ → Crear nuevo automóvil
- /panel/editar/<id>/ → Editar automóvil
- /panel/eliminar/<id>/ → Eliminar automóvil
- /panel/detalle/<id>/ → Ver detalle administrativo
"""

from django.urls import path
from . import views

# Namespace para las URLs administrativas
app_name = 'panel'

urlpatterns = [
    # ========================================================================
    # AUTENTICACIÓN - Login, Register, Logout
    # ========================================================================
    path('login/', views.LoginView, name='login'),
    path('register/', views.RegisterView, name='register'), 
    path('logout/', views.LogoutView, name='logout'),
    
    # ========================================================================
    # GESTIÓN DE INVENTARIO - Requiere permisos específicos
    # ========================================================================
    path('inventario/', views.InventarioView, name='inventario'),
    
    # ========================================================================
    # CRUD DE AUTOMÓVILES - Operaciones administrativas
    # ========================================================================
    path('crear/', views.Crear_AutomovilView, name='crear_automovil'),
    path('editar/<int:automovil_id>/', views.Editar_AutomovilView, name='editar_automovil'),
    path('eliminar/<int:automovil_id>/', views.Eliminar_AutomovilView, name='eliminar_automovil'),
    path('detalle/<int:automovil_id>/', views.Detalle_AutomovilView, name='detalle_automovil'),
]