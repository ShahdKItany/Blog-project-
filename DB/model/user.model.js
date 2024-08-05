import { DataTypes } from 'sequelize';
import { sequelize } from '../connection/connection.js';
import bcrypt from 'bcryptjs';

const userModel = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // الاسم مطلوب
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // يجب أن يكون البريد الإلكتروني فريداً
    validate: {
      isEmail: true, // التحقق من صحة البريد الإلكتروني
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // كلمة المرور مطلوبة
  },
  confirmEmail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // الافتراضي هو عدم تأكيد البريد الإلكتروني
  },
});

// قبل حفظ المستخدم، نقوم بتشفير كلمة المرور
userModel.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// التحقق من صحة كلمة المرور
userModel.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default userModel;
