// src/routes/itemListaCompra.routes.js
import { Router } from 'express';
import { ItemListaCompra, ListaCompra, Ingrediente } from '../models/index.js'; 

const router = Router();

// --- Obtener todos los ítems de lista de compra ---
router.get('/', async (req, res) => {
    try {
        const itemsListaCompra = await ItemListaCompra.findAll({
            include: [
               
                { model: Ingrediente, attributes: ['nombre'] } 
            ]
        });
        res.json(itemsListaCompra);
    } catch (error) {
        console.error('Error al obtener todos los ítems de lista de compra:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener un ítem de lista de compra por ID ---
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const itemListaCompra = await ItemListaCompra.findByPk(id, {
            include: [
               
                { model: Ingrediente, attributes: ['nombre'] }
            ]
        });
        if (!itemListaCompra) {
            return res.status(404).json({ message: 'Ítem de lista de compra no encontrado.' });
        }
        res.json(itemListaCompra);
    } catch (error) {
        console.error(`Error al obtener el ítem de lista de compra con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener ítems por ID de Lista de Compra (si existe el modelo ListaCompra) ---
router.get('/lista/:id_listaCompra', async (req, res) => {
    const { id_listaCompra } = req.params;
    try {
        // Valida que la ListaCompra exista antes de buscar sus ítems
        const listaExistente = await ListaCompra.findByPk(id_listaCompra);
        if (!listaExistente) {
            return res.status(404).json({ message: 'La Lista de Compra especificada no existe.' });
        }

        const items = await ItemListaCompra.findAll({
            where: { id_listaCompra },
            include: [{ model: Ingrediente, attributes: ['nombre'] }]
        });
        
        if (items.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ítems para esta lista de compra.' });
        }
        res.json(items);
    } catch (error) {
        console.error(`Error al obtener ítems para la lista de compra con ID ${id_listaCompra}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Crear un nuevo ítem de lista de compra ---
router.post('/', async (req, res) => {
    const { id, cantidad, unidad_medida, id_listaCompra, id_ingrediente } = req.body;
    try {
    
        const listaExistente = await ListaCompra.findByPk(id_listaCompra);
        if (!listaExistente) {
            return res.status(400).json({ message: 'El ID de lista de compra proporcionado no existe.' });
        }

        const ingredienteExistente = await Ingrediente.findByPk(id_ingrediente);
        if (!ingredienteExistente) {
            return res.status(400).json({ message: 'El ID de ingrediente proporcionado no existe.' });
        }

        //Evitar duplicados (un mismo ingrediente en la misma lista)
        const existeItem = await ItemListaCompra.findOne({
            where: { id_listaCompra, id_ingrediente }
        });
        if (existeItem) {
            return res.status(409).json({ message: 'Este ingrediente ya está en esta lista de compra.' });
        }

        const newItemListaCompra = await ItemListaCompra.create({ id, cantidad, unidad_medida, id_listaCompra, id_ingrediente });
        res.status(201).json(newItemListaCompra);
    } catch (error) {
        console.error('Error al crear un nuevo ítem de lista de compra:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el ítem.' });
    }
});

// --- Actualizar un ítem de lista de compra existente ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { cantidad, unidad_medida, id_listaCompra, id_ingrediente } = req.body;
    try {
        const itemListaCompra = await ItemListaCompra.findByPk(id);
        if (!itemListaCompra) {
            return res.status(404).json({ message: 'Ítem de lista de compra no encontrado.' });
        }

        //Validar si la nueva lista de compra o ingrediente existen
        if (id_listaCompra) {
            const listaExistente = await ListaCompra.findByPk(id_listaCompra);
            if (!listaExistente) {
                return res.status(400).json({ message: 'El nuevo ID de lista de compra proporcionado no existe.' });
            }
        }
        if (id_ingrediente) {
            const ingredienteExistente = await Ingrediente.findByPk(id_ingrediente);
            if (!ingredienteExistente) {
                return res.status(400).json({ message: 'El nuevo ID de ingrediente proporcionado no existe.' });
            }
        }

        await itemListaCompra.update({ cantidad, unidad_medida, id_listaCompra, id_ingrediente });
        res.json({ message: 'Ítem de lista de compra actualizado exitosamente.', itemListaCompra });
    } catch (error) {
        console.error(`Error al actualizar el ítem de lista de compra con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el ítem.' });
    }
});

// --- Eliminar un ítem de lista de compra ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const itemListaCompra = await ItemListaCompra.findByPk(id);
        if (!itemListaCompra) {
            return res.status(404).json({ message: 'Ítem de lista de compra no encontrado.' });
        }
        await itemListaCompra.destroy();
        res.status(200).json({ message: 'Ítem de lista de compra eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar el ítem de lista de compra con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el ítem.' });
    }
});

export default router;