'use strict';
const {
  Model
} = require('sequelize');

const {hashPassword} = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Member.init({
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    isPenalized: DataTypes.BOOLEAN,
    bookBorrowed: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Member',
    hooks : {
      beforeCreate : (user,options) => {
        user.password = hashPassword(user.password)
      }
    }
  });
  return Member;
};