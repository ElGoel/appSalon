'use strict'
let pagina = 1;

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    amostrarServicios();

    // Resalta el Div Actual segun el tab al que se preciona
    mostrarSeccion();

    // Oculta o muestra una seccion segun el tab al que se preciona
    cambiarSeccion();

    // Paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    // Comprobar la pagina actual para ocultar o mostrar la paginación
    botonesPaginador();
}

function mostrarSeccion() {

    // Eliminar mostrar-seccion de la sección anterior
    const seccionAnterior =  document.querySelector('.mostrar-seccion');
    if( seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }
// !IMPORTANT: es importante entender el por que estos interactuan con la funcion "mostrarSeccion()"
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

     // Eliminar la clase actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el Tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`); //este codigo refiere a la seccion "pagina" actual que se muestra
    tab.classList.add('actual'); // "Actual" va a resaltar el boton de los enlaces donde se seleccione la "pagina"
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            // la nueva data "paso" es colocada aqui para que itere a las diferentes secciones que tienen el id:"paso"


            // IMPORTANTE: estudiar porque este codigo ya no es necesario

            // // Agrega mostrar-seccion donde dimos click
            // const seccion = document.querySelector(`#paso-${pagina}`);
            // seccion.classList.add('mostrar-seccion');

            // // Agregar la clase de actual en el nuevo tab
            // const tabActual = document.querySelector
            // const tab = document.querySelector(`[data-paso="${pagina}"]`);
            // tab.classList.add('actual');

            // Llamar la funcion de mostrar seccion
            mostrarSeccion();
            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const { servicios } = db; // de esta forma con "Destructory se evita colocar db.servicios solo con las llaves"

        // Generar el HTML
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;
            // console.log(id, nombre, precio); <-ejemplo
            // de igual manera aqui se uso Destructory para generar una variable atada a servicio

            // DOM Scripting
            // Generar Nombre
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            // console.log(nombreServicio);
            // Generar Precio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$${precio}`;
            precioServicio.classList.add('precio-servicio');
            // console.log(precioServicio); <-ejemplo

            // Generar div contenedor de Servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;


            // Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // console.log(servicioDiv); <-ejemplo
            // Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        })
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {

    let elemento;
    // Forzar que el elemento al cual le damos click sea el DIV
    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    }else {
        elemento = e.target;
    }
    // console.log(elemento.dataset.idServicio); <-ejemplo

    if(elemento.classList.contains('seleccionado')) { // .contains() es una funcion que verifica la existencia de una clase en un elemento
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    }
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        console.log(pagina);

        botonesPaginador()
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        console.log(pagina);
        botonesPaginador()
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    // !importante: se debe estudiar este codigo completo para entender el orden de llamado de funciones
    // y su interacción con el resto del codigo

    mostrarSeccion(); // Cambia la seccion que se muestra por la de la
}
