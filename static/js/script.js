import Carrito from "./carrito.js";

const miCarrito = new Carrito(); // creo un objeto de la clase carrito
var moneda; // creo mi variable moneda
var productos = []; // creo mi variable productos

document.addEventListener('DOMContentLoaded', function (event) {

    function cargarTabla(productos) { // creo funcion para rellenar la tabla con los datos que tenemos en el json
    }

    function cargarCarrito() { // creo funcion para rellenar el carrito con los productos que se van añadiendo a la cesta 
    }

    fetch('https://jsonblob.com/api/1300890895002755072') // uso el fetch para poder obtener el json con los productos y mostrarlos en la tabla
        .then(response => response.json()) // convierto la respuesta a formato json
            .then(stock => {
                moneda = stock.currency; // accedo a la propiedad 'currency' del objeto json 'stock' y la asigno a mi variable 'moneda'
                productos = stock.products; // accedo a la propiedad 'products' y la asigno a mi variable 'productos'
                cargarTabla(productos); // llamo a la función 'cargarTabla' para que se ejecute
            });
});