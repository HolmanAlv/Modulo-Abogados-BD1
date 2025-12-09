// Este es para comunicar el frontend con el backend a través de la API RESTful

const API_BASE_URL = "http://localhost:8000/api";

let clienteSeleccionado = null;
let casoSeleccionado = null;
let expedienteSeleccionado = null;
let modoEdicion = false;

document.addEventListener("DOMContentLoaded", () => {
    inicializarFechaHeader();
    inicializarEstadoInicial();
    inicializarEventosPestañas();
    inicializarEventosCaso();
    inicializarEventosExpediente();
    inicializarEventosModal();
});

// Inicializar estado inicial de todos los campos
function inicializarEstadoInicial() {
    // Todos los campos deshabilitados excepto el campo de nombre cliente
    document.getElementById("noCaso").disabled = true;
    document.getElementById("fechaInicio").disabled = true;
    document.getElementById("fechaFin").disabled = true;
    document.getElementById("especializacion").disabled = true;
    document.getElementById("valor").disabled = true;
    document.getElementById("nDocumento").disabled = true;
    document.getElementById("btnCrearCaso").disabled = true;
    document.getElementById("btnGuardarCaso").disabled = true;
    document.getElementById("btnAcuerdoPago").disabled = true;
    
    // Campo de nombre cliente habilitado
    document.getElementById("nombreApellidoCliente").disabled = false;
}

// Mostrar fecha actual en el header
function inicializarFechaHeader() {
    const dateElement = document.getElementById("currentDate");
    if (dateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('es-ES', options);
    }
}

// Para cada cambio de pestaña
function inicializarEventosPestañas() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Se remueve la clase active (de todos)
            tabBtns.forEach((b) => b.classList.remove("active"));
            tabContents.forEach((t) => t.classList.remove("active"));

            btn.classList.add("active");
            const tabId = btn.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");

            // cargar datos cuando es expediente
            if (tabId === "expediente" && casoSeleccionado) {
                cargarExpedientesCaso(casoSeleccionado.noCaso);
            }
        });
    });
}

