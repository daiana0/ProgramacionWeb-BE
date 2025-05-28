import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const PasoPreparacion = sequelize.define('PasoPreparacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    numero_orden: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    instruccion: {
        type: DataTypes.STRING,
        allowNull: true         
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
    tableName: 'PasoPreparacion',
    timestamps: false
});

export default PasoPreparacion;