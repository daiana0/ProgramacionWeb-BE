import express from 'express';
import TipoCocina from '../models/TipoCocina.js';

const router = express.Router();

// Obtener todos los tipos de cocina
router.get('/', async (req, res) => {
    try {
        const tiposCocina = await TipoCocina.findAll();
        res.json(tiposCocina);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un tipo de cocina por ID
router.get('/:id', async (req, res) => {
    try {
        const tipoCocina = await TipoCocina.findByPk(req.params.id);
        tipoCocina ? res.json(tipoCocina) : res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo tipo de cocina
router.post('/', async (req, res) => {
    try {
        const {id, nombre } = req.body;
        const nuevoTipoCocina = await TipoCocina.create({ id, nombre });
        res.status(201).json(nuevoTipoCocina);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un tipo de cocina existente
router.put('/:id', async (req, res) => {
    try {
        const { nombre } = req.body;
        const tipoCocina = await TipoCocina.findByPk(req.params.id);
        if (tipoCocina) {
            await tipoCocina.update({ nombre });
            res.json(tipoCocina);
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un tipo de cocina
router.delete('/:id', async (req, res) => {
    try {
        const tipoCocina = await TipoCocina.findByPk(req.params.id);
        if (tipoCocina) {
            await tipoCocina.destroy();
            res.json({ mensaje: 'Eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;