// Para la pestaña caso
function inicializarEventosCaso() {
    const btnBuscarCliente = document.getElementById("btnBuscarCliente");
    const btnCrearCaso = document.getElementById("btnCrearCaso");
    const btnGuardarCaso = document.getElementById("btnGuardarCaso");
    const nombreApellidoInput = document.getElementById("nombreApellidoCliente");

    btnBuscarCliente.addEventListener("click", async () => {
        const nombreApellido = nombreApellidoInput.value.trim().split(" ");
        if (nombreApellido.length < 2) {
            alert("Por favor ingrese nombre y apellido");
            return;
        }

        const nombre = nombreApellido[0];
        const apellido = nombreApellido.slice(1).join(" ");

        try {
            const response = await fetch(
                `${API_BASE_URL}/cliente/buscar/${nombre}/${apellido}`
            );
            const clientes = await response.json();

            if (clientes.length === 0) {
                // Cliente no encontrado - mostrar alerta para crear
                if (confirm("Cliente no encontrado. ¿Desea crear un nuevo cliente?")) {
                    alert("La funcionalidad de creación de cliente no está implementada aún.");
                }
                document.getElementById("resultadosBusquedaCliente").classList.remove("mostrar");
                return;
            }

            // Si solo hay un cliente, seleccionarlo automáticamente
            if (clientes.length === 1) {
                await seleccionarCliente(clientes[0]);
            } else {
                mostrarResultadosBusqueda(clientes);
            }
        } catch (error) {
            console.error("Error en búsqueda:", error);
            alert("Error al buscar cliente");
        }
    });

    btnCrearCaso.addEventListener("click", async () => {
        if (!clienteSeleccionado) {
            alert("Por favor seleccione un cliente");
            return;
        }

        // Limpiar campos del caso anterior
        document.getElementById("noCaso").value = "(Nuevo)";
        document.getElementById("fechaInicio").value = "";
        document.getElementById("fechaFin").value = "";
        document.getElementById("especializacion").value = "";
        document.getElementById("valor").value = "";

        // Habilitar campos para nuevo caso
        document.getElementById("fechaInicio").disabled = false;
        document.getElementById("especializacion").disabled = false;
        document.getElementById("valor").disabled = false;
        document.getElementById("btnAcuerdoPago").disabled = false;
        btnGuardarCaso.disabled = false;
        btnCrearCaso.disabled = true;

        await cargarEspecializaciones();

        modoEdicion = true;
        casoSeleccionado = null;
    });

    btnGuardarCaso.addEventListener("click", async () => {
        if (!clienteSeleccionado) {
            alert("Cliente no seleccionado");
            return;
        }

        const fechaInicio = document.getElementById("fechaInicio").value;
        const valor = document.getElementById("valor").value;
        const codEspecializacion = document.getElementById("especializacion").value;

        if (!fechaInicio || !valor || !codEspecializacion) {
            alert("Complete todos los campos requeridos");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/caso/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fechaInicio: fechaInicio,
                    fechaFin: null,  // Siempre NULL al crear
                    valor: valor,
                    codEspecializacion: codEspecializacion,
                    codCliente: clienteSeleccionado.codCliente,
                }),
            });

            const result = await response.json();
            if (result.success) {
                alert(`Caso ${result.noCaso} creado exitosamente`);
                
                // Recargar el caso creado
                await cargarCaso(result.noCaso);
                
                // Actualizar el select con el nuevo caso
                const selectNoCaso = document.getElementById("noCaso");
                const option = document.createElement("option");
                option.value = result.noCaso;
                option.textContent = `Caso ${result.noCaso} - ${fechaInicio}`;
                selectNoCaso.appendChild(option);
                selectNoCaso.value = result.noCaso;
                selectNoCaso.disabled = false;
                
                // Deshabilitar campos después de guardar
                document.getElementById("fechaInicio").disabled = true;
                document.getElementById("especializacion").disabled = true;
                document.getElementById("valor").disabled = true;
                document.getElementById("btnGuardarCaso").disabled = true;
                document.getElementById("btnCrearCaso").disabled = false;
            }
        } catch (error) {
            console.error("Error al crear caso:", error);
            alert("Error al crear caso");
        }
    });

    nombreApellidoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            btnBuscarCliente.click();
        }
    });

    // Botón Acuerdo de Pago
    const btnAcuerdoPago = document.getElementById("btnAcuerdoPago");
    btnAcuerdoPago.addEventListener("click", () => {
        if (!casoSeleccionado || !casoSeleccionado.noCaso) {
            alert("Debe guardar el caso primero antes de crear un acuerdo de pago.");
            return;
        }
        alert("La funcionalidad de Acuerdo de Pago no está implementada aún.");
    });

    // Botón Crear Cliente
    const btnCrearCliente = document.getElementById("btnCrearCliente");
    btnCrearCliente.addEventListener("click", () => {
        alert("La funcionalidad de creación de cliente no está implementada aún.");
    });

    // Select de casos - cambiar caso cuando se selecciona de la lista
    const selectNoCaso = document.getElementById("noCaso");
    selectNoCaso.addEventListener("change", async (e) => {
        const noCaso = e.target.value;
        if (noCaso && noCaso !== "") {
            await cargarCaso(parseInt(noCaso));
        }
    });
}

