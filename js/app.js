//constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
//realiza la cotizacion con los datos
Seguro.prototype.cotizacion = function() {
    let cantidad;
    const base = 2000;

    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;

        default:
            break;
    }
    //por cada año que mas viejo del actual reducirse un 3%
    let yearActual = new Date().getFullYear();
    let i;
    for (i = yearActual; i > this.year; i--) {
        cantidad = cantidad * 0.97;
    }
    //si es basico  se lo multiplica por 30% de su valor si es completo 50%

    if (this.tipo === 'completo') {
        cantidad = cantidad * 1.50;
    } else {
        cantidad = cantidad * 1.30;

    }

    return cantidad;

}

/***interfaz de usuario */
function UI() {

}
//llena las opciones con los años

UI.prototype.llenarOpciones = function() {
        const max = new Date();
        const maximo = max.getFullYear();
        const min = maximo - 20;
        let i;

        const select = document.querySelector('#year');


        for (i = maximo; i > min; i--) {
            let opcion = document.createElement('option');
            opcion.value = i;
            opcion.textContent = i;
            select.appendChild(opcion);


        }

    }
    //muestra alertas en pantalla
UI.prototype.mostrarMensaje = function(mensaje, tipo) {
    const div = document.createElement('div');

    if (tipo === 'error') {
        div.classList.add('mensaje', 'error', 'mt-10'); /**margin top 10 tailwind */
    } else {
        div.classList.add('mensaje', 'correcto', 'mt-10');
    }
    div.textContent = mensaje;
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado')); /***nuevo nodo , nodo de referencia a insertar arriba de el */

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = function(total, seguro) {
    //crear resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');
    let nombre;
    switch (seguro.marca) {
        case '1':
            nombre = 'Americano';
            break;
        case '2':
            nombre = 'Asiatico';
            break;
        case '3':
            nombre = 'Europeo';
            break;
        default:
            break;
    }
    /***textcontent  cuando no tiene html y inner html cuando queremos agregarle html */
    /*** capitalize clase de tailwind */
    div.innerHTML = `
    <p class="header"> Tu resumen </p>
    <p class="font-bold"> Total : <span class="font-normal">$ ${total}</span> </p>
    <p class="font-bold"> marca : <span class="font-normal capitalize"> ${nombre}</span> </p>
    <p class="font-bold"> año : <span class="font-normal"> ${seguro.year}</span> </p>
    <p class="font-bold"> tipo : <span class="font-normal capitalize"> ${seguro.tipo}</span> </p>
    `;
    const resultadoDiv = document.querySelector('#resultado');


    //mostrar spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = "block";

    setTimeout(() => {

        spinner.style.display = "none"; //se borra el spinner
        resultadoDiv.appendChild(div); // se muestra resultado
    }, 3000);
}


//instanciar UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();
})

eventListener();

function eventListener() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();
    //leer marca selecionada 
    const marca = document.querySelector('#marca').value;


    //leer año selecionado

    const year = document.querySelector('#year').value;

    //leer cobertura
    /****seleciono todo los input con un name tipo porque asi se llama el radio button */
    /***checked verifica si hay un elemento seleccionado en un radio button */
    const tipo = document.querySelector('input[name="tipo"]:checked').value;


    if (marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('los campos no pueden estar vacios', 'error');
        return;
    } else {
        ui.mostrarMensaje('cotizando...', 'correcto');

    }
    //ocultar cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    if (resultados) {
        resultados.remove();
    }

    //instanciar el seguro
    const nuevoSeguro = new Seguro(marca, year, tipo);

    const total = nuevoSeguro.cotizacion();
    console.log(total);
    //utilizar propotype que va a cotizar

    ui.mostrarResultado(total, nuevoSeguro);



}