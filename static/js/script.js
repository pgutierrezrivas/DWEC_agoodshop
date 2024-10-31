import Carrito from "./carrito.js";

const miCarrito = new Carrito(); // creo un objeto de la clase carrito
var moneda; // creo mi variable moneda
var productos = []; // creo mi variable productos

document.addEventListener('DOMContentLoaded', function (event) {

    function cargarTabla(productos) { // creo funcion para rellenar la tabla con los datos que tenemos en el json
        
        const tablaProductos = document.getElementById("tablaProductos"); // selecciono la tabla de productos mediante su id
        
        productos.forEach((producto) => { // itero sobre el array para crear filas en la tabla (por cada producto creo una fila)
            
            const filaProducto = document.createElement('tr'); // creo una fila para cada producto
            
            const miproducto = { //creo un objeto 'miproducto' para poder trabajar con toda la informacion del producto
                sku: producto.SKU,
                title: producto.title,
                price: Number(producto.price)
            }

            // PRIMERA CELDA: descripcion del producto (titulo y sku)
            const celdaDescripcion = document.createElement('td'); // creo una celda

            const nombreProducto = document.createElement('p'); // creo un parrafo para el nombre
            nombreProducto.innerText = miproducto.title; // relleno contenido del parrafo con la propiedad 'title' del objeto 'miproducto'
            nombreProducto.classList.add('bold'); // aplico estilos css

            const skuProducto = document.createElement('p'); // creo un parrafo para el sku
            skuProducto.innerText = "REF: " + miproducto.sku; // relleno contenido del parrafo con la propiedad 'sku' del objeto 'miproducto'

            celdaDescripcion.append(nombreProducto, skuProducto); // añado los dos parrafos a la celda
            filaProducto.appendChild(celdaDescripcion); // añado la celda a la fila

            // SEGUNDA CELDA: cantidad del producto (botones e input)
            const celdaCantidad = document.createElement('td'); // creo celda para la cantidad

            // boton quitar producto
            const btnDisminuir = document.createElement('button'); // creo boton
            btnDisminuir.innerText = '-'; // añado texto al boton
            btnDisminuir.classList.add('btnNum'); // aplico estilos css

            // input valor producto
            const input = document.createElement('input'); // creo input para mostrar la cantidad
            input.type = 'text'; // tipo del input texto
            input.value = '0'; // inicializo el input a cero
            input.readOnly = true; // hago que no se pueda modificar manualmente (solo se modifica mediante los botones)
            input.classList.add('inputNum'); // aplico estilos css

            // boton añadir producto
            const btnAumentar = document.createElement('button'); // misma mecanica que con el boton quitar
            btnAumentar.innerText = '+';
            btnAumentar.classList.add('btnNum');

            // funcion para actualizar el importe total por producto al interactuar con los botones (y por tanto, cambiar el valor de la cantidad)
            function actualizarTotalPorProducto(price, quantity) {
                const totalProducto = price * quantity;
                celdaTotal.innerText = totalProducto.toFixed(2) + " " + moneda; // muestro total redondeado a 2 decimales
            };

            // funcion para actualizar la cantidad
            function actualizarCantidad(incremento) { 
                let valorActual = parseInt(input.value); // valor actual del input como numero
                let nuevoValor = valorActual + parseInt(incremento); // calculo el nuevo valor (parseo incremento para que nuevoValor sea tipo number)

                if (nuevoValor >= 0) { // verifico que el valor no sea negativo
                    input.value = nuevoValor; // actualizo el valor del input
                    actualizarTotalPorProducto(miproducto.price, nuevoValor); // actualizo el total    
                    miCarrito.actualizarUnidades(miproducto, nuevoValor); // actualizo las unidades en el carrito
                    cargarCarrito(); // actualizo el estado global del carrito
                }
            }

            // agrego eventos a los botones
            btnDisminuir.addEventListener('click', function (event) {
                actualizarCantidad(-1); // disminuyo la cantidad
            });

            btnAumentar.addEventListener('click', function (event) {
                actualizarCantidad(1); // aumento la cantidad
            });

            celdaCantidad.append(btnDisminuir, input, btnAumentar); // añado los botones y el input a la celda de cantidad
            filaProducto.appendChild(celdaCantidad);

            // TERCERA CELDA: precio unitario del producto
            const celdaPrecio = document.createElement('td');
            celdaPrecio.innerText = miproducto.price + " " + moneda; // relleno contenido del parrafo con la propiedad 'price' del objeto 'miproducto' + mi variable moneda
            filaProducto.appendChild(celdaPrecio);

            // CUARTA CELDA: total para ese producto
            const celdaTotal = document.createElement('td');
            celdaTotal.innerText = "0.00 " + moneda; // inicializo a cero el total (ira cambiando en funcion del valor que tenga el input)
            filaProducto.appendChild(celdaTotal);

            // POR ULTIMO, añado la fila a la tabla de productos
            tablaProductos.appendChild(filaProducto);
        });

    }

    function cargarCarrito() { // creo funcion para rellenar el carrito con los productos que se van añadiendo a la cesta 
        
        const contenedorCarrito = document.getElementById('desgloseCarrito');
        contenedorCarrito.innerHTML = '';  // limpio contenido previo
        
        const desgloseCarrito = miCarrito.obtenerCarrito(); // llamo al metodo 'obtenerCarrito' de la clase Carrito para que me devuelva los productos añadidos y el total acumulado

        desgloseCarrito.productosEnCarrito.forEach((productoCarrito) => {

            if (productoCarrito.quantity > 0) { // si el producto tiene mas de 0 unidades, añado fila

                const filaProductoCarrito = document.createElement('tr'); // creo una fila por cada producto añadido al carrito
                filaProductoCarrito.classList.add('justifySpace'); // aplico estilos css

                const celdaCantidad = document.createElement('td'); // creo celda
                celdaCantidad.innerText = productoCarrito.quantity + " x " + productoCarrito.title; // relleno la celda

                const celdaTotal = document.createElement('td'); // creo celda
                celdaTotal.innerText = (productoCarrito.price * productoCarrito.quantity).toFixed(2) + " " + moneda; // relleno la celda

                filaProductoCarrito.append(celdaCantidad, celdaTotal); // añado las celdas a la fila

                contenedorCarrito.appendChild(filaProductoCarrito); // añado la fila al contenedor
            }
        });

        const totalFinal = document.getElementById('totalFinal');
        totalFinal.innerText = desgloseCarrito.totalCarrito + " " + moneda; // muestro el total final

    }

    fetch('https://jsonblob.com/api/1300890895002755072') // uso el fetch para poder obtener el json con los productos y mostrarlos en la tabla
        .then(response => response.json()) // convierto la respuesta a formato json
            .then(stock => {
                moneda = stock.currency; // accedo a la propiedad 'currency' del objeto json 'stock' y la asigno a mi variable 'moneda'
                productos = stock.products; // accedo a la propiedad 'products' y la asigno a mi variable 'productos'
                cargarTabla(productos); // llamo a la función 'cargarTabla' para que se ejecute
            });
});