import express from 'express';
import Usuario from '../models/Usuario.js';

const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        usuario ? res.json(usuario) : res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const { id, nombreUsuario, email, contrasena } = req.body;
        const nuevoUsuario = await Usuario.create({ id,nombreUsuario, email, contrasena });
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un usuario existente
router.put('/:id', async (req, res) => {
    try {
        const { nombreUsuario, email, contrasena } = req.body;
        const usuario = await Usuario.findByPk(req.params.id);
        if (usuario) {
            await usuario.update({ nombreUsuario, email, contrasena });
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (usuario) {
            await usuario.destroy();
            res.json({ mensaje: 'Eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;