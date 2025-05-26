// src/routes/calificacion.routes.js
import { Router } from 'express';
import { Calificacion, Usuario, Receta } from '../models/index.js';

const router = Router();

// --- Obtener todas las calificaciones ---
router.get('/', async (req, res) => {
    try {
        const calificaciones = await Calificacion.findAll();
        res.json(calificaciones);
    } catch (error) {
        console.error('Error al obtener todas las calificaciones:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener una calificación por ID ---
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const calificacion = await Calificacion.findByPk(id);
        if (!calificacion) {
            return res.status(404).json({ message: 'Calificación no encontrada.' });
        }
        res.json(calificacion);
    } catch (error) {
        console.error(`Error al obtener la calificación con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener calificaciones por ID de usuario ---
router.get('/usuario/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const calificaciones = await Calificacion.findAll({
            where: { id_usuario },
            include: [{ model: Usuario, attributes: ['nombreUsuario', 'email'] }] // Incluye datos del usuario
        });
        if (calificaciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron calificaciones para este usuario.' });
        }
        res.json(calificaciones);
    } catch (error) {
        console.error(`Error al obtener calificaciones para el usuario con ID ${id_usuario}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener calificaciones por ID de receta ---
router.get('/receta/:id_receta', async (req, res) => {
    const { id_receta } = req.params;
    try {
        const calificaciones = await Calificacion.findAll({
            where: { id_receta },
            include: [{ model: Receta, attributes: ['nombreReceta', 'descripcion'] }] // Incluye datos de la receta
        });
        if (calificaciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron calificaciones para esta receta.' });
        }
        res.json(calificaciones);
    } catch (error) {
        console.error(`Error al obtener calificaciones para la receta con ID ${id_receta}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


// --- Crear una nueva calificación ---
router.post('/', async (req, res) => {
    const { id, puntaje, fecha, id_usuario, id_receta } = req.body;
    try {
        // Opcional: Validar si el usuario y la receta existen antes de crear la calificación
        const usuarioExistente = await Usuario.findByPk(id_usuario);
        if (!usuarioExistente) {
            return res.status(400).json({ message: 'El ID de usuario proporcionado no existe.' });
        }

        const recetaExistente = await Receta.findByPk(id_receta);
        if (!recetaExistente) {
            return res.status(400).json({ message: 'El ID de receta proporcionado no existe.' });
        }

        const nuevaCalificacion = await Calificacion.create({ id, puntaje, fecha, id_usuario, id_receta });
        res.status(201).json(nuevaCalificacion);
    } catch (error) {
        console.error('Error al crear una nueva calificación:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la calificación.' });
    }
});

// --- Actualizar una calificación existente ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { puntaje, fecha, id_usuario, id_receta } = req.body;
    try {
        const calificacion = await Calificacion.findByPk(id);
        if (!calificacion) {
            return res.status(404).json({ message: 'Calificación no encontrada.' });
        }

        // Opcional: Validar si el usuario y la receta existen antes de actualizar
        if (id_usuario) {
            const usuarioExistente = await Usuario.findByPk(id_usuario);
            if (!usuarioExistente) {
                return res.status(400).json({ message: 'El ID de usuario proporcionado no existe.' });
            }
        }
        if (id_receta) {
            const recetaExistente = await Receta.findByPk(id_receta);
            if (!recetaExistente) {
                return res.status(400).json({ message: 'El ID de receta proporcionado no existe.' });
            }
        }

        await calificacion.update({ puntaje, fecha, id_usuario, id_receta });
        res.json({ message: 'Calificación actualizada exitosamente.', calificacion });
    } catch (error) {
        console.error(`Error al actualizar la calificación con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la calificación.' });
    }
});

// --- Eliminar una calificación ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const calificacion = await Calificacion.findByPk(id);
        if (!calificacion) {
            return res.status(404).json({ message: 'Calificación no encontrada.' });
        }
        await calificacion.destroy();
        res.status(200).json({ message: 'Calificación eliminada exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar la calificación con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la calificación.' });
    }
});

export default router;