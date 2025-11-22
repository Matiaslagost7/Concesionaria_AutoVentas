from django.db import models

# Create your models here.
class Automovil(models.Model):
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    anio = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    disponible = models.BooleanField(default=True)
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to='autos/', blank=True, null=True)

    class Meta:
        permissions = [
            ("add_auto", "Puede agregar automóviles"),
            ("change_auto", "Puede modificar automóviles"),
            ("delete_auto", "Puede eliminar automóviles"),
            ("view_inventario", "Puede ver el inventario completo"),
            ("manage_precio", "Puede gestionar precios de automóviles"),
        ]

    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.anio})"

