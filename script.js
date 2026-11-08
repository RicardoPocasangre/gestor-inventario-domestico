// ---------- Datos ----------
let inventario = [
  { id: 1, nombre: "Arroz", categoria: "Alimentos", cantidad: 10, precio: 1.25, agotado: false },
  { id: 2, nombre: "Frijoles", categoria: "Alimentos", cantidad: 8, precio: 1.5, agotado: false },
  { id: 3, nombre: "Aceite de cocina", categoria: "Alimentos", cantidad: 0, precio: 3.2, agotado: true },
  { id: 4, nombre: "Detergente", categoria: "Limpieza", cantidad: 4, precio: 4.75, agotado: false },
  { id: 5, nombre: "Cloro", categoria: "Limpieza", cantidad: 6, precio: 2.1, agotado: false },
  { id: 6, nombre: "Jabón de baño", categoria: "Higiene", cantidad: 12, precio: 0.9, agotado: false },
  { id: 7, nombre: "Pasta dental", categoria: "Higiene", cantidad: 3, precio: 2.4, agotado: false },
  { id: 8, nombre: "Papel higiénico", categoria: "Higiene", cantidad: 0, precio: 5.5, agotado: true }
];

// ---------- Referencias al DOM ----------
const formularioProducto = document.querySelector("#formulario-producto");
const cuerpoInventario = document.querySelector("#cuerpo-inventario");
const mensajeError = document.querySelector("#mensaje-error");
const mensajeVacio = document.querySelector("#mensaje-vacio");
const filtroCategoria = document.querySelector("#filtro-categoria");
const totalProductos = document.querySelector("#total-productos");
const totalUnidades = document.querySelector("#total-unidades");
const valorTotal = document.querySelector("#valor-total");
const totalAgotados = document.querySelector("#total-agotados");

// ---------- Cierre para generar ids ----------
function crearGeneradorId() {
  let contador = 100;
  return function () {
    contador = contador + 1;
    return contador;
  };
}

const generarId = crearGeneradorId();

// ---------- Cálculos ----------
function calcularValorTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].cantidad * items[i].precio;
  }
  return total;
}

function contarUnidades(items) {
  let unidades = 0;
  for (let i = 0; i < items.length; i++) {
    unidades = unidades + items[i].cantidad;
  }
  return unidades;
}

function contarAgotados(items) {
  let agotados = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].agotado) {
      agotados = agotados + 1;
    }
  }
  return agotados;
}

function contarPorCategoria(items) {
  const conteo = {};
  for (let i = 0; i < items.length; i++) {
    const categoria = items[i].categoria;
    if (conteo[categoria] === undefined) {
      conteo[categoria] = 0;
    }
    conteo[categoria] = conteo[categoria] + 1;
  }
  return conteo;
}

// ---------- Construcción de nodos ----------
function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function crearBoton(texto, clase, id) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.classList.add(clase);
  boton.setAttribute("data-id", id);
  return boton;
}

function crearFila(item) {
  const fila = document.createElement("tr");
  if (item.agotado) {
    fila.classList.add("agotado");
  }

  const subtotal = item.cantidad * item.precio;

  fila.appendChild(crearCelda(item.nombre));
  fila.appendChild(crearCelda(item.categoria));
  fila.appendChild(crearCelda(item.cantidad));
  fila.appendChild(crearCelda("$" + item.precio.toFixed(2)));
  fila.appendChild(crearCelda("$" + subtotal.toFixed(2)));
  fila.appendChild(crearCelda(item.agotado ? "Agotado" : "Disponible"));

  const celdaAcciones = document.createElement("td");
  celdaAcciones.appendChild(crearBoton("Cambiar estado", "btn-estado", item.id));
  celdaAcciones.appendChild(crearBoton("Eliminar", "btn-eliminar", item.id));
  fila.appendChild(celdaAcciones);

  return fila;
}

// ---------- Renderizado ----------
function actualizarIndicadores(items) {
  totalProductos.textContent = items.length;
  totalUnidades.textContent = contarUnidades(items);
  valorTotal.textContent = calcularValorTotal(items).toFixed(2);
  totalAgotados.textContent = contarAgotados(items);
}

function renderizar(items) {
  cuerpoInventario.textContent = "";
  for (let i = 0; i < items.length; i++) {
    cuerpoInventario.appendChild(crearFila(items[i]));
  }
  // Los indicadores reflejan el inventario completo.
  actualizarIndicadores(inventario);
  mensajeVacio.hidden = items.length > 0;
}

