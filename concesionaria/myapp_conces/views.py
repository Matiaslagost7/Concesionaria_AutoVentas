from django.shortcuts import render, redirect
from django.db import models
from .models import Automovil
from .forms import ContactoForm

# Vista para la página de inicio
def index(request):
    """
    Vista para la página de inicio.
    """
    return render(request, 'index.html')

# Vista para el formulario de contacto
def contacto(request):
    if request.method == 'POST':
        form = ContactoForm(request.POST)
        if form.is_valid():
            # Procesar el formulario
            nombre = form.cleaned_data['nombre']
            correo = form.cleaned_data['correo']
            mensaje = form.cleaned_data['mensaje']
            # Aquí podrías enviar un correo o guardar el mensaje en la base de datos
            return render(request, 'contacto_exito.html', {'nombre': nombre})
    else:
        form = ContactoForm()
    return render(request, 'contacto.html', {'form': form})

# Vista para mostrar el catálogo de automóviles
def catalogo(request):
    automoviles = Automovil.objects.all()
    if not automoviles:
        mensaje = "No hay automóviles disponibles en el catálogo."
        return render(request, 'catalogo.html', {'mensaje': mensaje})
    
    return render(request, 'catalogo.html', {'automoviles': automoviles})

# ========================================================================
# NOTA: Las vistas de administración (inventario, crear, editar, eliminar)
# han sido movidas a myapp_login/views.py para mantener separación clara
# entre funcionalidades públicas y administrativas
# ========================================================================

# Vista pública para mostrar el detalle de un automóvil
def detalle_automovil(request, automovil_id):
    """
    Vista pública para mostrar los detalles de un automóvil específico.
    Esta es la vista pública del catálogo, sin requerir autenticación.
    """
    try:
        automovil = Automovil.objects.get(id=automovil_id, disponible=True)
        return render(request, 'detalle_auto.html', {'auto': automovil})
    except Automovil.DoesNotExist:
        return render(request, 'catalogo.html', {
            'mensaje': 'El automóvil solicitado no está disponible.'
        })

# Vista para buscar automóviles en el catálogo público
def buscar_automovil(request):
    """
    Vista pública para buscar automóviles en el catálogo.
    """
    query = request.GET.get('q', '')
    resultados = []
    
    if query:
        resultados = Automovil.objects.filter(
            (models.Q(marca__icontains=query) | models.Q(modelo__icontains=query)),
            disponible=True
        )
    
    return render(request, 'buscar_automovil.html', {
        'resultados': resultados, 
        'query': query
    })

