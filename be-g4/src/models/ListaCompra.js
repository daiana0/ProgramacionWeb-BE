import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const ListaCompra = sequelize.define('ListaCompra', {
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
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
         references: {
            model: 'usuario', // Nombre de la TABLA referenciada
            key: 'id'
        }
    },
    
}, {
    tableName: 'ListaCompra',
    timestamps: false
});

export default ListaCompra;