// src/routes/receta.routes.js
import { Router } from 'express';
// Importa tods los modelos relacionados para inclusiones
import { 
    Receta, 
    Usuario, 
    PasoPreparacion, 
    IngredienteReceta, 
    Ingrediente, 
    RecetaCategoria, 
    Categoria, 
    RecetaTipoCocina, 
    TipoCocina,
    Calificacion, 
    Comentario 
} from '../models/index.js';
import { Op } from 'sequelize'; 

const router = Router();

// --- Obtener todas las recetas ---
router.get('/', async (req, res) => {
    try {
        const recetas = await Receta.findAll({
            include: [
                { model: Usuario, attributes: ['nombreUsuario', 'email'] }, 
                { 
                    model: PasoPreparacion, 
                    attributes: ['numero_orden', 'instruccion'], 
                    order: [['numero_orden', 'ASC']] 
                },
                { 
                    model: IngredienteReceta, 
                    attributes: ['cantidad', 'unidad_medida'],
                    include: [{ model: Ingrediente, attributes: ['nombre'] }] 
                },
                { 
                    model: Categoria, 
                    as: 'Categorias', 
                    attributes: ['nombre'], 
                    through: { attributes: [] } 
                },
                { 
                    model: TipoCocina, 
                    as: 'TiposCocina', 
                    attributes: ['nombre'], 
                    through: { attributes: [] } 
                },
                 { 
                    model: Calificacion, 
                    attributes: ['puntaje', 'fecha'],
                    include: [{ model: Usuario, attributes: ['nombreUsuario'] }] 
                },
                { 
                    model: Comentario, 
                    attributes: ['texto', 'fecha'],
                    include: [{ model: Usuario, attributes: ['nombreUsuario'] }] 
                }
            ]
        });
        res.json(recetas);
    } catch (error) {
        console.error('Error al obtener todas las recetas:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener una receta por ID ---
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const receta = await Receta.findByPk(id, {
            include: [
                { model: Usuario, attributes: ['nombreUsuario', 'email'] },
                { 
                    model: PasoPreparacion, 
                    attributes: ['numero_orden', 'instruccion'], 
                    order: [['numero_orden', 'ASC']]
                },
                { 
                    model: IngredienteReceta, 
                    attributes: ['cantidad', 'unidad_medida'],
                    include: [{ model: Ingrediente, attributes: ['nombre'] }]
                },
                { 
                    model: Categoria, 
                    as: 'Categorias', 
                    attributes: ['nombre'], 
                    through: { attributes: [] } 
                },
                { 
                    model: TipoCocina, 
                    as: 'TiposCocina', 
                    attributes: ['nombre'], 
                    through: { attributes: [] } 
                },
                 { 
                    model: Calificacion, 
                    attributes: ['puntaje', 'fecha'],
                    include: [{ model: Usuario, attributes: ['nombreUsuario'] }]
                },
                { 
                    model: Comentario, 
                    attributes: ['texto', 'fecha'],
                    include: [{ model: Usuario, attributes: ['nombreUsuario'] }]
                }
            ]
        });
        if (!receta) {
            return res.status(404).json({ message: 'Receta no encontrada.' });
        }
        res.json(receta);
    } catch (error) {
        console.error(`Error al obtener la receta con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener recetas por ID de usuario ---
router.get('/usuario/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const usuarioExistente = await Usuario.findByPk(id_usuario);
        if (!usuarioExistente) {
            return res.status(404).json({ message: 'El usuario especificado no existe.' });
        }

        const recetas = await Receta.findAll({
            where: { id_usuario },
            include: [
                { model: Usuario, attributes: ['nombreUsuario', 'email'] },
                { 
                    model: PasoPreparacion, 
                    attributes: ['numero_orden', 'instruccion'], 
                    order: [['numero_orden', 'ASC']]
                },
                { 
                    model: IngredienteReceta, 
                    attributes: ['cantidad', 'unidad_medida'],
                    include: [{ model: Ingrediente, attributes: ['nombre'] }]
                },
                { 
                    model: Categoria, 
                    as: 'Categorias', 
                    attributes: ['nombre'], 
                    through: { attributes: [] } 
                },
                { 
                    model: TipoCocina, 
                    as: 'TiposCocina', 
                    attributes: ['nombre'], 
                    through: { attributes: [] } 
                },
                { 
                    model: Calificacion, 
                    attributes: ['puntaje', 'fecha'],
                    include: [{ model: Usuario, attributes: ['nombreUsuario'] }]
                },
                { 
                    model: Comentario, 
                    attributes: ['texto', 'fecha'],
                    include: [{ model: Usuario, attributes: ['nombreUsuario'] }]
                }
            ]
        });
        if (recetas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron recetas para este usuario.' });
        }
        res.json(recetas);
    } catch (error) {
        console.error(`Error al obtener recetas para el usuario con ID ${id_usuario}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Crear una nueva receta ---
router.post('/', async (req, res) => {
    const { 
        id, 
        titulo, 
        descripcion, 
        tiempo_preparacion, 
        tiempo_coccion, 
        dificultad, 
        id_usuario,
        ingredientes,
        pasos,        
        categorias,   
        tipos_cocina 
    } = req.body;

    try {
        // Validar si el usuario existe
        const usuarioExistente = await Usuario.findByPk(id_usuario);
        if (!usuarioExistente) {
            return res.status(400).json({ message: 'El ID de usuario proporcionado no existe.' });
        }

        //Validar si el título de la receta ya existe
        const recetaExistente = await Receta.findOne({ where: { titulo } });
        if (recetaExistente) {
            return res.status(409).json({ message: 'Ya existe una receta con este título.' });
        }

        const nuevaReceta = await Receta.create({ 
            id, 
            titulo, 
            descripcion, 
            tiempo_preparacion, 
            tiempo_coccion, 
            dificultad, 
            id_usuario 
        });

        // Crear pasos de preparacion si se proporcionan
        if (pasos && pasos.length > 0) {
            const pasosParaCrear = pasos.map(p => ({ ...p, id_receta: nuevaReceta.id }));
            await PasoPreparacion.bulkCreate(pasosParaCrear);
        }

        // Crear asociaciones de ingredientes si se proporcionan
        if (ingredientes && ingredientes.length > 0) {
            const ingredientesParaAsociar = ingredientes.map(ing => ({ 
                ...ing, 
                id_receta: nuevaReceta.id 
            }));
            await IngredienteReceta.bulkCreate(ingredientesParaAsociar);
        }

        // Asociar categorías si se proporcionan
        if (categorias && categorias.length > 0) {
            
            const categoriasExistentes = await Categoria.findAll({
                where: { id: categorias.map(c => c.id) }
            });
            if (categoriasExistentes.length !== categorias.length) {
                return res.status(400).json({ message: 'Algunas IDs de categoría proporcionadas no existen.' });
            }
            await nuevaReceta.setCategorias(categorias.map(c => c.id));
        }

        // Asociar tipos de cocina si se proporcionan
        if (tipos_cocina && tipos_cocina.length > 0) {
            
            const tiposCocinaExistentes = await TipoCocina.findAll({
                where: { id: tipos_cocina.map(tc => tc.id) }
            });
            if (tiposCocinaExistentes.length !== tipos_cocina.length) {
                return res.status(400).json({ message: 'Algunas IDs de tipo de cocina proporcionadas no existen.' });
            }
            await nuevaReceta.setTiposCocina(tipos_cocina.map(tc => tc.id));
        }

        res.status(201).json(nuevaReceta);
    } catch (error) {
        console.error('Error al crear una nueva receta:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la receta.' });
    }
});

// --- Actualizar una receta existente ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { 
        titulo, 
        descripcion, 
        tiempo_preparacion, 
        tiempo_coccion, 
        dificultad, 
        id_usuario,
        ingredientes, 
        pasos,        
        categorias,  
        tipos_cocina  
    } = req.body;

    try {
        const receta = await Receta.findByPk(id);
        if (!receta) {
            return res.status(404).json({ message: 'Receta no encontrada.' });
        }

        // Validar si el nuevo usuario existe 
        if (id_usuario && id_usuario !== receta.id_usuario) {
            const usuarioExistente = await Usuario.findByPk(id_usuario);
            if (!usuarioExistente) {
                return res.status(400).json({ message: 'El nuevo ID de usuario proporcionado no existe.' });
            }
        }

        // Validar si cambia titulo
        if (titulo && titulo !== receta.titulo) {
            const recetaConMismoTitulo = await Receta.findOne({
                where: { titulo, id: { [Op.ne]: id } }
            });
            if (recetaConMismoTitulo) {
                return res.status(409).json({ message: 'Ya existe otra receta con este título.' });
            }
        }

        await receta.update({ 
            titulo, 
            descripcion, 
            tiempo_preparacion, 
            tiempo_coccion, 
            dificultad, 
            id_usuario 
        });

        // Actualizar pasos de preparación
        if (pasos) {
        
            await PasoPreparacion.destroy({ where: { id_receta: receta.id } });
            if (pasos.length > 0) {
                const pasosParaCrear = pasos.map(p => ({ ...p, id_receta: receta.id }));
                await PasoPreparacion.bulkCreate(pasosParaCrear);
            }
        }

        // Actualizar ingredientes
        if (ingredientes) {
            // Eliminar ingredientes existentes y crear nuevos.
            await IngredienteReceta.destroy({ where: { id_receta: receta.id } });
            if (ingredientes.length > 0) {
                const ingredientesParaAsociar = ingredientes.map(ing => ({ 
                    ...ing, 
                    id_receta: receta.id 
                }));
                await IngredienteReceta.bulkCreate(ingredientesParaAsociar);
            }
        }

        // Actualizar categorías
        if (categorias) {
            const categoriasExistentes = await Categoria.findAll({
                where: { id: categorias.map(c => c.id) }
            });
            if (categoriasExistentes.length !== categorias.length) {
                return res.status(400).json({ message: 'Algunas IDs de categoría proporcionadas para actualizar no existen.' });
            }
            await receta.setCategorias(categorias.map(c => c.id));
        }

        // Actualizar tipos de cocina
        if (tipos_cocina) {
            const tiposCocinaExistentes = await TipoCocina.findAll({
                where: { id: tipos_cocina.map(tc => tc.id) }
            });
            if (tiposCocinaExistentes.length !== tipos_cocina.length) {
                return res.status(400).json({ message: 'Algunas IDs de tipo de cocina proporcionadas para actualizar no existen.' });
            }
            await receta.setTiposCocina(tipos_cocina.map(tc => tc.id));
        }

        res.json({ message: 'Receta actualizada exitosamente.', receta });
    } catch (error) {
        console.error(`Error al actualizar la receta con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la receta.' });
    }
});

// --- Eliminar una receta ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const receta = await Receta.findByPk(id);
        if (!receta) {
            return res.status(404).json({ message: 'Receta no encontrada.' });
        }

        await receta.destroy();
        res.status(200).json({ message: 'Receta eliminada exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar la receta con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la receta.' });
    }
});

export default router;