import sequelize from '../db/connection.js';

// Importación de modelos principales
import Usuario from './Usuario.js';
import ListaCompra from './ListaCompra.js';
import Receta from './Receta.js';
import Calificacion from './Calificacion.js';
import Categoria from './Categoria.js';
import Comentario from './Comentario.js';
import Ingrediente from './Ingrediente.js';
import ItemListaCompra from './ItemListaCompra.js';
import PasoPreparacion from './PasoPreparacion.js';
import TipoCocina from './TipoCocina.js';

// Tablas intermedias para relaciones N:M
import IngredienteReceta from './IngredienteReceta.js';
import RecetaCategoria from './RecetaCategoria.js';
import RecetaTipoCocina from './RecetaTipoCocina.js';


// --- Relaciones 1:N ---
// Usuario - ListaCompra
Usuario.hasMany(ListaCompra, { foreignKey: 'id_usuario' });
ListaCompra.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// ListaCompra - ItemListaCompra
ListaCompra.hasMany(ItemListaCompra, { foreignKey: 'id_listaCompra' });
ItemListaCompra.belongsTo(ListaCompra, { foreignKey: 'id_listaCompra' });

// Ingrediente - ItemListaCompra
Ingrediente.hasMany(ItemListaCompra, { foreignKey: 'id_ingrediente' });
ItemListaCompra.belongsTo(Ingrediente, { foreignKey: 'id_ingrediente' });

// Usuario - Calificacion
Usuario.hasMany(Calificacion, { foreignKey: 'id_usuario' });
Calificacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Receta - Calificacion
Receta.hasMany(Calificacion, { foreignKey: 'id_receta' });
Calificacion.belongsTo(Receta, { foreignKey: 'id_receta' });

// Receta - Comentario
Receta.hasMany(Comentario, { foreignKey: 'id_receta' });
Comentario.belongsTo(Receta, { foreignKey: 'id_receta' });

// Receta - PasoPreparacion
Receta.hasMany(PasoPreparacion, { foreignKey: 'id_receta' });
PasoPreparacion.belongsTo(Receta, { foreignKey: 'id_receta' });


// Relaciones N:M 
// Receta-Ingrediente
Receta.belongsToMany(Ingrediente, {
    through: IngredienteReceta,
    foreignKey: 'id_receta',
    otherKey: 'id_ingrediente'
});
Ingrediente.belongsToMany(Receta, {
    through: IngredienteReceta,
    foreignKey: 'id_ingrediente',
    otherKey: 'id_receta'
});

// Receta - Categoria
Receta.belongsToMany(Categoria, {
    through: RecetaCategoria,
    foreignKey: 'id_receta',
    otherKey: 'id_categoria'
});
Categoria.belongsToMany(Receta, {
    through: RecetaCategoria,
    foreignKey: 'id_categoria',
    otherKey: 'id_receta'
});

// Receta - TipoCocina
Receta.belongsToMany(TipoCocina, {
    through: RecetaTipoCocina,
    foreignKey: 'id_receta',
    otherKey: 'id_tipoCocina'
});
TipoCocina.belongsToMany(Receta, {
    through: RecetaTipoCocina,
    foreignKey: 'id_tipoCocina',
    otherKey: 'id_receta'
});


// Exportación
export {
    sequelize,
    Usuario,
    ListaCompra,
    ItemListaCompra,
    Ingrediente,
    Receta,
    Calificacion,
    Comentario,
    Categoria,
    PasoPreparacion,
    TipoCocina,
    IngredienteReceta,
    RecetaCategoria,
    RecetaTipoCocina
};
