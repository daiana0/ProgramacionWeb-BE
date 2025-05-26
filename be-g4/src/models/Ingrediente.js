import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const Ingrediente = sequelize.define('Ingrediente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
}, {
    tableName: 'Ingrediente',
    timestamps: false
});

export default Ingrediente;