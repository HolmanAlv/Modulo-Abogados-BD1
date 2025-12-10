// Este es para comunicar el frontend con el backend a través de la API RESTful

const API_BASE_URL = "http://localhost:8000/api";

let clienteSeleccionado = null;
let casoSeleccionado = null;
let expedienteSeleccionado = null;
let modoEdicion = false;
let expedientesCaso = [];
let indiceExpedienteActual = 0;
let etapaActualGuardada = true; 

document.addEventListener("DOMContentLoaded", () => {
    inicializarFechaHeader();
    inicializarEstadoInicial();
    inicializarEventosPestañas();
    inicializarEventosCaso();
    inicializarEventosExpediente();
    inicializarEventosModal();
});


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
    
    // Este es el nombre de cliente, habilitado a menos que querqamos cambiar su funcionamiento
    // Si lo cambian dejen aca abajo los habilitados para no perdernos
    document.getElementById("nombreApellidoCliente").disabled = false;
    // Make suceso/resultado read-only by default so they can only be edited via modal (double-click)
    const sucesoEl = document.getElementById("suceso");
    const resultadoEl = document.getElementById("resultado");
    if (sucesoEl) sucesoEl.readOnly = true;
    if (resultadoEl) resultadoEl.readOnly = true;
}

// Solamente para que en el encabezado se vea la fecha actual, no más
function inicializarFechaHeader() {
    const dateElement = document.getElementById("currentDate");
    if (dateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('es-ES', options);
    }
}

