import express from 'express';
import RecetaCategoria from '../models/RecetaCategoria.js';

const router = express.Router();

// Obtener todas las relaciones receta-categoría
router.get('/', async (req, res) => {
    try {
        const recetasCategorias = await RecetaCategoria.findAll();
        res.json(recetasCategorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener una relación por ID
router.get('/:id', async (req, res) => {
    try {
        const recetaCategoria = await RecetaCategoria.findByPk(req.params.id);
        recetaCategoria ? res.json(recetaCategoria) : res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear una nueva relación
router.post('/', async (req, res) => {
    try {
        const { id, id_categoria, id_receta } = req.body;
        const nuevaRecetaCategoria = await RecetaCategoria.create({ id, id_categoria, id_receta });
        res.status(201).json(nuevaRecetaCategoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar una relación existente
router.put('/:id', async (req, res) => {
    try {
        const { id_categoria, id_receta } = req.body;
        const recetaCategoria = await RecetaCategoria.findByPk(req.params.id);
        if (recetaCategoria) {
            await recetaCategoria.update({ id_categoria, id_receta });
            res.json(recetaCategoria);
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar una relación
router.delete('/:id', async (req, res) => {
    try {
        const recetaCategoria = await RecetaCategoria.findByPk(req.params.id);
        if (recetaCategoria) {
            await recetaCategoria.destroy();
            res.json({ mensaje: 'Eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;