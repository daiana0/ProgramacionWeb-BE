import express from 'express';
import RecetaTipoCocina from '../models/RecetaTipoCocina.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const recetasTipoCocina = await RecetaTipoCocina.findAll();
        res.json(recetasTipoCocina);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener una relación por ID
router.get('/:id', async (req, res) => {
    try {
        const recetaTipoCocina = await RecetaTipoCocina.findByPk(req.params.id);
        recetaTipoCocina ? res.json(recetaTipoCocina) : res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear una nueva relación
router.post('/', async (req, res) => {
    try {
        const {id, id_tipoCocina, id_receta } = req.body;
        const nuevaRecetaTipoCocina = await RecetaTipoCocina.create({ id,id_tipoCocina, id_receta });
        res.status(201).json(nuevaRecetaTipoCocina);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar una relación existente
router.put('/:id', async (req, res) => {
    try {
        const { id_tipoCocina, id_receta } = req.body;
        const recetaTipoCocina = await RecetaTipoCocina.findByPk(req.params.id);
        if (recetaTipoCocina) {
            await recetaTipoCocina.update({ id_tipoCocina, id_receta });
            res.json(recetaTipoCocina);
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
        const recetaTipoCocina = await RecetaTipoCocina.findByPk(req.params.id);
        if (recetaTipoCocina) {
            await recetaTipoCocina.destroy();
            res.json({ mensaje: 'Eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;