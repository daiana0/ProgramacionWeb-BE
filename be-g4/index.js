// index.js (en la raíz del proyecto) - Versión Actualizada
import express from 'express';
// Importa desde el index de modelos (nota el /index.js)
import { sequelize, Usuario, ListaCompra, Receta, Calificacion, Categoria, Comentario, Ingrediente, ItemListaCompra, PasoPreparacion, TipoCocina, IngredienteReceta, RecetaCategoria, RecetaTipoCocina } from './src/models/index.js';
import usuarioRoutes from './src/routes/usuario.routes.js';
import listaCompraRoutes from './src/routes/listaCompra.routes.js';
import recetaRoutes from './src/routes/receta.routes.js';
import calificacionRoutes from './src/routes/calificacion.routes.js';
import categoriaRoutes from './src/routes/categoria.routes.js';
import comentarioRoutes from './src/routes/comentario.routes.js';
import ingredienteRoutes from './src/routes/ingrediente.routes.js';
import itemListaCompraRoutes from './src/routes/itemListaCompra.routes.js';
import pasoPreparacionRoutes from './src/routes/pasoPreparacion.routes.js';
import tipoCocinaRoutes from './src/routes/tipoCocina.routes.js';
import ingredienteRecetaRoutes from './src/routes/ingredienteReceta.routes.js';
import recetaCategoriaRoutes from './src/routes/recetaCategoria.routes.js';
import recetaTipoCocinaRoutes from './src/routes/recetaTipoCocina.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Backend funcionando!');
});

app.use('/calificaciones',calificacionRoutes);
app.use('/categorias',categoriaRoutes);
app.use('/comentarios',comentarioRoutes);
app.use('/ingredientes',ingredienteRoutes);
app.use('/ingredientesReceta',ingredienteRecetaRoutes);
app.use('/itemsListaCompra',itemListaCompraRoutes);
app.use('/listasCompra',listaCompraRoutes);
app.use('/pasosPreparacion',pasoPreparacionRoutes);
app.use('/recetas',recetaRoutes);
app.use('/recetasCategoria',recetaCategoriaRoutes);
app.use('/recetasTipoCocina',recetaTipoCocinaRoutes);
app.use('/tiposCocina',tipoCocinaRoutes);
app.use('/usuario',usuarioRoutes);


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