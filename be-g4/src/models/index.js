// src/models/index.js
import sequelize from '../db/connection.js';

// Importa todos los modelos (nota las extensiones .js)
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

// Modelos para tablas intermedias (Many-to-Many through tables)
import IngredienteReceta from './IngredienteReceta.js';
import RecetaCategoria from './RecetaCategoria.js';
import RecetaTipoCocina from './RecetaTipoCocina.js';

// --- (N:1))---
ItemListaCompra.belongsTo(ListaCompra, {
    foreignKey: 'id_listaCompra',
    targetKey: 'id'
});
ListaCompra.hasMany(ItemListaCompra, {
    foreignKey: 'id_listaCompra',
    sourceKey: 'id'
});
// --- (1:N))---
Ingrediente.belongsTo(ItemListaCompra, {
    foreignKey: 'id_ingrediente',
    targetKey: 'id'
});
ItemListaCompra.hasMany(Ingrediente, {
    foreignKey: 'id_ingrediente',
    sourceKey: 'id'
});
// --- (1:N))---
ListaCompra.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    targetKey: 'id'
});
Usuario.hasMany(ListaCompra, {
    foreignKey: 'id_usuario',
    sourceKey: 'id'
});
// --- (1:N))---
Usuario.belongsTo(Calificacion, {
    foreignKey: 'id_usuario',
    targetKey: 'id'
});
Calificacion.hasMany(Usuario, {
    foreignKey: 'id_usuario',
    sourceKey: 'id'
});
// --- (N:M) ---
Ingrediente.belongsToMany(Receta, {
  through: IngredienteReceta,
  foreignKey: 'id_ingrediente',
  otherKey: 'id_receta'
});
Receta.belongsToMany(Ingrediente, {
    through: IngredienteReceta,
    foreignKey: 'id_receta',
    otherKey: 'id_ingrediente'
});
// --- (N:M) ---
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
// --- (N:M) ---
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
// --- (1:N))---
Comentario.belongsTo(Receta, {
    foreignKey: 'id_receta',
    targetKey: 'id'
});
Receta.hasMany(Comentario, {
    foreignKey: 'id_receta',
    sourceKey: 'id'
});
// --- (1:N))---
Receta.belongsTo(Calificacion, {
    foreignKey: 'id_receta',
    targetKey: 'id'
});
Calificacion.hasMany(Receta, {
    foreignKey: 'id_receta',
    sourceKey: 'id'
});
// --- (1:N))---
Usuario.belongsTo(Calificacion, {
    foreignKey: 'id_usuario',
    targetKey: 'id'
});
Calificacion.hasMany(Usuario, {
    foreignKey: 'id_usuario',
    sourceKey: 'id'
});
// --- (1:N))---
PasoPreparacion.belongsTo(Receta, {
    foreignKey: 'id_receta',
    targetKey: 'id'
});
Receta.hasMany(PasoPreparacion, {
    foreignKey: 'id_receta',
    sourceKey: 'id'
});

// Exporta la instancia de sequelize y todos los modelos usando named exports
export {
 sequelize,
    Categoria,
    Calificacion,
    Comentario,
    Ingrediente,
    IngredienteReceta,
    ListaCompra,
    ItemListaCompra,
    PasoPreparacion,
    Receta,
    RecetaCategoria,
    RecetaTipoCocina,
    TipoCocina,
    Usuario
};