import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const Categoria = sequelize.define('Categoria', {
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
    tableName: 'Categoria',
    timestamps: false
});

export default Categoria;