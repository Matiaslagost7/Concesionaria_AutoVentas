
from django.conf import settings
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
    cantidad = models.PositiveIntegerField(default=1, help_text="Cantidad disponible en stock")

    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.anio})"


    class Meta:
        permissions = [
            ("add_auto", "Puede agregar automóviles"),
            ("change_auto", "Puede modificar automóviles"),
            ("delete_auto", "Puede eliminar automóviles"),
            ("view_inventario", "Puede ver el inventario completo"),
            ("manage_precio", "Puede gestionar precios de automóviles"),
        ]


# Modelo para el carrito de compras
class Carrito(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"Carrito de {self.usuario.username} ({'Activo' if self.activo else 'Cerrado'})"


class ItemCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, related_name='items', on_delete=models.CASCADE)
    automovil = models.ForeignKey(Automovil, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.cantidad} x {self.automovil}"


# Modelo para la compra finalizada
class Compra(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    carrito = models.OneToOneField(Carrito, on_delete=models.CASCADE)
    fecha_compra = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"Compra #{self.id} de {self.usuario.username}"

    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.anio})"

