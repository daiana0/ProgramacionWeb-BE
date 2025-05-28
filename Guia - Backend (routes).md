### Paso 4: Creación de Rutas CRUD para los Modelos

En este paso, implementaremos las operaciones básicas de **C**rear, **R**ecuperar (Leer), **A**ctualizar y **D**estruir (CRUD) para cada uno de nuestros modelos: `Cliente`, `Proveedor`, `Producto` y `Compra`.

1.  **Organización de Rutas:**
    Para mantener nuestro código organizado, crearemos una carpeta `src/routes` y dentro de ella, un archivo de rutas por cada modelo.
    ```bash
    mkdir src/routes
    ```

2.  **Rutas para el Modelo `Cliente`:**
    Crea el archivo `src/routes/cliente.routes.js`:

    ```javascript
    // src/routes/cliente.routes.js
    import { Router } from 'express';
    import { Cliente } from '../models/index.js'; // Importamos el modelo Cliente

    const router = Router();

    // --- GET /api/clientes (Obtener todos los clientes) ---
    // Esta ruta recuperará todos los clientes de la base de datos.
    router.get('/', async (req, res) => {
        try {
            // Cliente.findAll(): Método de Sequelize para obtener todos los registros
            // de la tabla asociada al modelo 'Cliente'.
            // Devuelve una promesa que resuelve con un array de instancias de Cliente.
            const clientes = await Cliente.findAll();
            res.status(200).json(clientes);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    });

    // --- GET /api/clientes/:cuit (Obtener un cliente por CUIT) ---
    // Esta ruta recuperará un cliente específico basado en su CUIT.
    router.get('/:cuit', async (req, res) => {
        try {
            const { cuit } = req.params; // Obtenemos el CUIT de los parámetros de la URL

            // Cliente.findByPk(primaryKey): Método de Sequelize para buscar un registro
            // por su clave primaria (Primary Key). En este caso, 'cuit'.
            // Devuelve una promesa que resuelve con la instancia encontrada o null si no existe.
            const cliente = await Cliente.findByPk(cuit);

            if (cliente) {
                res.status(200).json(cliente);
            } else {
                res.status(404).json({ message: 'Cliente no encontrado' });
            }
        } catch (error) {
            console.error("Error al obtener cliente por CUIT:", error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    });

    // --- POST /api/clientes (Crear un nuevo cliente) ---
    // Esta ruta creará un nuevo cliente en la base de datos.
    router.post('/', async (req, res) => {
        try {
            // req.body contiene los datos enviados en el cuerpo de la solicitud HTTP (generalmente en formato JSON).
            // Cliente.create(data): Método de Sequelize para crear un nuevo registro.
            // 'data' es un objeto con los campos y valores del nuevo cliente.
            // Devuelve una promesa que resuelve con la instancia recién creada.
            const nuevoCliente = await Cliente.create(req.body);
            res.status(201).json(nuevoCliente); // 201 Created
        } catch (error) {
            console.error("Error al crear cliente:", error);
            // Manejo de errores específicos de Sequelize (ej. validaciones)
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    });

    // --- PUT /api/clientes/:cuit (Actualizar un cliente existente) ---
    // Esta ruta actualizará la información de un cliente existente.
    router.put('/:cuit', async (req, res) => {
        try {
            const { cuit } = req.params;
            const datosActualizar = req.body;

            // Primero, buscamos el cliente para asegurarnos de que existe.
            const cliente = await Cliente.findByPk(cuit);

            if (cliente) {
                // cliente.update(data): Método de instancia de Sequelize para actualizar
                // los campos del registro. 'data' es un objeto con los campos a modificar.
                // Devuelve una promesa que resuelve con la instancia actualizada.
                const clienteActualizado = await cliente.update(datosActualizar);
                res.status(200).json(clienteActualizado);
            } else {
                res.status(404).json({ message: 'Cliente no encontrado para actualizar' });
            }
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    });

    // --- DELETE /api/clientes/:cuit (Eliminar un cliente) ---
    // Esta ruta eliminará un cliente de la base de datos.
    router.delete('/:cuit', async (req, res) => {
        try {
            const { cuit } = req.params;

            // Cliente.destroy({ where: { condicion } }): Método de Sequelize para eliminar
            // registros que cumplan con la condición especificada en 'where'.
            // Devuelve una promesa que resuelve con el número de filas eliminadas.
            const resultado = await Cliente.destroy({
                where: { cuit: cuit }
            });

            if (resultado > 0) { // Si resultado es mayor que 0, significa que se eliminó al menos una fila.
                res.status(200).json({ message: 'Cliente eliminado exitosamente' }); // O 204 No Content si no se devuelve cuerpo
            } else {
                res.status(404).json({ message: 'Cliente no encontrado para eliminar' });
            }
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    });

    export default router;
    ```

