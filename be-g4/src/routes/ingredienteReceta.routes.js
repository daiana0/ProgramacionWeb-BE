// src/routes/ingredienteReceta.routes.js
import { Router } from 'express';
import { IngredienteReceta, Ingrediente, Receta } from '../models/index.js'; // Asegúrate de importar Ingrediente y Receta

const router = Router();

// --- Obtener todas las asociaciones Ingrediente-Receta ---
router.get('/', async (req, res) => {
    try {
        const ingredientesReceta = await IngredienteReceta.findAll({
            include: [
                { model: Ingrediente, attributes: ['nombre'] }, // Incluye el nombre del ingrediente
                { model: Receta, attributes: ['nombreReceta'] }  // Incluye el nombre de la receta
            ]
        });
        res.json(ingredientesReceta);
    } catch (error) {
        console.error('Error al obtener todas las asociaciones Ingrediente-Receta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener una asociación Ingrediente-Receta por ID ---
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const ingredienteReceta = await IngredienteReceta.findByPk(id, {
            include: [
                { model: Ingrediente, attributes: ['nombre'] },
                { model: Receta, attributes: ['nombreReceta'] }
            ]
        });
        if (!ingredienteReceta) {
            return res.status(404).json({ message: 'Asociación Ingrediente-Receta no encontrada.' });
        }
        res.json(ingredienteReceta);
    } catch (error) {
        console.error(`Error al obtener la asociación Ingrediente-Receta con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener ingredientes de una receta específica ---
router.get('/receta/:id_receta', async (req, res) => {
    const { id_receta } = req.params;
    try {
        const ingredientesEnReceta = await IngredienteReceta.findAll({
            where: { id_receta },
            include: [{ model: Ingrediente, attributes: ['nombre'] }] // Solo el nombre del ingrediente
        });
        if (ingredientesEnReceta.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ingredientes para esta receta.' });
        }
        res.json(ingredientesEnReceta);
    } catch (error) {
        console.error(`Error al obtener ingredientes para la receta con ID ${id_receta}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener recetas que usan un ingrediente específico ---
router.get('/ingrediente/:id_ingrediente', async (req, res) => {
    const { id_ingrediente } = req.params;
    try {
        const recetasConIngrediente = await IngredienteReceta.findAll({
            where: { id_ingrediente },
            include: [{ model: Receta, attributes: ['nombreReceta'] }] // Solo el nombre de la receta
        });
        if (recetasConIngrediente.length === 0) {
            return res.status(404).json({ message: 'No se encontraron recetas para este ingrediente.' });
        }
        res.json(recetasConIngrediente);
    } catch (error) {
        console.error(`Error al obtener recetas para el ingrediente con ID ${id_ingrediente}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


// --- Crear una nueva asociación Ingrediente-Receta ---
router.post('/', async (req, res) => {
    const { id, cantidad, unidad_medida, id_ingrediente, id_receta } = req.body;
    try {
        // Validar si el ingrediente y la receta existen
        const ingredienteExistente = await Ingrediente.findByPk(id_ingrediente);
        if (!ingredienteExistente) {
            return res.status(400).json({ message: 'El ID de ingrediente proporcionado no existe.' });
        }

        const recetaExistente = await Receta.findByPk(id_receta);
        if (!recetaExistente) {
            return res.status(400).json({ message: 'El ID de receta proporcionado no existe.' });
        }

        // Opcional: Evitar duplicados (un mismo ingrediente en la misma receta)
        const existeAsociacion = await IngredienteReceta.findOne({
            where: { id_ingrediente, id_receta }
        });
        if (existeAsociacion) {
            return res.status(409).json({ message: 'Este ingrediente ya está asociado a esta receta.' });
        }

        const nuevaAsociacion = await IngredienteReceta.create({ id, cantidad, unidad_medida, id_ingrediente, id_receta });
        res.status(201).json(nuevaAsociacion);
    } catch (error) {
        console.error('Error al crear una nueva asociación Ingrediente-Receta:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la asociación.' });
    }
});

// --- Actualizar una asociación Ingrediente-Receta existente ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { cantidad, unidad_medida, id_ingrediente, id_receta } = req.body;
    try {
        const asociacion = await IngredienteReceta.findByPk(id);
        if (!asociacion) {
            return res.status(404).json({ message: 'Asociación Ingrediente-Receta no encontrada.' });
        }

        // Opcional: Validar si el nuevo ingrediente o receta existen
        if (id_ingrediente) {
            const ingredienteExistente = await Ingrediente.findByPk(id_ingrediente);
            if (!ingredienteExistente) {
                return res.status(400).json({ message: 'El nuevo ID de ingrediente proporcionado no existe.' });
            }
        }
        if (id_receta) {
            const recetaExistente = await Receta.findByPk(id_receta);
            if (!recetaExistente) {
                return res.status(400).json({ message: 'El nuevo ID de receta proporcionado no existe.' });
            }
        }

        await asociacion.update({ cantidad, unidad_medida, id_ingrediente, id_receta });
        res.json({ message: 'Asociación Ingrediente-Receta actualizada exitosamente.', asociacion });
    } catch (error) {
        console.error(`Error al actualizar la asociación Ingrediente-Receta con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la asociación.' });
    }
});

// --- Eliminar una asociación Ingrediente-Receta ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const asociacion = await IngredienteReceta.findByPk(id);
        if (!asociacion) {
            return res.status(404).json({ message: 'Asociación Ingrediente-Receta no encontrada.' });
        }
        await asociacion.destroy();
        res.status(200).json({ message: 'Asociación Ingrediente-Receta eliminada exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar la asociación Ingrediente-Receta con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la asociación.' });
    }
});

export default router;