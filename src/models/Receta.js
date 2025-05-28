import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const Receta = sequelize.define('Receta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true         
    },
     tiempo_preparacion: {
        type: DataTypes.INTEGER,
        allowNull: true         
    },
     tiempo_coccion: {
        type: DataTypes.INTEGER,
        allowNull: true         
    },
     dificultad: {
        type: DataTypes.STRING,
        allowNull: true         
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario', // Nombre de la TABLA referenciada
            key: 'id'
        }
    },
    
}, {
    tableName: 'Receta',
    timestamps: false
});

export default Receta;