/**
 * JavaScript para Gestión de Inventario
 * Concesionaria AutoVentas - Panel Administrativo
 */

// Manejo del inventario de automóviles
const InventoryManager = {
    // Configuración inicial
    init: () => {
        InventoryManager.setupFilters();
        InventoryManager.setupSearch();
        InventoryManager.setupSorting();
        InventoryManager.setupBulkActions();
        InventoryManager.setupImageLazyLoading();
        InventoryManager.loadInventoryStats();
    },

    // Configurar filtros
    setupFilters: () => {
        const filterForm = document.getElementById('filterForm');
        if (!filterForm) return;

        const filterInputs = filterForm.querySelectorAll('select, input');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                InventoryManager.applyFilters();
            });
        });

        // Reset filtros
        const resetButton = document.getElementById('resetFilters');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                filterForm.reset();
                InventoryManager.applyFilters();
            });
        }
    },

    // Aplicar filtros
    applyFilters: () => {
        const form = document.getElementById('filterForm');
        if (!form) return;

        const formData = new FormData(form);
        const params = new URLSearchParams(formData);
        
        // Mantener parámetros de búsqueda
        const currentParams = new URLSearchParams(window.location.search);
        const search = currentParams.get('search');
        if (search) {
            params.set('search', search);
        }

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.location.href = newUrl;
    },

    // Configurar búsqueda
    setupSearch: () => {
        const searchInput = document.getElementById('searchInput');
        const searchForm = document.getElementById('searchForm');
        
        if (searchInput && searchForm) {
            let searchTimeout;
            
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const query = this.value.trim();
                
                if (query.length >= 2 || query.length === 0) {
                    searchTimeout = setTimeout(() => {
                        InventoryManager.performSearch(query);
                    }, 300);
                }
            });
            
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                InventoryManager.performSearch(searchInput.value.trim());
            });
        }
    },

    // Realizar búsqueda
    performSearch: (query) => {
        const params = new URLSearchParams(window.location.search);
        
        if (query) {
            params.set('search', query);
        } else {
            params.delete('search');
        }
        
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.location.href = newUrl;
    },

    // Configurar ordenamiento
    setupSorting: () => {
        const sortHeaders = document.querySelectorAll('[data-sort]');
        
        sortHeaders.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                const sortBy = this.dataset.sort;
                const currentParams = new URLSearchParams(window.location.search);
                const currentSort = currentParams.get('sort');
                const currentOrder = currentParams.get('order');
                
                let newOrder = 'asc';
                if (currentSort === sortBy && currentOrder === 'asc') {
                    newOrder = 'desc';
                }
                
                currentParams.set('sort', sortBy);
                currentParams.set('order', newOrder);
                
                const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
                window.location.href = newUrl;
            });
        });
    },

    // Configurar acciones masivas
    setupBulkActions: () => {
        const selectAll = document.getElementById('selectAll');
        const itemCheckboxes = document.querySelectorAll('.item-checkbox');
        const bulkActionForm = document.getElementById('bulkActionForm');
        const bulkActionButton = document.getElementById('bulkActionButton');
        
        // Seleccionar/deseleccionar todo
        if (selectAll) {
            selectAll.addEventListener('change', function() {
                itemCheckboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
                InventoryManager.updateBulkActionButton();
            });
        }
        
        // Actualizar estado al seleccionar items individuales
        itemCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                InventoryManager.updateBulkActionButton();
                
                // Actualizar estado de "Seleccionar todo"
                if (selectAll) {
                    const checkedCount = document.querySelectorAll('.item-checkbox:checked').length;
                    selectAll.checked = checkedCount === itemCheckboxes.length;
                    selectAll.indeterminate = checkedCount > 0 && checkedCount < itemCheckboxes.length;
                }
            });
        });
        
        // Manejar acciones masivas
        if (bulkActionForm) {
            bulkActionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const selectedItems = document.querySelectorAll('.item-checkbox:checked');
                const action = document.getElementById('bulkAction').value;
                
                if (selectedItems.length === 0) {
                    alert('Seleccione al menos un elemento');
                    return;
                }
                
                if (action === 'delete') {
                    if (!confirm(`¿Está seguro de que desea eliminar ${selectedItems.length} elemento(s)?`)) {
                        return;
                    }
                }
                
                InventoryManager.executeBulkAction(action, selectedItems);
            });
        }
    },

    // Actualizar botón de acciones masivas
    updateBulkActionButton: () => {
        const button = document.getElementById('bulkActionButton');
        const selectedCount = document.querySelectorAll('.item-checkbox:checked').length;
        
        if (button) {
            button.disabled = selectedCount === 0;
            button.textContent = selectedCount > 0 ? 
                `Acciones (${selectedCount} seleccionados)` : 
                'Acciones masivas';
        }
    },

    // Ejecutar acción masiva
    executeBulkAction: (action, selectedItems) => {
        const itemIds = Array.from(selectedItems).map(item => item.value);
        
        fetch('/panel/automoviles/bulk-action/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({
                action: action,
                item_ids: itemIds
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                alert(data.message || 'Error ejecutando la acción');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error de conexión');
        });
    },

    // Configurar carga lazy de imágenes
    setupImageLazyLoading: () => {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores antiguos
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    },

    // Cargar estadísticas del inventario
    loadInventoryStats: () => {
        fetch('/panel/api/inventory-stats/')
        .then(response => response.json())
        .then(data => {
            InventoryManager.updateStatsDisplay(data);
        })
        .catch(error => {
            console.error('Error cargando estadísticas:', error);
        });
    },

    // Actualizar display de estadísticas
    updateStatsDisplay: (stats) => {
        const elements = {
            totalVehicles: document.getElementById('totalVehicles'),
            availableVehicles: document.getElementById('availableVehicles'),
            soldVehicles: document.getElementById('soldVehicles'),
            totalValue: document.getElementById('totalValue')
        };
        
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element && stats[key] !== undefined) {
                if (key === 'totalValue') {
                    element.textContent = new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'USD'
                    }).format(stats[key]);
                } else {
                    element.textContent = stats[key].toLocaleString('es-ES');
                }
            }
        });
    },

    // Exportar inventario
    exportInventory: (format = 'excel') => {
        const params = new URLSearchParams(window.location.search);
        params.set('export', format);
        
        const exportUrl = `/panel/automoviles/export/?${params.toString()}`;
        
        // Crear enlace temporal para descarga
        const link = document.createElement('a');
        link.href = exportUrl;
        link.download = `inventario_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // Imprimir lista
    printInventory: () => {
        const printWindow = window.open('/panel/automoviles/print/', '_blank');
        printWindow.onload = function() {
            printWindow.print();
        };
    }
};

// Manejo de detalles de vehículo
const VehicleDetails = {
    // Mostrar modal de detalles
    showModal: (vehicleId) => {
        fetch(`/panel/automoviles/${vehicleId}/details/`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                VehicleDetails.renderModal(data.vehicle);
            } else {
                alert('Error cargando detalles del vehículo');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error de conexión');
        });
    },

    // Renderizar modal
    renderModal: (vehicle) => {
        const modalHtml = `
            <div class="modal fade" id="vehicleModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${vehicle.marca} ${vehicle.modelo}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="${vehicle.imagen}" class="img-fluid rounded" alt="${vehicle.marca} ${vehicle.modelo}">
                                </div>
                                <div class="col-md-6">
                                    <h6>Información General</h6>
                                    <p><strong>Marca:</strong> ${vehicle.marca}</p>
                                    <p><strong>Modelo:</strong> ${vehicle.modelo}</p>
                                    <p><strong>Año:</strong> ${vehicle.año}</p>
                                    <p><strong>Precio:</strong> $${vehicle.precio.toLocaleString()}</p>
                                    
                                    <h6>Especificaciones</h6>
                                    <p><strong>Transmisión:</strong> ${vehicle.transmision}</p>
                                    <p><strong>Combustible:</strong> ${vehicle.combustible}</p>
                                    <p><strong>Motor:</strong> ${vehicle.motor}</p>
                                    
                                    ${vehicle.descripcion ? `<h6>Descripción</h6><p>${vehicle.descripcion}</p>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <a href="/panel/automoviles/${vehicle.id}/editar/" class="btn btn-primary">
                                <i class="fas fa-edit"></i> Editar
                            </a>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remover modal existente si existe
        const existingModal = document.getElementById('vehicleModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Agregar nuevo modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('vehicleModal'));
        modal.show();
    }
};

// Utilidades de formato
const FormatUtils = {
    // Formatear precio
    formatPrice: (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    },

    // Formatear número
    formatNumber: (number) => {
        return number.toLocaleString('es-ES');
    },

    // Formatear fecha
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gestor de inventario
    InventoryManager.init();
    
    // Configurar botones de exportar
    const exportButton = document.getElementById('exportButton');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            const format = this.dataset.format || 'excel';
            InventoryManager.exportInventory(format);
        });
    }
    
    // Configurar botón de imprimir
    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', function() {
            InventoryManager.printInventory();
        });
    }
    
    // Configurar enlaces de detalles
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details') || e.target.closest('.view-details')) {
            e.preventDefault();
            const button = e.target.classList.contains('view-details') ? e.target : e.target.closest('.view-details');
            const vehicleId = button.dataset.vehicleId;
            if (vehicleId) {
                VehicleDetails.showModal(vehicleId);
            }
        }
    });
    
    // Configurar tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
});

// Exportar funciones globalmente
window.InventoryManager = InventoryManager;
window.VehicleDetails = VehicleDetails;
window.FormatUtils = FormatUtils;