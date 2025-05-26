// src/routes/ingrediente.routes.js
import { Router } from 'express';
import { Ingrediente, Receta } from '../models/index.js'; // Asegúrate de importar Receta si planeas usarla para relacionar ingredientes

const router = Router();

// --- Obtener todos los ingredientes ---
router.get('/', async (req, res) => {
    try {
        const ingredientes = await Ingrediente.findAll();
        res.json(ingredientes);
    } catch (error) {
        console.error('Error al obtener todos los ingredientes:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener un ingrediente por ID ---
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const ingrediente = await Ingrediente.findByPk(id);
        if (!ingrediente) {
            return res.status(404).json({ message: 'Ingrediente no encontrado.' });
        }
        res.json(ingrediente);
    } catch (error) {
        console.error(`Error al obtener el ingrediente con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Crear un nuevo ingrediente ---
router.post('/', async (req, res) => {
    const { id, nombre } = req.body;
    try {
        // Opcional: Validar si el ingrediente ya existe por nombre
        const ingredienteExistente = await Ingrediente.findOne({ where: { nombre: nombre } });
        if (ingredienteExistente) {
            return res.status(409).json({ message: 'Ya existe un ingrediente con este nombre.' });
        }

        const nuevoIngrediente = await Ingrediente.create({ id, nombre });
        res.status(201).json(nuevoIngrediente);
    } catch (error) {
        console.error('Error al crear un nuevo ingrediente:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el ingrediente.' });
    }
});

// --- Actualizar un ingrediente existente ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const ingrediente = await Ingrediente.findByPk(id);
        if (!ingrediente) {
            return res.status(404).json({ message: 'Ingrediente no encontrado.' });
        }

        // Opcional: Validar si el nuevo nombre ya existe en otro ingrediente
        if (nombre) {
            const ingredienteConMismoNombre = await Ingrediente.findOne({
                where: { nombre: nombre, id: { [Op.ne]: id } } // [Op.ne] para que no sea el mismo ID
            });
            if (ingredienteConMismoNombre) {
                return res.status(409).json({ message: 'Ya existe otro ingrediente con este nombre.' });
            }
        }

        await ingrediente.update({ nombre });
        res.json({ message: 'Ingrediente actualizado exitosamente.', ingrediente });
    } catch (error) {
        console.error(`Error al actualizar el ingrediente con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el ingrediente.' });
    }
});

// --- Eliminar un ingrediente ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const ingrediente = await Ingrediente.findByPk(id);
        if (!ingrediente) {
            return res.status(404).json({ message: 'Ingrediente no encontrado.' });
        }

        // Opcional: Considerar la lógica para manejar recetas que usan este ingrediente
        // Por ejemplo, podrías evitar eliminar si hay recetas asociadas o desvincularlas
        // const recetasAsociadas = await ingrediente.getRecetas(); // Si tienes la asociación many-to-many con Receta
        // if (recetasAsociadas && recetasAsociadas.length > 0) {
        //     return res.status(400).json({ message: 'No se puede eliminar el ingrediente porque está asociado a recetas.' });
        // }

        await ingrediente.destroy();
        res.status(200).json({ message: 'Ingrediente eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar el ingrediente con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el ingrediente.' });
    }
});

export default router;