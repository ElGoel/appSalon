'use strict'
let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Resalta el Div Actual segun el tab al que se preciona
    mostrarSeccion();

    // Oculta o muestra una seccion segun el tab al que se preciona
    cambiarSeccion();

    // Paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    // Comprobar la pagina actual para ocultar o mostrar la paginación
    botonesPaginador();

    // Muestra el resumen de la cita (o mensaje de error en caso de no pasar la validación )
    mostrarResumen();

    // Almacena el nombre de la cita en el objeto
    nombreCita();

    // Almacena el nombre de la fecha en el objeto

    fechaCita();

    // // desabilita dias pasados
    deshabilitarFechaAnterior();

    // Almacena la hora de la cita en el objeto
    horaCita();
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

            // console.log(pagina);
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

// FUNCION DE LOS SERVICIOS EN LA PAGINA 1

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

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        // console.log(elemento.dataset.idServicio);
        // Con este codigo se saca el id del servicio
        // console.log(elemento.firstElementChild.textContent);
        // console.log(elemento.firstElementChild.nextElementSibling.textContent);
        // este tipo de funciones se llaman "travesing the dom y lo que realiza esque recorre el dom desde el javascript"
        // en este caso esta recorriendo el DIV del elemento para parar en el "firstElement" que seria un P y luego el textContent
        // nextElementSibling tomaria el siguiente elemento despues del primero que sean hijos del elemento y que esten en el mismo nivel


        const servicioOj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        // console.log(servicioOj); <- ejemplo

        agregarServicio(servicioOj);
    }
}

function eliminarServicio(id) {
    // console.log('Eliminando...', id); <-ejemplo
    const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    // en este codigo se esta sacando el Id del elemento que tambien se esta asignando al objeto de servicios, con .filter se esta creando
    // una nueva instancia el cual va a iterar en el objeto de cita.servicios y va a eliminar el id que sea diferente al que se esta seleccionando
    // "servicio" seria el parametro, servicio.id seria el id que quiero filtrar y el id es al cual le estoy dando click

    console.log(cita);
}

function agregarServicio(servicioOj) {
    const {servicios} = cita;

    cita.servicios = [...servicios, servicioOj];
    // en esta sintaxis se crea un distroctoring a servicios = cita, los 3 puntos realizan una copia de servicios y le agrega "servicioOj"
    // se crea un nuevo arreglo y se asigna a cita.servicios
    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        // console.log(pagina); // <- Ejemplo

        botonesPaginador()
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        // console.log(pagina); // <- Ejemplo
        botonesPaginador()
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la pagina 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
        limpiar()
    }
    // !importante: se debe estudiar este codigo completo para entender el orden de llamado de funciones
    // y su interacción con el resto del codigo

    mostrarSeccion(); // Cambia la seccion que se muestra por la de la
}

function mostrarResumen() {
    // Distructuring
    const {nombre, fecha, hora, servicios} = cita;

    // Seleccionar el resumen

    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia el HTML previo
    while(resumenDiv.firstChild) {
        resumenDiv.removeChild( resumenDiv.firstChild);
    }

    // Validacion de objeto
    if(Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hota, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        // agregar a resumenDiv
        resumenDiv.appendChild(noServicios);

        return; // El return evita que se ejecute mas codigo luego de que este se ejecute
    } // else {
    //     console.log('datos correctamente establecidos');
    // }
    const headingDatos = document.createElement('H3');
    headingDatos.textContent = 'Tus Datos y Cita';

    // Mostrar el Resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Nombre:</span> ${hora}`
    // textContent va a tratar todo el contenido como texto mientras que el innerHTML lo tomara como etiquetas

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    // Iterar el arreglo de servicios
    servicios.forEach( servicio => {

        const {nombre, precio} = servicio
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textServicio = document.createElement('P');
        textServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$'); // .split() le quita el signo de $
        // console.log(parseInt(totalServicio[1].trim() )); // .trim() le quita el espacio en blanco

        cantidad += parseInt(totalServicio[1].trim());

        // Colocar texto y precio en el DIV
        contenedorServicio.appendChild(textServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    resumenDiv.appendChild(headingDatos);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span> $ ${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    // input es un evento el cual manda a llamar la funcion con cada letra que se escribe
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim(); // trim() elimina los espacios en blanco en el texto

        // Validación de que nombreTexto debe tener algo
        if(nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('nombre no Valido', 'error')
        } else {
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto

            // console.log(cita); // ejemplo
        }
    });
}

function mostrarAlerta(mensaje, tipo) {
    // console.log('el mensaje es', mensaje); // <-ejemplo

    // Si hay una alerta previa, entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }
    // la funcion deja de ejecutarse con el return, es mejor que el classlist.remove ya que la funcion se seguiria ejecutando con forme
    // se elimine la clase y asi se consumen mas recursos

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error');
    }

    // insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 2000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const fecha = new Date(e.target.value).getUTCDay();
        // getUTCDay() toma el valor del dia de la semana del 0 al 6 siendo el 0 = domingo

        if([0, 6].includes(fecha)) { // se coloca el dia en un arreglo para poder colocarle mas dias
            //console.log('no trabajamos los domingos')
            e.preventDefault();
            fechaInput.value = '';
            // con este el valor del input no se agregara si sale el error
            mostrarAlerta('Fines de semana no permitidos', 'error');
        } else {
            // console.log('dia valido');
            cita.fecha = fechaInput.value;

            // console.log(cita); // <- ejemplo
        }
        // con el new Date se genera una funcion de fechas
        // const opciones = {
        //     weekday: 'long',
        //     year: 'numeric',
        //     month: 'long'
        // } estas opciones estan disponibles para trabajar con fechas en español
        // console.log(fecha)   //.toLocaleDateString('es-ES', opciones));
    })
}

// dehabilitar la posibilidad de seleccionar fechas del pasado

// CODIGO POR REVISAR YA QUE NO FUNCIONA
function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', e => {
    const fechaSeleccionada = new Date(e.target.value);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1);

    const fechaAhora = new Date()

    if(fechaAhora > fechaSeleccionada) {
        e.preventDefault();
        inputFecha.value = '';
        mostrarAlerta('Fecha no Valida', 'error');
    }

    });
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora no valida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 2000);
        } else {
            cita.hora = horaCita;

            console.log(cita);
        }
    });
}

function limpiar() {
    const elementos = document.getElementsByTagName('input');
    for(let i = 0; i <elementos.length; ++ i ){
       const attr = elementos[i].getAttribute('type');
       if(attr === 'text'|| attr === 'hidden'){
          elementos[i].value = '';
          continue;
        } else if (attr === 'date'|| attr === 'hidden') {
            elementos[i].value = '';
            continue;
        } else if(attr === 'time'|| attr === 'hidden') {
            elementos[i].value = '';
             continue;
        }
    }
};

