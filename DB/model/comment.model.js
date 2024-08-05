import { DataTypes } from 'sequelize';
import { sequelize } from '../connection/connection.js'; // تأكد من وجود اتصال Sequelize
import userModel from './user.model.js'; // نموذج المستخدم
import blogModel from './blog.model.js'; // نموذج البلوق

const commentModel = sequelize.define('Comment', {
  description: {
    type: DataTypes.STRING,
    allowNull: false, // الوصف مطلوب
  },
  userId: {
    type: DataTypes.INTEGER, // افترض أن userId هو عدد صحيح
    allowNull: false, // userId مطلوب
    references: {
      model: userModel,
      key: 'id',
    },
  },
  blogId: {
    type: DataTypes.INTEGER, // افترض أن blogId هو عدد صحيح
    allowNull: false, // blogId مطلوب
    references: {
      model: blogModel,
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// إنشاء العلاقات بين النماذج
commentModel.belongsTo(userModel, { foreignKey: 'userId' });
commentModel.belongsTo(blogModel, { foreignKey: 'blogId' });

export default commentModel;
