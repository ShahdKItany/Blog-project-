import { DataTypes } from 'sequelize';
import { sequelize } from '../connection/connection.js';
import userModel from './user.model.js';

const blogModel = sequelize.define('Blog', {
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


blogModel.belongsTo(userModel);
userModel.hasMany(blogModel);  // هيم بعمل علاقه بين الجدولين ..blog and user
export default blogModel;