3.  **Integrar Rutas de Clientes en `index.js` Principal:**
    Modifica tu archivo `index.js` (en la raíz) para usar estas nuevas rutas:

    ```javascript
    // index.js (en la raíz del proyecto)
    import express from 'express';
    import { sequelize, Cliente /* , otros modelos */ } from './src/models/index.js';

    // Importar las rutas
    import clienteRoutes from './src/routes/cliente.routes.js';
    // ... (importaremos más rutas aquí)

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json()); // Middleware para parsear JSON

    app.get('/', (req, res) => {
      res.send('¡Backend funcionando!');
    });

    // --- Montar las rutas ---
    // Todas las rutas definidas en cliente.routes.js estarán prefijadas con /api/clientes
    app.use('/api/clientes', clienteRoutes);
    // ... (montaremos más rutas aquí)


    async function startServer() {
      try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        await sequelize.sync({ force: false }); // Sincroniza modelos
        console.log('🔄 Modelos sincronizados con la base de datos.');

        app.listen(PORT, () => {
          console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
      } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
      }
    }

    startServer();
    ```

4.  **Rutas para el Modelo `Proveedor`:**
    Crea el archivo `src/routes/proveedor.routes.js`. La estructura es muy similar a la de `cliente.routes.js`, solo cambias el modelo y el nombre del parámetro de la clave primaria.

    ```javascript
    // src/routes/proveedor.routes.js
    import { Router } from 'express';
    import { Proveedor } from '../models/index.js';

    const router = Router();

    // GET /api/proveedores (Obtener todos)
    router.get('/', async (req, res) => {
        try {
            // Proveedor.findAll(): Recupera todos los proveedores.
            const proveedores = await Proveedor.findAll();
            res.status(200).json(proveedores);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener proveedores', error: error.message });
        }
    });

    // GET /api/proveedores/:cuit (Obtener uno por CUIT)
    router.get('/:cuit', async (req, res) => {
        try {
            const { cuit } = req.params;
            // Proveedor.findByPk(cuit): Busca un proveedor por su clave primaria 'cuit'.
            const proveedor = await Proveedor.findByPk(cuit);
            if (proveedor) {
                res.status(200).json(proveedor);
            } else {
                res.status(404).json({ message: 'Proveedor no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener proveedor', error: error.message });
        }
    });

    // POST /api/proveedores (Crear uno nuevo)
    router.post('/', async (req, res) => {
        try {
            // Proveedor.create(req.body): Crea un nuevo proveedor con los datos del cuerpo de la solicitud.
            const nuevoProveedor = await Proveedor.create(req.body);
            res.status(201).json(nuevoProveedor);
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
            }
            res.status(500).json({ message: 'Error al crear proveedor', error: error.message });
        }
    });

    // PUT /api/proveedores/:cuit (Actualizar uno existente)
    router.put('/:cuit', async (req, res) => {
        try {
            const { cuit } = req.params;
            const proveedor = await Proveedor.findByPk(cuit);
            if (proveedor) {
                // proveedor.update(req.body): Actualiza la instancia del proveedor encontrado.
                const proveedorActualizado = await proveedor.update(req.body);
                res.status(200).json(proveedorActualizado);
            } else {
                res.status(404).json({ message: 'Proveedor no encontrado para actualizar' });
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
            }
            res.status(500).json({ message: 'Error al actualizar proveedor', error: error.message });
        }
    });

    // DELETE /api/proveedores/:cuit (Eliminar uno)
    router.delete('/:cuit', async (req, res) => {
        try {
            const { cuit } = req.params;
            // Proveedor.destroy({ where: { cuit } }): Elimina el proveedor con el CUIT especificado.
            const resultado = await Proveedor.destroy({ where: { cuit: cuit } });
            if (resultado > 0) {
                res.status(200).json({ message: 'Proveedor eliminado exitosamente' });
            } else {
                res.status(404).json({ message: 'Proveedor no encontrado para eliminar' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar proveedor', error: error.message });
        }
    });

    export default router;
    ```

5.  **Integrar Rutas de Proveedores en `index.js` Principal:**
    Añade la importación y el `app.use` para las rutas de proveedores en `index.js`:

    ```javascript
    // index.js (extracto)
    // ...
    import clienteRoutes from './src/routes/cliente.routes.js';
    import proveedorRoutes from './src/routes/proveedor.routes.js'; // <--- NUEVO
    // ...

    // ...
    app.use('/api/clientes', clienteRoutes);
    app.use('/api/proveedores', proveedorRoutes); // <--- NUEVO
    // ...
    ```

