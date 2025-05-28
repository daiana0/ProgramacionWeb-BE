## Guía Paso a Paso: Backend Node.js + Express + Sequelize (MySQL) con ES Modules

Este tutorial te guiará en la creación de un proyecto backend utilizando Node.js, el framework Express y el ORM Sequelize para interactuar con una base de datos MySQL, basándonos en el Diagrama Entidad-Relación (DER) del **Ejercicio 1: EMPRESA DE VENTAS** y utilizando la sintaxis de ES Modules.

**Prerrequisitos:**

*   Node.js (versión que soporte ES Modules de forma estable, ej. v14+) y npm (o yarn) instalados.
*   Un servidor MySQL instalado y corriendo.
*   Una base de datos creada en tu servidor MySQL (por ejemplo, `mi_proyecto_db`), la cual estará inicialmente vacía. Sequelize se encargará de crear las tablas.
*   Una herramienta para visualizar/gestionar tu base de datos MySQL (opcional pero recomendado, como MySQL Workbench, DBeaver, phpMyAdmin).

---

### Paso 1: Creación del Proyecto e Instalación de Dependencias

1.  **Crea la Carpeta del Proyecto:**
    Abre tu terminal o línea de comandos y navega hasta donde quieras crear tu proyecto. Luego, ejecuta:
    ```bash
    mkdir mi-proyecto-backend
    cd mi-proyecto-backend
    ```

2.  **Inicializa el Proyecto Node.js:**
    Esto creará un archivo `package.json`.
    ```bash
    npm init -y
    ```
    *(El `-y` acepta las configuraciones por defecto).*

3.  **Habilita ES Modules:**
    Abre el archivo `package.json` recién creado y añade la siguiente línea dentro del objeto JSON principal:
    ```json
    // package.json
    {
      // ...,
      "type": "module", // <--- Añade esta línea
      // ...
    }
    ```
    Esto le indica a Node.js que use la sintaxis `import`/`export` por defecto para los archivos `.js`.

4.  **Instala las Dependencias Necesarias:**
    *   `express`: El framework web para Node.js.
    *   `sequelize`: El ORM para interactuar con la base de datos.
    *   `mysql2`: El driver específico para que Sequelize pueda conectarse a MySQL.
    *   `dotenv`: Para gestionar variables de entorno.

    Ejecuta el siguiente comando:
    ```bash
    npm install express sequelize mysql2 dotenv
    ```

5.  **Instala Dependencias de Desarrollo (Opcional):**
    *   `nodemon`: Herramienta que reinicia automáticamente el servidor.
    ```bash
    npm install --save-dev nodemon
    ```

6.  **Configura el Script de Inicio (Opcional con Nodemon):**
    Modifica la sección `"scripts"` en tu `package.json`:
    ```json
    // package.json
    {
      // ... otras configuraciones ...
      "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js"
      },
      // ... otras configuraciones ...
    }
    ```
    *Crea un archivo `index.js` vacío en la raíz del proyecto por ahora.*

---

### Paso 2: Configuración de la Conexión a la Base de Datos (Sequelize)

1.  **Crea la Estructura de Carpetas:**
    ```bash
    mkdir src
    mkdir src/config
    mkdir src/db
    mkdir src/models
    ```

2.  **Configura Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto (¡añádelo a `.gitignore`!):
    ```dotenv
    # .env
    DB_NAME=mi_proyecto_db
    DB_USER=tu_usuario_mysql
    DB_PASSWORD=tu_contraseña_mysql
    DB_HOST=localhost
    DB_PORT=3306
    DB_DIALECT=mysql
    ```
    *Reemplaza `mi_proyecto_db`, `tu_usuario_mysql`, y `tu_contraseña_mysql` con tus credenciales reales.*