// Pasa cada que se cambia de pestaña
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

            // carga datos cuando es expediente
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
            alert("Error al buscar cliente"); // Revisen bien los metodos tambien porque este error me está saliendo mucho >:c
            // listo :)
        }
    });

    btnCrearCaso.addEventListener("click", async () => {
        if (!clienteSeleccionado) {
            alert("Por favor seleccione un cliente");
            return;
        }

        document.getElementById("noCaso").value = "(Nuevo)";
        document.getElementById("fechaInicio").value = "";
        document.getElementById("fechaFin").value = "";
        document.getElementById("especializacion").value = "";
        document.getElementById("valor").value = "";

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

    // Botón Para el Acuerdo de Pago (recuerden que este no hay que implementarlo entonces dejenlo quieto
    const btnAcuerdoPago = document.getElementById("btnAcuerdoPago");
    btnAcuerdoPago.addEventListener("click", () => {
        if (!casoSeleccionado || !casoSeleccionado.noCaso) {
            alert("Debe guardar el caso primero antes de crear un acuerdo de pago.");
            return;
        }
        alert("La funcionalidad de Acuerdo de Pago no está implementada aún.");
    });

    // Botón Crear Cliente (recuerden que este no hay que implementarlo entonces dejenlo quieto)
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

        if (casoSeleccionado && casoSeleccionado.fechaFin) {
            alert('El caso está cerrado; no se pueden crear expedientes.');
            return;
        }

        // La etapa anterior debió de haberse guardado
        if (!etapaActualGuardada) {
            alert('Debe guardar la etapa actual antes de crear una nueva.');
            return;
        }

        try {
            const today = new Date().toISOString().slice(0,10);
            const resp = await fetch(`${API_BASE_URL}/expediente/crear`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ noCaso: casoSeleccionado.noCaso, fechaEtapa: today })
            });
            const data = await resp.json();
            if (!data.success) throw new Error('Error al crear expediente');

            // Configurar formulario para la nueva etapa
            document.getElementById("consecExpe").value = data.consecExpe;
            document.getElementById("consecExpe").disabled = true;
            document.getElementById("noEtapa").value = '1';
            document.getElementById("noEtapa").disabled = true;
            document.getElementById("fechaEtapa").value = today;
            document.getElementById("fechaEtapa").disabled = true;

            // Carga algunas listas relaacionadas
            const codEsp = casoSeleccionado.codEspecializacion;
            await cargarEspeciaEtapaYListas(codEsp, 1);

            // Sobre los campos que sean permitidos que s pueda editar
            document.getElementById("abogado").disabled = false;
            document.getElementById("ciudad").disabled = false;
            document.getElementById("entidad").disabled = false;
            document.getElementById("impugnacion").disabled = true;
            // Keep suceso/resultado read-only so editing requires the modal (double-click)
            document.getElementById("suceso").readOnly = true;
            document.getElementById("resultado").readOnly = true;
            document.getElementById("btnAnteriorSuceso").disabled = false;
            document.getElementById("btnSiguienteSuceso").disabled = false;
            document.getElementById("btnAdjuntarDoc").disabled = false;
            btnGuardarExpediente.disabled = false;

            modoEdicion = true;
            etapaActualGuardada = false; // Marcar que hay etapa sin guardar

            // Mantener lista local de expedientes para navegación
            expedientesCaso.unshift({ consecExpe: data.consecExpe, noCaso: casoSeleccionado.noCaso, fechaEtapa: today });
            indiceExpedienteActual = 0;
            expedienteSeleccionado = null;
        } catch (err) {
            console.error(err);
            alert('Error creando expediente');
        }
    });

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
                etapaActualGuardada = true; // Marcar que la etapa fue guardada
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

    if (btnAdjuntarDoc) {
        btnAdjuntarDoc.addEventListener("click", () => {
        if (!expedienteSeleccionado && !document.getElementById('consecExpe').value) {
            alert('Cree o seleccione un expediente primero');
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.jpg,.png,.doc,.docx';
        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const form = new FormData();
            const codEsp = expedienteSeleccionado?.codEspecializacion || document.getElementById('especializacion').value;
            const pasoEtapa = parseInt(expedienteSeleccionado?.pasoEtapa || document.getElementById('noEtapa').value || 1);
            const noCaso = parseInt(expedienteSeleccionado?.noCaso || document.getElementById('noCaso').value);
            const consecExpe = parseInt(expedienteSeleccionado?.consecExpe || document.getElementById('consecExpe').value || 0);
            
            form.append('codEspecializacion', codEsp);
            form.append('pasoEtapa', pasoEtapa);
            form.append('noCaso', noCaso);
            form.append('consecExpe', consecExpe);
            form.append('file', file);

            try {
                const resp = await fetch(`${API_BASE_URL}/documento/upload`, {
                    method: 'POST',
                    body: form
                });
                const data = await resp.json();
                if (data.success) {
                    alert('Documento subido exitosamente');
                    const consecExpeVal = expedienteSeleccionado?.consecExpe || document.getElementById('consecExpe').value;
                    if (consecExpeVal) {
                        cargarExpedienteDetalle(parseInt(consecExpeVal));
                    }
                } else {
                    alert('Error: ' + (data.detail || 'Error subiendo documento'));
                }
            } catch (err) {
                console.error('Error subiendo documento:', err);
                alert('Error: ' + err.message);
            }
        };
        input.click();
        });
    }

    // PAra la navegación de expedientes, los anteriores y los siguientes
    const btnAnt = document.getElementById('btnAnteriorSuceso');
    const btnSig = document.getElementById('btnSiguienteSuceso');
    if (btnAnt && btnSig) {
        btnAnt.addEventListener('click', () => {
            if (expedientesCaso.length === 0) return;
            if (indiceExpedienteActual < expedientesCaso.length - 1) {
                indiceExpedienteActual += 1;
                cargarExpedienteDetalle(expedientesCaso[indiceExpedienteActual].consecExpe);
            }
        });
        btnSig.addEventListener('click', () => {
            if (expedientesCaso.length === 0) return;
            if (indiceExpedienteActual > 0) {
                indiceExpedienteActual -= 1;
                cargarExpedienteDetalle(expedientesCaso[indiceExpedienteActual].consecExpe);
            }
        });
    }

    const selCiudad = document.getElementById('ciudad');
    if (selCiudad) {
        selCiudad.addEventListener('change', (e) => {
            const cod = e.target.value;
            if (cod) cargarEntidades(cod);
        });
    }

    // Son los botoness de agregar documento en la UI (varios slots)
    const botonesDocs = document.querySelectorAll('.btn-agregar-doc');
    if (botonesDocs && botonesDocs.length > 0) {
        botonesDocs.forEach(b => {
            b.addEventListener('click', () => {
                // reutilizar flujo de subida: pedir archivo y subir para expediente seleccionado
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.jpg,.png,.doc,.docx';
                input.onchange = async () => {
                    const file = input.files[0];
                    if (!file) return;
                    if (!expedienteSeleccionado && !document.getElementById('consecExpe').value) {
                        alert('Cree o seleccione un expediente primero');
                        return;
                    }

                    const form = new FormData();
                    const codEsp = expedienteSeleccionado?.codEspecializacion || document.getElementById('especializacion').value;
                    const pasoEtapa = parseInt(expedienteSeleccionado?.pasoEtapa || document.getElementById('noEtapa').value || 1);
                    const noCaso = parseInt(expedienteSeleccionado?.noCaso || document.getElementById('noCaso').value);
                    const consecExpe = parseInt(expedienteSeleccionado?.consecExpe || document.getElementById('consecExpe').value || 0);
                    
                    form.append('codEspecializacion', codEsp);
                    form.append('pasoEtapa', pasoEtapa);
                    form.append('noCaso', noCaso);
                    form.append('consecExpe', consecExpe);
                    form.append('file', file);

                    try {
                        const resp = await fetch(`${API_BASE_URL}/documento/upload`, { method: 'POST', body: form });
                        const data = await resp.json();
                        if (data.success) {
                            alert('Documento subido exitosamente');
                            const consecExpeVal = expedienteSeleccionado?.consecExpe || document.getElementById('consecExpe').value;
                            if (consecExpeVal) {
                                cargarExpedienteDetalle(parseInt(consecExpeVal));
                            }
                        } else alert('Error: ' + (data.detail || 'Error subiendo documento'));
                    } catch (err) {
                        console.error('Error subiendo documento:', err);
                        alert('Error subiendo documento');
                    }
                };
                input.click();
            });
        });
    }
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

        if (ultimoCaso && ultimoCaso.noCaso) {
            selectNoCaso.value = ultimoCaso.noCaso;
            selectNoCaso.disabled = false;
            await cargarCaso(ultimoCaso.noCaso);
        } else {
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

        expedientesCaso = expedientes || [];
        if (expedientesCaso.length > 0) {
            indiceExpedienteActual = 0;
            cargarExpedienteDetalle(expedientesCaso[0].consecExpe);
            document.getElementById("btnCrearExpediente").disabled = true;
        } else {
            document.getElementById("btnCrearExpediente").disabled = false;
            limpiarFormularioExpediente();
        }
        if (casoSeleccionado && casoSeleccionado.fechaFin) {
            document.getElementById('btnCrearExpediente').disabled = true;
            document.getElementById('btnGuardarExpediente').disabled = true;
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
        document.getElementById("noEtapa").value = expediente.pasoEtapa || expediente.codEtapa || '';
        document.getElementById("fechaEtapa").value = expediente.fechaEtapa || '';
        document.getElementById("nomEtapa").value = expediente.nomEtapa || '';

        const sucesosText = (expediente.sucesos || []).map(s => s.descSuceso).join('\n\n');
        const resultadosText = (expediente.resultados || []).map(r => r.descResul).join('\n\n');
        document.getElementById("suceso").value = sucesosText;
        document.getElementById("resultado").value = resultadosText;

        document.getElementById("consecExpe").disabled = true;
        document.getElementById("noEtapa").disabled = true;
        document.getElementById("fechaEtapa").disabled = true;
        document.getElementById("nomEtapa").disabled = true;

        const codEsp = expediente.codEspecializacion || document.getElementById('especializacion').value || (casoSeleccionado && casoSeleccionado.codEspecializacion);
        if (codEsp) {
            await cargarEspeciaEtapaYListas(codEsp, expediente.pasoEtapa || expediente.codEtapa || 1);
        }

        // Seleccionar abogado si viene
        if (expediente.cedula) {
            const selAb = document.getElementById('abogado');
            selAb.value = expediente.cedula;
        }

        if (expediente.codLugar) {
            try {
                const respLugar = await fetch(`${API_BASE_URL}/lugar/${expediente.codLugar}`);
                if (respLugar.ok) {
                    const lugarDet = await respLugar.json();
                    const lugPadre = lugarDet.lugCodLugar; 
                    if (!lugPadre) {
                        // el codLugar es ciudad
                        document.getElementById('ciudad').value = lugarDet.codLugar;
                        await cargarEntidades(lugarDet.codLugar);
                        document.getElementById('entidad').value = '';
                    } else {
                        // el codLugar es entidad; seleccionar ciudad padre y la entidad
                        document.getElementById('ciudad').value = lugPadre;
                        await cargarEntidades(lugPadre);
                        document.getElementById('entidad').value = lugarDet.codLugar;
                    }
                }
            } catch (err) {
                console.error('Error obteniendo lugar detalle:', err);
            }
        }

        if (expediente.idImpugna) {
            const sel = document.getElementById('impugnacion');
            sel.value = expediente.idImpugna;
            sel.disabled = false;
        } else {
            document.getElementById('impugnacion').value = '';
            document.getElementById('impugnacion').disabled = true;
        }

        if (expediente.nInstancia) {
            document.getElementById('instancia').value = expediente.nInstancia === 1 ? 'Primera' : expediente.nInstancia === 2 ? 'Segunda' : expediente.nInstancia;
        }

        // Si el caso está cerrado no se debe de permitir edición
        if (casoSeleccionado && casoSeleccionado.fechaFin) {
            document.getElementById('abogado').disabled = true;
            document.getElementById('ciudad').disabled = true;
            document.getElementById('entidad').disabled = true;
            document.getElementById('impugnacion').disabled = true;
            const sEl = document.getElementById('suceso');
            const rEl = document.getElementById('resultado');
            if (sEl) sEl.readOnly = true;
            if (rEl) rEl.readOnly = true;
            document.getElementById('btnGuardarExpediente').disabled = true;
            document.getElementById('btnCrearExpediente').disabled = true;
        }

        const idx = expedientesCaso.findIndex(e => e.consecExpe == expediente.consecExpe);
        if (idx !== -1) indiceExpedienteActual = idx;
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

async function cargarAbogadosEspecializacion(codEspecializacion) {
    try {
        const resp = await fetch(`${API_BASE_URL}/abogado/especializacion/${codEspecializacion}`);
        const abogados = await resp.json();
        const sel = document.getElementById('abogado');
        sel.innerHTML = '<option value="">-- Seleccionar --</option>';
        abogados.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.cedula;
            opt.textContent = `${a.apellido}, ${a.nombre}`;
            sel.appendChild(opt);
        });
    } catch (err) {
        console.error('Error cargando abogados:', err);
    }
}

