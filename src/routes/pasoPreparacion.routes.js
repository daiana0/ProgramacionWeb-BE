// src/routes/pasoPreparacion.routes.js
import { Router } from 'express';
import { PasoPreparacion, Receta } from '../models/index.js'; 

const router = Router();

// --- Obtener todos los pasos de preparación ---
router.get('/', async (req, res) => {
    try {
        const pasosPreparacion = await PasoPreparacion.findAll({
            include: [
                { model: Receta, attributes: ['nombreReceta', 'descripcion'] } 
            ]
        });
        res.json(pasosPreparacion);
    } catch (error) {
        console.error('Error al obtener todos los pasos de preparación:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener un paso de preparación por ID ---
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pasoPreparacion = await PasoPreparacion.findByPk(id, {
            include: [
                { model: Receta, attributes: ['nombreReceta', 'descripcion'] }
            ]
        });
        if (!pasoPreparacion) {
            return res.status(404).json({ message: 'Paso de preparación no encontrado.' });
        }
        res.json(pasoPreparacion);
    } catch (error) {
        console.error(`Error al obtener el paso de preparación con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener pasos de preparación por ID de receta ---
router.get('/receta/:id_receta', async (req, res) => {
    const { id_receta } = req.params;
    try {
        // Valida que la Receta exista antes de buscar sus pasos
        const recetaExistente = await Receta.findByPk(id_receta);
        if (!recetaExistente) {
            return res.status(404).json({ message: 'La Receta especificada no existe.' });
        }

        const pasos = await PasoPreparacion.findAll({
            where: { id_receta },
            order: [['numero_orden', 'ASC']] 
        });
        
        if (pasos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pasos de preparación para esta receta.' });
        }
        res.json(pasos);
    } catch (error) {
        console.error(`Error al obtener pasos de preparación para la receta con ID ${id_receta}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Crear un nuevo paso de preparación ---
router.post('/', async (req, res) => {
    const { id, numero_orden, instruccion, id_receta } = req.body;
    try {
        // Validar si la receta existe
        const recetaExistente = await Receta.findByPk(id_receta);
        if (!recetaExistente) {
            return res.status(400).json({ message: 'El ID de receta proporcionado no existe.' });
        }

        // Validar si ya existe un paso con el mismo numero_orden para la misma receta
        const pasoExistente = await PasoPreparacion.findOne({
            where: { id_receta, numero_orden }
        });
        if (pasoExistente) {
            return res.status(409).json({ message: `Ya existe un paso con el número de orden ${numero_orden} para esta receta.` });
        }

        const nuevoPaso = await PasoPreparacion.create({ id, numero_orden, instruccion, id_receta });
        res.status(201).json(nuevoPaso);
    } catch (error) {
        console.error('Error al crear un nuevo paso de preparación:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el paso.' });
    }
});

// --- Actualizar un paso de preparación existente ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { numero_orden, instruccion, id_receta } = req.body;
    try {
        const pasoPreparacion = await PasoPreparacion.findByPk(id);
        if (!pasoPreparacion) {
            return res.status(404).json({ message: 'Paso de preparación no encontrado.' });
        }

        // Validar si la nueva receta existe
        if (id_receta) {
            const recetaExistente = await Receta.findByPk(id_receta);
            if (!recetaExistente) {
                return res.status(400).json({ message: 'El nuevo ID de receta proporcionado no existe.' });
            }
        }

        //Validar unicidad del numero_orden si cambia y no es el mismo paso
        if (numero_orden && (numero_orden !== pasoPreparacion.numero_orden || id_receta !== pasoPreparacion.id_receta)) {
            const pasoConMismoOrden = await PasoPreparacion.findOne({
                where: {
                    id_receta: id_receta || pasoPreparacion.id_receta, 
                    numero_orden,
                    id: { [Op.ne]: id } 
                }
            });
            if (pasoConMismoOrden) {
                return res.status(409).json({ message: `Ya existe un paso con el número de orden ${numero_orden} para esta receta.` });
            }
        }

        await pasoPreparacion.update({ numero_orden, instruccion, id_receta });
        res.json({ message: 'Paso de preparación actualizado exitosamente.', pasoPreparacion });
    } catch (error) {
        console.error(`Error al actualizar el paso de preparación con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el paso.' });
    }
});

// --- Eliminar un paso de preparación ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pasoPreparacion = await PasoPreparacion.findByPk(id);
        if (!pasoPreparacion) {
            return res.status(404).json({ message: 'Paso de preparación no encontrado.' });
        }
        await pasoPreparacion.destroy();
        res.status(200).json({ message: 'Paso de preparación eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar el paso de preparación con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el paso.' });
    }
});

export default router;