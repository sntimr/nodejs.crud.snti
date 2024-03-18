const botonLeerDatos = document.getElementById('leer-datos');
const tablaProductos = document.getElementById('cuerpo-tabla');
const botonMostrarFormularioCrear = document.getElementById('mostrar-formulario-crear');
const formularioCrear = document.getElementById('formulario-crear');
const botonAgregarProducto = document.getElementById('agregar-producto');
const formularioModificar = document.getElementById('formularioModificar');
const botonActualizarProducto = document.getElementById('actualizar-producto');

async function cargarDatos() {
    try {
        const response = await fetch('/productos');
        const productos = await response.json();

        tablaProductos.innerHTML = '';

        productos.forEach(producto => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>
                    <button class="modificar-producto btn btn-warning" data-id="${producto.id}">Modificar</button>
                    <button class="eliminar-producto btn btn-danger" data-id="${producto.id}">Eliminar</button>
                </td>
            `;
            tablaProductos.appendChild(fila);
        });

        document.querySelectorAll('.eliminar-producto').forEach(boton => {
            boton.addEventListener('click', async () => {
                const id = boton.getAttribute('data-id');
                try {
                    const response = await fetch(`/productos/${id}`, { method: 'DELETE' });
                    if (response.ok) {
                        console.log('Producto eliminado correctamente');
                        cargarDatos();
                    } else {
                        console.log('Error al eliminar el producto');
                    }
                } catch (error) {
                    console.error('Error al eliminar el producto:', error);
                }
            });
        });

        document.querySelectorAll('.modificar-producto').forEach(boton => {
            boton.addEventListener('click', async () => {
                const id = boton.getAttribute('data-id');
                const response = await fetch(`/productos/${id}`);
                const producto = await response.json();
                formularioModificar.style.display = 'block';
                formularioModificar.dataset.id = id;
                document.getElementById('nombreModificar').value = producto.nombre;
                document.getElementById('descripcionModificar').value = producto.descripcion;
                document.getElementById('precioModificar').value = producto.precio;
                document.getElementById('stockModificar').value = producto.stock;
            });
        });

    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

botonMostrarFormularioCrear.addEventListener('click', () => {
    formularioCrear.style.display = 'block';
});

botonAgregarProducto.addEventListener('click', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;

    try {
        const response = await fetch('/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, descripcion, precio, stock })
        });

        if (response.ok) {
            console.log('Producto agregado correctamente');
            formularioCrear.reset();
            formularioCrear.style.display = 'none';
            cargarDatos();
        } else {
            console.log('Error al agregar el producto');
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
});

botonActualizarProducto.addEventListener('click', async () => {
    const id = formularioModificar.dataset.id;
    const nombre = document.getElementById('nombreModificar').value;
    const descripcion = document.getElementById('descripcionModificar').value;
    const precio = document.getElementById('precioModificar').value;
    const stock = document.getElementById('stockModificar').value;

    try {
        const response = await fetch(`/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, descripcion, precio, stock })
        });

        if (response.ok) {
            console.log('Producto actualizado correctamente');
            formularioModificar.reset();
            formularioModificar.style.display = 'none';
            cargarDatos();
        } else {
            console.log('Error al actualizar el producto');
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
});

botonLeerDatos.addEventListener('click', cargarDatos);
