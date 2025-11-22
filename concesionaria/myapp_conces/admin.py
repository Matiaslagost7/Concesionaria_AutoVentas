from django.contrib import admin
from .models import Automovil

# Register your models here.
class AutomovilAdmin(admin.ModelAdmin):
    list_display = ('marca', 'modelo', 'anio', 'precio', 'disponible')
    search_fields = ('marca', 'modelo')
    list_filter = ('anio', 'precio')

admin.site.register(Automovil, AutomovilAdmin)