// Para la pestaña espediente
function inicializarEventosExpediente() {
    const btnCrearExpediente = document.getElementById("btnCrearExpediente");
    const btnGuardarExpediente = document.getElementById("btnGuardarExpediente");
    const btnImprimirCaso = document.getElementById("btnImprimirCaso");
    const btnAdjuntarDoc = document.getElementById("btnAdjuntarDoc");

    btnCrearExpediente.addEventListener("click", async () => {
        if (!casoSeleccionado) {
            alert("Seleccione un caso primero");
            return;
        }

        document.getElementById("fechaEtapa").disabled = false;
        document.getElementById("abogado").disabled = false;
        document.getElementById("ciudad").disabled = false;
        document.getElementById("entidad").disabled = false;
        document.getElementById("impugnacion").disabled = false;
        document.getElementById("suceso").disabled = false;
        document.getElementById("resultado").disabled = false;
        document.getElementById("btnAnteriorSuceso").disabled = false;
        document.getElementById("btnSiguienteSuceso").disabled = false;
        document.getElementById("btnAnteriorResultado").disabled = false;
        document.getElementById("btnSiguienteResultado").disabled = false;
        document.getElementById("btnAdjuntarDoc").disabled = false;
        btnGuardarExpediente.disabled = false;

        modoEdicion = true;
    });

    //falta estas funcionalidades
    // Ya no ;)
    btnGuardarExpediente.addEventListener("click", async () => {
        if (!casoSeleccionado) {
            alert("Seleccione un caso antes de guardar el expediente");
            return;
        }

        const codEspecializacion = document.getElementById("especializacion").value || casoSeleccionado.codEspecializacion;
        const pasoEtapa = parseInt(document.getElementById("noEtapa").value) || 1;
        const noCaso = parseInt(document.getElementById("noCaso").value) || casoSeleccionado.noCaso;
        const consecExpe = parseInt(document.getElementById("consecExpe").value) || 0;
        const codLugar = document.getElementById("ciudad").value || '';
        const cedula = document.getElementById("abogado").value || '';
        const fechaEtapa = document.getElementById("fechaEtapa").value || new Date().toISOString().slice(0,10);

        const sucesos = [];
        const sucesoVal = document.getElementById("suceso").value.trim();
        if (sucesoVal) sucesos.push({ descSuceso: sucesoVal });

        const resultados = [];
        const resultadoVal = document.getElementById("resultado").value.trim();
        if (resultadoVal) resultados.push({ descResul: resultadoVal });

        const payload = {
            codEspecializacion,
            pasoEtapa,
            noCaso,
            consecExpe: consecExpe || 0,
            codLugar,
            cedula,
            fechaEtapa,
            sucesos,
            resultados
        };

        try {
            const resp = await fetch(`${API_BASE_URL}/expediente/guardar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
            if (data.success) {
                alert('Expediente guardado');
                if (payload.consecExpe && payload.consecExpe > 0) {
                    cargarExpedienteDetalle(payload.consecExpe);
                }
            } else {
                alert('Respuesta inesperada al guardar expediente');
            }
        } catch (err) {
            console.error('Error guardando expediente:', err);
            alert('Error guardando expediente');
        }
    });

    btnImprimirCaso.addEventListener("click", () => {
        if (!casoSeleccionado) {
            alert('Seleccione un caso para imprimir');
            return;
        }
        const url = `${API_BASE_URL.replace('/api','')}/api/caso/${casoSeleccionado.noCaso}/print`;
        const win = window.open(url, '_blank');
        if (win) {
            win.addEventListener('load', () => {
                try { win.print(); } catch (e) { /* ignore */ }
            });
        }
    });

    btnAdjuntarDoc.addEventListener("click", () => {
        if (!expedienteSeleccionado) {
            alert('Seleccione primero un expediente');
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.jpg,.png,.doc,.docx';
        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const form = new FormData();
            form.append('codEspecializacion', expedienteSeleccionado.codEspecializacion || document.getElementById('especializacion').value);
            form.append('pasoEtapa', expedienteSeleccionado.pasoEtapa || document.getElementById('noEtapa').value);
            form.append('noCaso', expedienteSeleccionado.noCaso || document.getElementById('noCaso').value);
            form.append('consecExpe', expedienteSeleccionado.consecExpe || document.getElementById('consecExpe').value || 0);
            form.append('file', file);

            try {
                const resp = await fetch(`${API_BASE_URL}/documento/upload`, {
                    method: 'POST',
                    body: form
                });
                const data = await resp.json();
                if (data.success) {
                    alert('Documento subido');
                    if (expedienteSeleccionado) {
                        cargarExpedienteDetalle(expedienteSeleccionado.consecExpe);
                    }
                } else {
                    alert('Error subiendo documento');
                }
            } catch (err) {
                console.error('Error subiendo documento:', err);
                alert('Error subiendo documento');
            }
        };
        input.click();
    });
}

// Eventos del modal 

function inicializarEventosModal() {
    const modal = document.getElementById("modalEditor");
    const closeBtn = document.querySelector(".close");
    const btnGuardarModal = document.getElementById("btnGuardarModal");

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    btnGuardarModal.addEventListener("click", () => {
        const campo = document.getElementById("modalTextarea").getAttribute("data-campo");
        const valor = document.getElementById("modalTextarea").value;
        document.getElementById(campo).value = valor;
        modal.style.display = "none";
    });

    document.getElementById("suceso").addEventListener("dblclick", () => {
        abrirEditorModal("suceso", "Editar Suceso");
    });

    document.getElementById("resultado").addEventListener("dblclick", () => {
        abrirEditorModal("resultado", "Editar Resultado");
    });
}

//Funciones para el cluente
function mostrarResultadosBusqueda(clientes) {
    const container = document.getElementById("resultadosBusquedaCliente");
    container.innerHTML = "";

    clientes.forEach((cliente) => {
        const div = document.createElement("div");
        div.className = "resultado-item";
        div.textContent = `${cliente.nomCliente} ${cliente.apellCliente} - ${cliente.nDocumento}`;
        div.addEventListener("click", () => seleccionarCliente(cliente));
        container.appendChild(div);
    });

    container.classList.add("mostrar");
}

async function seleccionarCliente(cliente) {
    clienteSeleccionado = cliente;
    document.getElementById("nDocumento").value = cliente.nDocumento;
    document.getElementById("nombreApellidoCliente").value =
        `${cliente.nomCliente} ${cliente.apellCliente}`;
    document.getElementById("resultadosBusquedaCliente").classList.remove("mostrar");
    document.getElementById("btnCrearCaso").disabled = false;

    // Cargar último caso activo y lista de casos del cliente
    try {
        // Obtener último caso activo
        const responseUltimo = await fetch(`${API_BASE_URL}/caso/ultimo/${cliente.codCliente}`);
        const ultimoCaso = await responseUltimo.json();

        // Obtener todos los casos activos para el dropdown
        const responseCasos = await fetch(`${API_BASE_URL}/caso/activos/${cliente.codCliente}`);
        const casosActivos = await responseCasos.json();

        const selectNoCaso = document.getElementById("noCaso");
        selectNoCaso.innerHTML = '<option value="">-- Seleccionar --</option>';
        
        // Poblar lista desplegable con casos activos
        casosActivos.forEach(caso => {
            const option = document.createElement("option");
            option.value = caso.noCaso;
            option.textContent = `Caso ${caso.noCaso} - ${caso.fechaInicio}`;
            selectNoCaso.appendChild(option);
        });

        // Si hay último caso, cargarlo automáticamente
        if (ultimoCaso && ultimoCaso.noCaso) {
            selectNoCaso.value = ultimoCaso.noCaso;
            selectNoCaso.disabled = false;
            await cargarCaso(ultimoCaso.noCaso);
        } else {
            // No hay casos activos, habilitar creación
            selectNoCaso.disabled = true;
            limpiarFormularioCaso();
        }
    } catch (error) {
        console.error("Error al cargar casos del cliente:", error);
        document.getElementById("noCaso").disabled = true;
    }
}

// Funciones para el caso

async function cargarCaso(noCaso) {
    try {
        const response = await fetch(`${API_BASE_URL}/caso/${noCaso}`);
        const caso = await response.json();

        casoSeleccionado = caso;
        
        // Cargar especializaciones primero para poder seleccionar la correcta
        await cargarEspecializaciones();
        
        document.getElementById("fechaInicio").value = caso.fechaInicio;
        document.getElementById("fechaFin").value = caso.fechaFin || "";
        document.getElementById("valor").value = caso.valor;
        document.getElementById("especializacion").value = caso.codEspecializacion;
        document.getElementById("noCasoExp").value = caso.noCaso;

        // Modo consulta: deshabilitar todos los campos de edición
        document.getElementById("fechaInicio").disabled = true;
        document.getElementById("especializacion").disabled = true;
        document.getElementById("valor").disabled = true;
        document.getElementById("fechaFin").disabled = true;
        document.getElementById("btnGuardarCaso").disabled = true;
        document.getElementById("btnAcuerdoPago").disabled = false;
        document.getElementById("btnCrearCaso").disabled = false;

        modoEdicion = false;
    } catch (error) {
        console.error("Error al cargar caso:", error);
        alert("Error al cargar caso");
    }
}

async function cargarEspecializaciones() {
    try {
        const response = await fetch(`${API_BASE_URL}/especializacion/`);
        const especializaciones = await response.json();

        const select = document.getElementById("especializacion");
        
        // Guardar el valor actual si existe
        const valorActual = select.value;
        
        select.innerHTML = '<option value="">-- Seleccionar --</option>';
        
        especializaciones.forEach(esp => {
            const option = document.createElement("option");
            option.value = esp.codEspecializacion;
            option.textContent = esp.nomEspecializacion;
            select.appendChild(option);
        });

        // Restaurar el valor si existía
        if (valorActual) {
            select.value = valorActual;
        }
    } catch (error) {
        console.error("Error al cargar especializaciones:", error);
    }
}

function limpiarFormularioCaso() {
    const selectNoCaso = document.getElementById("noCaso");
    selectNoCaso.innerHTML = '<option value="">-- Seleccionar --</option>';
    selectNoCaso.disabled = true;
    
    document.getElementById("fechaInicio").value = "";
    document.getElementById("fechaFin").value = "";
    document.getElementById("especializacion").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("nDocumento").value = "";
    document.getElementById("nombreApellidoCliente").value = "";
    
    // Deshabilitar todos los campos excepto nombre cliente
    document.getElementById("fechaInicio").disabled = true;
    document.getElementById("especializacion").disabled = true;
    document.getElementById("valor").disabled = true;
    document.getElementById("fechaFin").disabled = true;
    document.getElementById("nDocumento").disabled = true;
    document.getElementById("btnCrearCaso").disabled = true;
    document.getElementById("btnGuardarCaso").disabled = true;
    document.getElementById("btnAcuerdoPago").disabled = true;
    
    clienteSeleccionado = null;
    casoSeleccionado = null;
    modoEdicion = false;
}

// Funciones para el expediente
async function cargarExpedientesCaso(noCaso) {
    try {
        const response = await fetch(`${API_BASE_URL}/expediente/caso/${noCaso}`);
        const expedientes = await response.json();

        if (expedientes.length > 0) {
            cargarExpedienteDetalle(expedientes[0].consecExpe);
            document.getElementById("btnCrearExpediente").disabled = true;
        } else {
            document.getElementById("btnCrearExpediente").disabled = false;
            limpiarFormularioExpediente();
        }
    } catch (error) {
        console.error("Error al cargar expedientes:", error);
    }
}

async function cargarExpedienteDetalle(consecExpe) {
    try {
        const response = await fetch(`${API_BASE_URL}/expediente/${consecExpe}`);
        const expediente = await response.json();

        expedienteSeleccionado = expediente;
        document.getElementById("consecExpe").value = expediente.consecExpe;
        document.getElementById("noEtapa").value = expediente.codEtapa;
        document.getElementById("fechaEtapa").value = expediente.fechaEtapa;
        document.getElementById("nomEtapa").value = expediente.nomEtapa;
        document.getElementById("suceso").value = expediente.conSuceso || "";
        document.getElementById("resultado").value = expediente.conResul || "";

        document.getElementById("consecExpe").disabled = true;
        document.getElementById("noEtapa").disabled = true;
        document.getElementById("fechaEtapa").disabled = true;
        document.getElementById("nomEtapa").disabled = true;
    } catch (error) {
        console.error("Error al cargar expediente detalle:", error);
    }
}

function limpiarFormularioExpediente() {
    document.getElementById("consecExpe").value = "";
    document.getElementById("noEtapa").value = "";
    document.getElementById("fechaEtapa").value = "";
    document.getElementById("nomEtapa").value = "";
    document.getElementById("instancia").value = "";
    document.getElementById("abogado").value = "";
    document.getElementById("ciudad").value = "";
    document.getElementById("entidad").value = "";
    document.getElementById("impugnacion").value = "";
    document.getElementById("suceso").value = "";
    document.getElementById("resultado").value = "";
}

// Funciones del modal
function abrirEditorModal(campo, titulo) {
    const modal = document.getElementById("modalEditor");
    const textarea = document.getElementById("modalTextarea");

    document.getElementById("modalTitle").textContent = titulo;
    textarea.setAttribute("data-campo", campo);
    textarea.value = document.getElementById(campo).value;
    modal.style.display = "flex";
}

// Para los errores

window.addEventListener("error", (event) => {
    console.error("Error global:", event.error);
});

console.log("✓ Los scrips se han cargado correctamente");
console.log(`✓ URL usada para la API: ${API_BASE_URL}`);
