// src/routes/comentario.routes.js
import { Router } from 'express';
import { Comentario, Usuario, Receta } from '../models/index.js'; 

const router = Router();

// --- Obtener todos los comentarios ---
router.get('/', async (req, res) => {
    try {
        const comentarios = await Comentario.findAll();
        res.json(comentarios);
    } catch (error) {
        console.error('Error al obtener todos los comentarios:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener un comentario por ID ---
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const comentario = await Comentario.findByPk(id);
        if (!comentario) {
            return res.status(404).json({ message: 'Comentario no encontrado.' });
        }
        res.json(comentario);
    } catch (error) {
        console.error(`Error al obtener el comentario con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener comentarios por ID de usuario ---
router.get('/usuario/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const comentarios = await Comentario.findAll({
            where: { id_usuario },
            include: [{ model: Usuario, attributes: ['nombreUsuario', 'email'] }] // Incluye datos del usuario
        });
        if (comentarios.length === 0) {
            return res.status(404).json({ message: 'No se encontraron comentarios para este usuario.' });
        }
        res.json(comentarios);
    } catch (error) {
        console.error(`Error al obtener comentarios para el usuario con ID ${id_usuario}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener comentarios por ID de receta ---
router.get('/receta/:id_receta', async (req, res) => {
    const { id_receta } = req.params;
    try {
        const comentarios = await Comentario.findAll({
            where: { id_receta },
            include: [{ model: Receta, attributes: ['nombreReceta', 'descripcion'] }] // Asumiendo que Receta tiene esos atributos
        });
        if (comentarios.length === 0) {
            return res.status(404).json({ message: 'No se encontraron comentarios para esta receta.' });
        }
        res.json(comentarios);
    } catch (error) {
        console.error(`Error al obtener comentarios para la receta con ID ${id_receta}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Crear un nuevo comentario ---
router.post('/', async (req, res) => {
    const { id, texto, fecha, id_usuario, id_receta } = req.body;
    try {
        // Validar si el usuario y la receta existen antes de crear el comentario
        const usuarioExistente = await Usuario.findByPk(id_usuario);
        if (!usuarioExistente) {
            return res.status(400).json({ message: 'El ID de usuario proporcionado no existe.' });
        }

        const recetaExistente = await Receta.findByPk(id_receta);
        if (!recetaExistente) {
            return res.status(400).json({ message: 'El ID de receta proporcionado no existe.' });
        }

        const nuevoComentario = await Comentario.create({ id, texto, fecha, id_usuario, id_receta });
        res.status(201).json(nuevoComentario);
    } catch (error) {
        console.error('Error al crear un nuevo comentario:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el comentario.' });
    }
});

// --- Actualizar un comentario existente ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { texto, fecha, id_usuario, id_receta } = req.body;
    try {
        const comentario = await Comentario.findByPk(id);
        if (!comentario) {
            return res.status(404).json({ message: 'Comentario no encontrado.' });
        }

        // Validar si el usuario y la receta existen antes de actualizar
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

        await comentario.update({ texto, fecha, id_usuario, id_receta });
        res.json({ message: 'Comentario actualizado exitosamente.', comentario });
    } catch (error) {
        console.error(`Error al actualizar el comentario con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el comentario.' });
    }
});

// --- Eliminar un comentario ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const comentario = await Comentario.findByPk(id);
        if (!comentario) {
            return res.status(404).json({ message: 'Comentario no encontrado.' });
        }
        await comentario.destroy();
        res.status(200).json({ message: 'Comentario eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar el comentario con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el comentario.' });
    }
});

export default router;