function llenarSelectorCategorias() {
  const seleccionActual = filtroCategoria.value;
  const conteo = contarPorCategoria(inventario);

  filtroCategoria.textContent = "";
  const opcionTodas = document.createElement("option");
  opcionTodas.value = "todas";
  opcionTodas.textContent = "todas";
  filtroCategoria.appendChild(opcionTodas);

  for (const categoria in conteo) {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    filtroCategoria.appendChild(opcion);
  }

  if (conteo[seleccionActual] !== undefined) {
    filtroCategoria.value = seleccionActual;
  }
}

// ---------- Filtrado ----------
function filtrarPorCategoria(categoria) {
  const resultado = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].categoria === categoria) {
      resultado.push(inventario[i]);
    }
  }
  return resultado;
}

function obtenerProductosVisibles() {
  const categoria = filtroCategoria.value;
  if (categoria === "todas") {
    return inventario;
  }
  return filtrarPorCategoria(categoria);
}

function refrescarVista() {
  renderizar(obtenerProductosVisibles());
}

// ---------- Validación y alta ----------
function validarProducto(datos) {
  if (datos.nombre === "") {
    throw new Error("El nombre no puede estar vacío.");
  }
  if (datos.categoria === "") {
    throw new Error("La categoría no puede estar vacía.");
  }
  if (!Number.isInteger(datos.cantidad) || datos.cantidad <= 0) {
    throw new Error("La cantidad debe ser un entero mayor que cero.");
  }
  if (typeof datos.precio !== "number" || Number.isNaN(datos.precio) || datos.precio < 0) {
    throw new Error("El precio debe ser un número mayor o igual a cero.");
  }
}

function agregarProducto(evento) {
  evento.preventDefault();

  const datos = {
    nombre: formularioProducto.elements["nombre"].value.trim(),
    categoria: formularioProducto.elements["categoria"].value.trim(),
    cantidad: Number(formularioProducto.elements["cantidad"].value),
    precio: Number(formularioProducto.elements["precio"].value)
  };

  // Un campo vacío de precio o cantidad se convierte en 0; se detecta aparte.
  if (formularioProducto.elements["cantidad"].value.trim() === "") {
    datos.cantidad = NaN;
  }
  if (formularioProducto.elements["precio"].value.trim() === "") {
    datos.precio = NaN;
  }

  try {
    validarProducto(datos);

    const nuevoProducto = {
      id: generarId(),
      nombre: datos.nombre,
      categoria: datos.categoria,
      cantidad: datos.cantidad,
      precio: datos.precio,
      agotado: false
    };

    inventario.push(nuevoProducto);
    mensajeError.textContent = "";
    formularioProducto.reset();
    llenarSelectorCategorias();
    refrescarVista();
    console.log("Alta de producto:", nuevoProducto);
  } catch (error) {
    mensajeError.textContent = error.message;
    console.error("Error al agregar producto:", error.message);
  }
}

// ---------- Baja y cambio de estado ----------
function eliminarProducto(id) {
  const restantes = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id !== id) {
      restantes.push(inventario[i]);
    }
  }
  return restantes;
}

function cambiarEstado(id) {
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === id) {
      inventario[i].agotado = !inventario[i].agotado;
    }
  }
}

function manejarClicTabla(evento) {
  const boton = evento.target.closest("button");
  if (boton === null) {
    return;
  }

  const id = Number(boton.getAttribute("data-id"));

  if (boton.classList.contains("btn-eliminar")) {
    inventario = eliminarProducto(id);
    llenarSelectorCategorias();
    refrescarVista();
    console.log("Baja de producto con id:", id);
  } else if (boton.classList.contains("btn-estado")) {
    cambiarEstado(id);
    refrescarVista();
    console.log("Cambio de estado del producto con id:", id);
  }
}

// ---------- Flujo principal ----------
function iniciar() {
  llenarSelectorCategorias();
  refrescarVista();

  formularioProducto.addEventListener("submit", agregarProducto);
  cuerpoInventario.addEventListener("click", manejarClicTabla);
  filtroCategoria.addEventListener("change", refrescarVista);

  console.table(inventario);
  console.table(contarPorCategoria(inventario));
}

iniciar();
