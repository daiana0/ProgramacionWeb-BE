import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const TipoCocina = sequelize.define('TipoCocina', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    
     nombre: {
        type: DataTypes.STRING,
        allowNull: true,
        
    },
    
}, {
    tableName: 'TiposCocina',
    timestamps: false
});

export default TipoCocina;