3.  **Crea el Archivo de Conexión Sequelize:**
    Dentro de `src/db`, crea un archivo llamado `connection.js`:

    ```javascript
    // src/db/connection.js
    import { Sequelize } from 'sequelize';
    import dotenv from 'dotenv';

    dotenv.config(); // Carga las variables de entorno desde .env

    // Extrae las variables de entorno
    const dbName = process.env.DB_NAME || 'mi_proyecto_db';
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbDialect = process.env.DB_DIALECT || 'mysql';
    const dbPort = process.env.DB_PORT || 3306;

    // Crea una instancia de Sequelize
    const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: dbDialect,
        port: dbPort,
        logging: false, // Desactiva los logs SQL
    });

    // Exporta la instancia para usarla en otros lugares
    export default sequelize;
    ```

4.  **Verifica la Conexión (Opcional):**
    Modifica tu archivo `index.js` en la raíz:
    ```javascript
    // index.js (en la raíz del proyecto)
    import express from 'express';
    import sequelize from './src/db/connection.js'; // Importa la instancia (nota el .js)

    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middleware básico para parsear JSON
    app.use(express.json());

    // Ruta de prueba
    app.get('/', (req, res) => {
      res.send('¡Backend funcionando!');
    });

    // Iniciar servidor y probar conexión DB
    async function startServer() {
      try {
        // Intenta autenticar la conexión a la DB
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        // Sincroniza modelos (más sobre esto en el Paso 3)
        // await sequelize.sync({ force: false });
        // console.log('🔄 Modelos sincronizados con la base de datos.');

        // Inicia el servidor Express
        app.listen(PORT, () => {
          console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
      } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
      }
    }

    startServer();
    ```
    Ejecuta `npm run dev`. Deberías ver el mensaje de conexión exitosa si las credenciales son correctas.

---

### Paso 3: Creación de Modelos Sequelize según el DER

Crea los archivos de modelo dentro de `src/models`.

1.  **Modelo `Cliente.js`:**
    ```javascript
    // src/models/Cliente.js
    import { DataTypes } from 'sequelize';
    import sequelize from '../db/connection.js'; // Nota la extensión .js

    const Cliente = sequelize.define('Cliente', {
        cuit: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fechaAlta: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        fechaNacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }
    }, {
        tableName: 'clientes',
        timestamps: false
    });

    export default Cliente;
    ```

2.  **Modelo `Proveedor.js`:**
    ```javascript
    // src/models/Proveedor.js
    import { DataTypes } from 'sequelize';
    import sequelize from '../db/connection.js'; // Nota la extensión .js

    const Proveedor = sequelize.define('Proveedor', {
        cuit: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'proveedores',
        timestamps: false
    });

    export default Proveedor;
    ```

3.  **Modelo `Producto.js`:**
    ```javascript
    // src/models/Producto.js
    import { DataTypes } from 'sequelize';
    import sequelize from '../db/connection.js'; // Nota la extensión .js

    const Producto = sequelize.define('Producto', {
        codigo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        precioUnitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        cuitProveedor: {
            type: DataTypes.STRING, // Debe coincidir con Proveedor.cuit
            allowNull: false,
            references: {
                model: 'proveedores', // Nombre de la TABLA referenciada
                key: 'cuit'
            }
        }
    }, {
        tableName: 'productos',
        timestamps: false
    });

    export default Producto;
    ```

4.  **Modelo `Compra.js`:**
    ```javascript
    // src/models/Compra.js
    import { DataTypes } from 'sequelize';
    import sequelize from '../db/connection.js'; // Nota la extensión .js

    const Compra = sequelize.define('Compra', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        cuitCliente: {
            type: DataTypes.STRING, // Coincidir con Cliente.cuit
            allowNull: false,
            references: {
                model: 'clientes', // Nombre de la TABLA
                key: 'cuit'
            }
        },
        codigoProducto: {
            type: DataTypes.INTEGER, // Coincidir con Producto.codigo
            allowNull: false,
            references: {
                model: 'productos', // Nombre de la TABLA
                key: 'codigo'
            }
        },
        fechaCompra: {
             type: DataTypes.DATE,
             defaultValue: DataTypes.NOW
        },
        cantidad: {
             type: DataTypes.INTEGER,
             allowNull: false,
             defaultValue: 1
        }
    }, {
        tableName: 'compras',
        timestamps: true // Habilita createdAt/updatedAt
    });

    export default Compra;
    ```

