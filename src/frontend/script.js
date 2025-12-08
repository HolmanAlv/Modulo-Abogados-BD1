// Este es para comunicar el frontend con el backend a través de la API RESTful

const API_BASE_URL = "http://localhost:8000/api";

let clienteSeleccionado = null;
let casoSeleccionado = null;
let expedienteSeleccionado = null;
let modoEdicion = false;

document.addEventListener("DOMContentLoaded", () => {
    inicializarFechaHeader();
    inicializarEventosPestañas();
    inicializarEventosCaso();
    inicializarEventosExpediente();
    inicializarEventosModal();
});

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
                alert("Cliente no encontrado");
                document.getElementById("resultadosBusquedaCliente").classList.remove("mostrar");
                return;
            }

            mostrarResultadosBusqueda(clientes);
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

        document.getElementById("fechaInicio").disabled = false;
        document.getElementById("especializacion").disabled = false;
        document.getElementById("valor").disabled = false;
        btnGuardarCaso.disabled = false;

        cargarEspecializaciones();

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
                    fechaFin: null,
                    valor: valor,
                    codEspecializacion: codEspecializacion,
                    codCliente: clienteSeleccionado.codCliente,
                }),
            });

            const result = await response.json();
            if (result.success) {
                alert(`Caso ${result.noCaso} creado exitosamente`);
                casoSeleccionado = result;
                document.getElementById("noCaso").value = result.noCaso;
                limpiarFormularioCaso();
                btnCrearCaso.disabled = false;
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

function seleccionarCliente(cliente) {
    clienteSeleccionado = cliente;
    document.getElementById("nDocumento").value = cliente.nDocumento;
    document.getElementById("nombreApellidoCliente").value =
        `${cliente.nomCliente} ${cliente.apellCliente}`;
    document.getElementById("resultadosBusquedaCliente").classList.remove("mostrar");
    document.getElementById("btnCrearCaso").disabled = false;
}

// Funciones para el caso

async function cargarCaso(noCaso) {
    try {
        const response = await fetch(`${API_BASE_URL}/caso/${noCaso}`);
        const caso = await response.json();

        casoSeleccionado = caso;
        document.getElementById("noCaso").value = caso.noCaso;
        document.getElementById("fechaInicio").value = caso.fechaInicio;
        document.getElementById("fechaFin").value = caso.fechaFin || "";
        document.getElementById("valor").value = caso.valor;
        document.getElementById("especializacion").value = caso.codEspecializacion;
        document.getElementById("noCasoExp").value = caso.noCaso;

        // Si el caso tiene fecha fin, deshabilitar edición
        if (caso.fechaFin) {
            document.getElementById("fechaInicio").disabled = true;
            document.getElementById("especializacion").disabled = true;
            document.getElementById("valor").disabled = true;
            document.getElementById("btnGuardarCaso").disabled = true;
        }
    } catch (error) {
        console.error("Error al cargar caso:", error);
        alert("Error al cargar caso");
    }
}

async function cargarEspecializaciones() {
    try {
        const response = await fetch(`${API_BASE_URL}/especializacion/`);
        const especializaciones = await response.json();

        const input = document.getElementById("especializacion");
        input.value = "";
    } catch (error) {
        console.error("Error al cargar especializaciones:", error);
    }
}

function limpiarFormularioCaso() {
    document.getElementById("noCaso").value = "";
    document.getElementById("fechaInicio").value = "";
    document.getElementById("fechaFin").value = "";
    document.getElementById("especializacion").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("nDocumento").value = "";
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
