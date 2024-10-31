export default class Carrito {

    constructor() {
        this.productosCarrito = [];
    }

    actualizarUnidades(nuevoProducto, nuevaCantidad) { // Actualiza el número de unidades que se quieren comprar de un producto

        nuevoProducto.quantity = nuevaCantidad; // asigno el numero de unidades que llegan al atributo quantity del objeto nuevoProducto
        
        /*const productoEnCarrito = this.productosCarrito.find(function(productoActual) { (uso arrow functions (podria simplificar aun mas al tener una sola instruccion pero por entenderlo yo mejor lo dejo asi))*/
        const productoEnCarrito = this.productosCarrito.find((productoActual) => {
            return productoActual.sku === nuevoProducto.sku;
        }); // busco en el carrito si ya existe un producto con el mismo sku

        if (productoEnCarrito) { 
            productoEnCarrito.quantity = nuevaCantidad; // si el producto existe, actualizo su cantidad con la nueva que llega
        }
        else {
            this.productosCarrito.push(nuevoProducto); // y si no existe, lo añado al carrito
        }
    }

    obtenerInformacionProducto(sku) { // Devuelve los datos de un producto además de las unidades seleccionadas

        const productoEncontrado = this.productosCarrito.find((productoActual) => {
            return productoActual.sku === sku;
        });

        if (productoEncontrado) { // si el producto se encuentra
            return { // devuelvo un objeto con su informacion detallada 
                sku: productoEncontrado.sku,
                title: productoEncontrado.title,
                price: Number(productoEncontrado.price),
                quantity: parseInt(productoEncontrado.quantity),
                total: Number(productoEncontrado.price) * parseInt(productoEncontrado.quantity)
            };
        }
        else { // y si no, devuelvo null
            return null;
        }
    }

    obtenerCarrito() { // Devuelve información de los productos añadidos al carrito // Además del total calculado de todos los productos

        const desgloseProductosEnCarrito = this.productosCarrito.map((producto) => { // aplico metodo 'map' al array que itera sobre cada producto añadido al carrito (uso map ya que quiero hacer algo con todos los elementos del array (pero no entre ellos))
            return this.obtenerInformacionProducto(producto.sku); // uso metodo 'obtenerInformacionProducto' (de mi clase Carrito) para poder convertir cada producto del array en un objeto y obtener asi toda su informacion detallada
        });


        const totalCarrito = desgloseProductosEnCarrito.reduce((totalAcumulado, producto) => { // aplico metodo 'reduce' para poder hacer una operacion con todos los elementos del array (entre ellos)
                return totalAcumulado + producto.total; // calculo el total de todos los productos en el carrito (por cada producto, se suma su propiedad total al totalAcumulado)
            }, 0); // 0 es el valor inical del parametro acumulador

        return {
            products: desgloseProductosEnCarrito,
            total: totalCarrito.toFixed(2) // redondeo el total a dos decimales
        };
    }
}