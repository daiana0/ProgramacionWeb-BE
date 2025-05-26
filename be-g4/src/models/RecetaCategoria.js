import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const RecetaCategoria = sequelize.define('RecetaCategoria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    
     id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categoria', // Nombre de la TABLA referenciada
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
    tableName: 'RecetaCategoria',
    timestamps: false
});

export default RecetaCategoria;