5.  **Centralizar Modelos y Definir Asociaciones:**
    Crea `src/models/index.js`:

    ```javascript
    // src/models/index.js
    import sequelize from '../db/connection.js';

    // Importa todos los modelos (nota las extensiones .js)
    import Cliente from './Cliente.js';
    import Proveedor from './Proveedor.js';
    import Producto from './Producto.js';
    import Compra from './Compra.js';

    // --- Definir Asociaciones ---

    // Relación Proveedor <-> Producto (1:N)
    Proveedor.hasMany(Producto, {
        foreignKey: 'cuitProveedor',
        sourceKey: 'cuit'
    });
    Producto.belongsTo(Proveedor, {
        foreignKey: 'cuitProveedor',
        targetKey: 'cuit'
    });

    // Relación Cliente <-> Compra (1:N)
    Cliente.hasMany(Compra, {
        foreignKey: 'cuitCliente',
        sourceKey: 'cuit'
    });
    Compra.belongsTo(Cliente, {
        foreignKey: 'cuitCliente',
        targetKey: 'cuit'
    });

    // Relación Producto <-> Compra (1:N)
    Producto.hasMany(Compra, {
        foreignKey: 'codigoProducto',
        sourceKey: 'codigo'
    });
    Compra.belongsTo(Producto, {
        foreignKey: 'codigoProducto',
        targetKey: 'codigo'
    });

    // Exporta la instancia de sequelize y todos los modelos usando named exports
    export {
        sequelize,
        Cliente,
        Proveedor,
        Producto,
        Compra
    };
    ```

6.  **Actualiza `index.js` (Raíz) para Usar el Índice de Modelos y Sincronizar:**
    Modifica tu archivo `index.js` principal:

    ```javascript
    // index.js (en la raíz del proyecto) - Versión Actualizada
    import express from 'express';
    // Importa desde el index de modelos (nota el /index.js)
    import { sequelize, Cliente, Proveedor, Producto, Compra } from './src/models/index.js';

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json());

    app.get('/', (req, res) => {
      res.send('¡Backend funcionando!');
    });

    // --- AQUÍ IRÍAN TUS RUTAS API ---
    // Ejemplo básico
    app.get('/clientes', async (req, res) => {
        try {
            const clientes = await Cliente.findAll();
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener clientes' });
        }
    });
    // ... Define más rutas ...


    // Iniciar servidor y sincronizar DB
    async function startServer() {
      try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        // Sincroniza los modelos con la base de datos.
        // force: false (default) - No borra tablas si existen.
        // force: true - Borra y recrea tablas. ¡PELIGROSO en producción!
        // alter: true - Intenta modificar tablas existentes.
        await sequelize.sync({ force: false }); // Cambia bajo tu propio riesgo
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

---

**Resumen y Próximos Pasos:**

1.  Has configurado un proyecto Node.js con Express usando ES Modules.
2.  Has instalado y configurado Sequelize para conectarse a MySQL.
3.  Has creado los modelos (`Cliente`, `Proveedor`, `Producto`, `Compra`) con sus atributos y claves.
4.  Has definido las relaciones entre los modelos.
5.  Has configurado la sincronización de modelos con la base de datos.

**Ahora puedes:**

*   Ejecutar `npm run dev`. Sequelize debería crear las tablas en tu base de datos si no existen.
*   Construir las rutas de tu API (endpoints) en `index.js` o en archivos de rutas separados (recomendado: crea una carpeta `src/routes`), utilizando los modelos importados para interactuar con la base de datos (ej. `Cliente.create()`, `Producto.findAll()`, etc.).