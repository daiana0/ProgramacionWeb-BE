// src/routes/categoria.routes.js
import { Router } from 'express';
import { Categoria, Receta } from '../models/index.js'; // Asegúrate de importar Receta si planeas usarla en rutas relacionadas

const router = Router();

// --- Obtener todas las categorías ---
router.get('/', async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener todas las categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener una categoría por ID ---
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }
        res.json(categoria);
    } catch (error) {
        console.error(`Error al obtener la categoría con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Crear una nueva categoría ---
router.post('/', async (req, res) => {
    const { id, nombre } = req.body;
    try {
        // Opcional: Validar si la categoría ya existe por nombre
        const categoriaExistente = await Categoria.findOne({ where: { nombre: nombre } });
        if (categoriaExistente) {
            return res.status(409).json({ message: 'Ya existe una categoría con este nombre.' });
        }

        const nuevaCategoria = await Categoria.create({ id, nombre });
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error('Error al crear una nueva categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la categoría.' });
    }
});

// --- Actualizar una categoría existente ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        // Opcional: Validar si el nuevo nombre ya existe en otra categoría
        if (nombre) {
            const categoriaConMismoNombre = await Categoria.findOne({
                where: { nombre: nombre, id: { [Op.ne]: id } } // [Op.ne] para que no sea el mismo ID
            });
            if (categoriaConMismoNombre) {
                return res.status(409).json({ message: 'Ya existe otra categoría con este nombre.' });
            }
        }

        await categoria.update({ nombre });
        res.json({ message: 'Categoría actualizada exitosamente.', categoria });
    } catch (error) {
        console.error(`Error al actualizar la categoría con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la categoría.' });
    }
});

// --- Eliminar una categoría ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        // Opcional: Considerar la lógica para manejar recetas asociadas a esta categoría
        // Por ejemplo, podrías evitar eliminar si hay recetas asociadas o desvincularlas
        // const recetasAsociadas = await categoria.getRecetas(); // Si tienes la asociación many-to-many con Receta
        // if (recetasAsociadas && recetasAsociadas.length > 0) {
        //     return res.status(400).json({ message: 'No se puede eliminar la categoría porque tiene recetas asociadas.' });
        // }

        await categoria.destroy();
        res.status(200).json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar la categoría con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la categoría.' });
    }
});

export default router;