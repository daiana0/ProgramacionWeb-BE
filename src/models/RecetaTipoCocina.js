import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const RecetaTipoCocina = sequelize.define('RecetaTipoCocina', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    
     id_tipoCocina: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'TipoCocina', // Nombre de la TABLA referenciada
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
    tableName: 'RecetaTipoCocina',
    timestamps: false
});

export default RecetaTipoCocina;