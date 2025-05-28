import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    nombreUsuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    
}, {
    tableName: 'usuario',
    timestamps: false
});

export default Usuario;