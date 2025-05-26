import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const IngredienteReceta = sequelize.define('IngredienteReceta', {
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
    id_ingrediente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Ingrediente', // Nombre de la TABLA referenciada
            key: 'id'
        }
    },
     id_receta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Receta', // Nombre de la TABLA referenciada
            key: 'id'
        }
    },
    
}, {
    tableName: 'IngredienteReceta',
    timestamps: false
});

export default IngredienteReceta;