import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const Calificacion = sequelize.define('Calificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    puntaje: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
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
    id_receta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Receta', // Nombre de la TABLA referenciada
            key: 'id'
        }
    },
    
}, {
    tableName: 'Calificacion',
    timestamps: false
});

export default Calificacion;