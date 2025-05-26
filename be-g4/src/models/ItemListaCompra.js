import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const ItemListaCompra = sequelize.define('ItemListaCompra', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unidad_medida: {
        type: DataTypes.STRING,
        allowNull: true         
    },
    id_listaCompra: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ListaCompra', // Nombre de la TABLA referenciada
            key: 'id'
        }
    },
    id_ingrediente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Ingrediente', // Nombre de la TABLA referenciada
            key: 'id'
        }
    }
    
}, {
    tableName: 'ItemListaCompra',
    timestamps: false
});

export default ItemListaCompra;