async function cargarCiudades() {
    try {
        const resp = await fetch(`${API_BASE_URL}/lugar/ciudades`);
        const ciudades = await resp.json();
        const sel = document.getElementById('ciudad');
        sel.innerHTML = '<option value="">-- Seleccionar --</option>';
        ciudades.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.codLugar;
            opt.textContent = c.nomLugar;
            sel.appendChild(opt);
        });
    } catch (err) {
        console.error('Error cargando ciudades:', err);
    }
}

async function cargarEntidades(codCiudad) {
    try {
        const resp = await fetch(`${API_BASE_URL}/lugar/entidades/${codCiudad}`);
        const entidades = await resp.json();
        const sel = document.getElementById('entidad');
        sel.innerHTML = '<option value="">-- Seleccionar --</option>';
        entidades.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.codLugar;
            opt.textContent = e.nomLugar;
            sel.appendChild(opt);
        });
    } catch (err) {
        console.error('Error cargando entidades:', err);
    }
}

async function cargarEspeciaEtapaYListas(codEsp, paso) {
    try {
        const respEt = await fetch(`${API_BASE_URL}/especia-etapa/${codEsp}/${paso}`);
        if (respEt.ok) {
            const etapa = await respEt.json();
            document.getElementById('nomEtapa').value = etapa.nomEtapa || '';

            if (etapa.nomEtapa && etapa.nomEtapa.toLowerCase().includes('sentenc')) {
                document.getElementById('instancia').value = 'Primera';
            } else if (etapa.codEtapa && etapa.codEtapa.toLowerCase().includes('impugn')) {
                document.getElementById('instancia').value = 'Segunda';
            } else {
                document.getElementById('instancia').value = '';
            }

            if (etapa.idImpugna) {
                document.getElementById('impugnacion').disabled = false;
                const respAll = await fetch(`${API_BASE_URL}/especia-etapa/${codEsp}`);
                if (respAll.ok) {
                    const all = await respAll.json();
                    const sel = document.getElementById('impugnacion');
                    sel.innerHTML = '<option value="">-- Seleccionar --</option>';
                    all.filter(x => x.idImpugna).forEach(x => {
                        const opt = document.createElement('option');
                        opt.value = x.idImpugna;
                        opt.textContent = x.idImpugna;
                        sel.appendChild(opt);
                    });
                }
            } else {
                document.getElementById('impugnacion').disabled = true;
                document.getElementById('impugnacion').innerHTML = '<option value="">-- Seleccionar --</option>';
            }
        }

        await cargarAbogadosEspecializacion(codEsp);
        await cargarCiudades();
    } catch (err) {
        console.error('Error cargando datos de etapa:', err);
    }
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

// Pa los errores

window.addEventListener("error", (event) => {
    console.error("Error global:", event.error);
});

console.log("✓ Los scrips se han cargado correctamente");
console.log(`✓ URL usada para la API: ${API_BASE_URL}`);
