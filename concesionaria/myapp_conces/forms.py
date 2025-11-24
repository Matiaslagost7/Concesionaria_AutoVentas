from django import forms
from .models import Automovil

class ContactoForm(forms.Form):
    nombre = forms.CharField(
        label='Nombre completo',
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Ingresa tu nombre completo',
            'required': True
        })
    )
    
    correo = forms.EmailField(
        label='Correo electrónico',
        widget=forms.EmailInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'ejemplo@correo.com',
            'required': True
        })
    )
    
    mensaje = forms.CharField(
        label='Mensaje',
        widget=forms.Textarea(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Escribe tu mensaje aquí... Cuéntanos sobre el vehículo de tu interés o cualquier consulta que tengas.',
            'rows': 5,
            'required': True
        })
    )
    
    def clean_nombre(self):
        nombre = self.cleaned_data.get('nombre')
        if len(nombre.strip()) < 2:
            raise forms.ValidationError("El nombre debe tener al menos 2 caracteres.")
        return nombre.strip().title()
    
    def clean_mensaje(self):
        mensaje = self.cleaned_data.get('mensaje')
        if len(mensaje.strip()) < 10:
            raise forms.ValidationError("El mensaje debe tener al menos 10 caracteres.")
        return mensaje.strip()

class AutomovilForm(forms.ModelForm):
    class Meta:
        model = Automovil
        fields = ['marca', 'modelo', 'anio', 'precio', 'disponible', 'cantidad', 'imagen', 'descripcion']
        widgets = {
            'marca': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej: Toyota, Ford, BMW'}),
            'modelo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej: Corolla, Mustang, X3'}),
            'anio': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': '2024'}),
            'precio': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': '25000.00'}),
            'disponible': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'cantidad': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Cantidad en stock', 'min': 0}),
            'imagen': forms.FileInput(attrs={'class': 'form-control', 'accept': 'image/*'}),
            'descripcion': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Descripción del vehículo...'})
        }
        labels = {
            'marca': 'Marca del vehículo',
            'modelo': 'Modelo',
            'anio': 'Año',
            'precio': 'Precio (USD)',
            'disponible': 'Disponible para venta',
            'cantidad': 'Cantidad en stock',
            'imagen': 'Imagen del vehículo',
            'descripcion': 'Descripción'
        }