6.  **Rutas para el Modelo `Producto`:**
    Crea el archivo `src/routes/producto.routes.js`. La clave primaria es `codigo`.

    ```javascript
    // src/routes/producto.routes.js
    import { Router } from 'express';
    import { Producto, Proveedor } from '../models/index.js'; // Importamos Proveedor para 'include'

    const router = Router();

    // GET /api/productos (Obtener todos, opcionalmente con su proveedor)
    router.get('/', async (req, res) => {
        try {
            // Producto.findAll({ include: ... }): Podemos usar 'include' para cargar
            // datos de modelos asociados. Aquí, incluimos la información del Proveedor
            // al que pertenece cada Producto. Sequelize se encarga de hacer el JOIN necesario.
            const productos = await Producto.findAll({
                include: [{
                    model: Proveedor,
                    attributes: ['cuit', 'nombre'] // Solo traer CUIT y nombre del proveedor
                }]
            });
            res.status(200).json(productos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener productos', error: error.message });
        }
    });

    // GET /api/productos/:codigo (Obtener uno por código, opcionalmente con su proveedor)
    router.get('/:codigo', async (req, res) => {
        try {
            const { codigo } = req.params;
            // Producto.findByPk(codigo, { include: ... }): Similar a findAll,
            // podemos incluir el Proveedor al buscar un producto por su PK.
            const producto = await Producto.findByPk(codigo, {
                include: [{ model: Proveedor, attributes: ['cuit', 'nombre'] }]
            });
            if (producto) {
                res.status(200).json(producto);
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener producto', error: error.message });
        }
    });

    // POST /api/productos (Crear uno nuevo)
    router.post('/', async (req, res) => {
        try {
            // Producto.create(req.body): Crea un nuevo producto.
            // Asegúrate de que el req.body incluya 'cuitProveedor' si es obligatorio.
            const nuevoProducto = await Producto.create(req.body);
            res.status(201).json(nuevoProducto);
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError' || error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'Error de validación o FK', errors: error.errors ? error.errors.map(e => e.message) : error.message });
            }
            res.status(500).json({ message: 'Error al crear producto', error: error.message });
        }
    });

    // PUT /api/productos/:codigo (Actualizar uno existente)
    router.put('/:codigo', async (req, res) => {
        try {
            const { codigo } = req.params;
            const producto = await Producto.findByPk(codigo);
            if (producto) {
                // producto.update(req.body): Actualiza la instancia del producto.
                const productoActualizado = await producto.update(req.body);
                res.status(200).json(productoActualizado);
            } else {
                res.status(404).json({ message: 'Producto no encontrado para actualizar' });
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ message: 'Error de validación o FK', errors: error.errors ? error.errors.map(e => e.message) : error.message });
            }
            res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
        }
    });

    // DELETE /api/productos/:codigo (Eliminar uno)
    router.delete('/:codigo', async (req, res) => {
        try {
            const { codigo } = req.params;
            // Producto.destroy({ where: { codigo } }): Elimina el producto.
            const resultado = await Producto.destroy({ where: { codigo: codigo } });
            if (resultado > 0) {
                res.status(200).json({ message: 'Producto eliminado exitosamente' });
            } else {
                res.status(404).json({ message: 'Producto no encontrado para eliminar' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
        }
    });

    export default router;
    ```

7.  **Integrar Rutas de Productos en `index.js` Principal:**

    ```javascript
    // index.js (extracto)
    // ...
    import clienteRoutes from './src/routes/cliente.routes.js';
    import proveedorRoutes from './src/routes/proveedor.routes.js';
    import productoRoutes from './src/routes/producto.routes.js'; // <--- NUEVO
    // ...

    // ...
    app.use('/api/clientes', clienteRoutes);
    app.use('/api/proveedores', proveedorRoutes);
    app.use('/api/productos', productoRoutes); // <--- NUEVO
    // ...
    ```

