// src/routes/listaCompra.routes.js
import { Router } from 'express';
import { ListaCompra, Usuario, ItemListaCompra, Ingrediente } from '../models/index.js'; 

const router = Router();

// --- Obtener todas las listas de compra ---
router.get('/', async (req, res) => {
    try {
        const listasCompra = await ListaCompra.findAll({
            include: [
                { model: Usuario, attributes: ['nombreUsuario', 'email'] }, 
                
            ]
        });
        res.json(listasCompra);
    } catch (error) {
        console.error('Error al obtener todas las listas de compra:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener una lista de compra por ID ---
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const listaCompra = await ListaCompra.findByPk(id, {
            include: [
                { model: Usuario, attributes: ['nombreUsuario', 'email'] },
                { 
                    model: ItemListaCompra, 
                    include: [{ model: Ingrediente, attributes: ['nombre'] }] 
                } 
            ]
        });
        if (!listaCompra) {
            return res.status(404).json({ message: 'Lista de compra no encontrada.' });
        }
        res.json(listaCompra);
    } catch (error) {
        console.error(`Error al obtener la lista de compra con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Obtener listas de compra por ID de usuario ---
router.get('/usuario/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
    
        const usuarioExistente = await Usuario.findByPk(id_usuario);
        if (!usuarioExistente) {
            return res.status(404).json({ message: 'El Usuario especificado no existe.' });
        }

        const listasCompra = await ListaCompra.findAll({
            where: { id_usuario },
            include: [
                { model: Usuario, attributes: ['nombreUsuario', 'email'] },
                { 
                    model: ItemListaCompra, 
                    include: [{ model: Ingrediente, attributes: ['nombre'] }] 
                } 
            ]
        });
        
        if (listasCompra.length === 0) {
            return res.status(404).json({ message: 'No se encontraron listas de compra para este usuario.' });
        }
        res.json(listasCompra);
    } catch (error) {
        console.error(`Error al obtener listas de compra para el usuario con ID ${id_usuario}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// --- Crear una nueva lista de compra ---
router.post('/', async (req, res) => {
    const { id, nombre, id_usuario } = req.body;
    try {
        // Validar si el usuario existe
        const usuarioExistente = await Usuario.findByPk(id_usuario);
        if (!usuarioExistente) {
            return res.status(400).json({ message: 'El ID de usuario proporcionado no existe.' });
        }

        //Evitar nombres de lista duplicados para el mismo usuario
        const existeLista = await ListaCompra.findOne({
            where: { nombre, id_usuario }
        });
        if (existeLista) {
            return res.status(409).json({ message: 'Ya existe una lista con este nombre para este usuario.' });
        }

        const nuevaListaCompra = await ListaCompra.create({ id, nombre, id_usuario });
        res.status(201).json(nuevaListaCompra);
    } catch (error) {
        console.error('Error al crear una nueva lista de compra:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la lista.' });
    }
});

// --- Actualizar una lista de compra existente ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, id_usuario } = req.body;
    try {
        const listaCompra = await ListaCompra.findByPk(id);
        if (!listaCompra) {
            return res.status(404).json({ message: 'Lista de compra no encontrada.' });
        }

        //Validar si el nuevo usuario existe
        if (id_usuario) {
            const usuarioExistente = await Usuario.findByPk(id_usuario);
            if (!usuarioExistente) {
                return res.status(400).json({ message: 'El nuevo ID de usuario proporcionado no existe.' });
            }
        }

        //Validar si el nuevo nombre ya existe para el mismo usuario (si se cambia)
        if (nombre && listaCompra.nombre !== nombre) { // Solo si el nombre realmente cambia
            const existeListaConNuevoNombre = await ListaCompra.findOne({
                where: { nombre, id_usuario: id_usuario || listaCompra.id_usuario }
            });
            if (existeListaConNuevoNombre) {
                return res.status(409).json({ message: 'Ya existe otra lista con este nombre para este usuario.' });
            }
        }

        await listaCompra.update({ nombre, id_usuario });
        res.json({ message: 'Lista de compra actualizada exitosamente.', listaCompra });
    } catch (error) {
        console.error(`Error al actualizar la lista de compra con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la lista.' });
    }
});

// --- Eliminar una lista de compra ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const listaCompra = await ListaCompra.findByPk(id);
        if (!listaCompra) {
            return res.status(404).json({ message: 'Lista de compra no encontrada.' });
        }
        await ItemListaCompra.destroy({ where: { id_listaCompra: id } });

        await listaCompra.destroy();
        res.status(200).json({ message: 'Lista de compra eliminada exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar la lista de compra con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la lista.' });
    }
});

export default router;