8.  **Rutas para el Modelo `Compra`:**
    Crea el archivo `src/routes/compra.routes.js`. La clave primaria es `id`. Este modelo tiene relaciones con `Cliente` y `Producto`.

    ```javascript
    // src/routes/compra.routes.js
    import { Router } from 'express';
    import { Compra, Cliente, Producto } from '../models/index.js'; // Importamos los modelos relacionados

    const router = Router();

    // GET /api/compras (Obtener todas, con cliente y producto)
    router.get('/', async (req, res) => {
        try {
            // Compra.findAll({ include: [...] }): Incluimos Cliente y Producto.
            // 'as' no es necesario si las asociaciones se definieron sin alias.
            // Sequelize infiere las claves foráneas a partir de las asociaciones.
            const compras = await Compra.findAll({
                include: [
                    { model: Cliente, attributes: ['cuit', 'nombre'] }, // Datos del cliente
                    { model: Producto, attributes: ['codigo', 'nombre', 'precioUnitario'] } // Datos del producto
                ]
            });
            res.status(200).json(compras);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener compras', error: error.message });
        }
    });

    // GET /api/compras/:id (Obtener una por ID, con cliente y producto)
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            // Compra.findByPk(id, { include: [...] }): Similar a findAll con 'include'.
            const compra = await Compra.findByPk(id, {
                include: [
                    { model: Cliente, attributes: ['cuit', 'nombre'] },
                    { model: Producto, attributes: ['codigo', 'nombre', 'precioUnitario'] }
                ]
            });
            if (compra) {
                res.status(200).json(compra);
            } else {
                res.status(404).json({ message: 'Compra no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener compra', error: error.message });
        }
    });

    // POST /api/compras (Crear una nueva)
    router.post('/', async (req, res) => {
        try {
            // Compra.create(req.body): Crea una nueva compra.
            // Asegúrate de que req.body incluya 'cuitCliente' y 'codigoProducto'.
            const nuevaCompra = await Compra.create(req.body);
            // Opcionalmente, podrías querer devolver la compra recién creada con sus datos asociados:
            const compraConDetalles = await Compra.findByPk(nuevaCompra.id, {
                 include: [
                    { model: Cliente, attributes: ['cuit', 'nombre'] },
                    { model: Producto, attributes: ['codigo', 'nombre', 'precioUnitario'] }
                ]
            });
            res.status(201).json(compraConDetalles || nuevaCompra);
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError' || error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'Error de validación o FK', errors: error.errors ? error.errors.map(e => e.message) : error.message });
            }
            res.status(500).json({ message: 'Error al crear compra', error: error.message });
        }
    });

    // PUT /api/compras/:id (Actualizar una existente)
    // Actualizar una compra puede ser complejo (ej. cambiar producto, cantidad).
    // Aquí un ejemplo simple de actualizar campos como 'cantidad'.
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const compra = await Compra.findByPk(id);
            if (compra) {
                // compra.update(req.body): Actualiza la instancia de la compra.
                // No permitimos cambiar cuitCliente o codigoProducto fácilmente aquí
                // para evitar inconsistencias, solo campos como 'cantidad'.
                // Para cambiar FKs, sería mejor eliminar y crear, o manejarlo con lógica de negocio más compleja.
                const { cuitCliente, codigoProducto, ...datosActualizables } = req.body; // Excluimos FKs
                const compraActualizada = await compra.update(datosActualizables);
                res.status(200).json(compraActualizada);
            } else {
                res.status(404).json({ message: 'Compra no encontrada para actualizar' });
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: 'Error de validación', errors: error.errors.map(e => e.message) });
            }
            res.status(500).json({ message: 'Error al actualizar compra', error: error.message });
        }
    });

    // DELETE /api/compras/:id (Eliminar una)
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            // Compra.destroy({ where: { id } }): Elimina la compra.
            const resultado = await Compra.destroy({ where: { id: id } });
            if (resultado > 0) {
                res.status(200).json({ message: 'Compra eliminada exitosamente' });
            } else {
                res.status(404).json({ message: 'Compra no encontrada para eliminar' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar compra', error: error.message });
        }
    });

    export default router;
    ```

9.  **Integrar Rutas de Compras en `index.js` Principal:**

    ```javascript
    // index.js (extracto)
    // ...
    import clienteRoutes from './src/routes/cliente.routes.js';
    import proveedorRoutes from './src/routes/proveedor.routes.js';
    import productoRoutes from './src/routes/producto.routes.js';
    import compraRoutes from './src/routes/compra.routes.js'; // <--- NUEVO
    // ...

    // ...
    app.use('/api/clientes', clienteRoutes);
    app.use('/api/proveedores', proveedorRoutes);
    app.use('/api/productos', productoRoutes);
    app.use('/api/compras', compraRoutes); // <--- NUEVO
    // ...
    ```

10. **Consideraciones Adicionales y Próximos Pasos:**

    *   **Pruebas:** Ahora puedes usar herramientas como Postman o Insomnia para probar tus endpoints CRUD.
        *   `GET http://localhost:3000/api/clientes`
        *   `POST http://localhost:3000/api/clientes` con un cuerpo JSON como `{"cuit": "20-12345678-9", "nombre": "Cliente Nuevo", "direccion": "Calle Falsa 123"}`
        *   Y así sucesivamente para los demás modelos y operaciones.
    *   **Validación Avanzada:** Para aplicaciones más robustas, querrás implementar validaciones más detalladas de los datos de entrada. Bibliotecas como `express-validator` o `joi` son excelentes para esto.
    *   **Manejo de Errores Centralizado:** Puedes crear un *middleware* de manejo de errores en Express para capturar y responder a los errores de una manera más consistente.
    *   **Controladores:** A medida que la lógica de tus rutas crece, es una buena práctica separar la lógica de manejo de solicitudes en archivos de "controladores" (siguiendo el patrón Modelo-Vista-Controlador o similar), manteniendo los archivos de rutas más limpios y enfocados en el enrutamiento.