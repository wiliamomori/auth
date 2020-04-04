const { Model, DataTypes } = require('sequelize');

class File extends Model {
  static init(sequelize) {
    super.init({
      filename: DataTypes.STRING,
    }, {
      sequelize
    })
  }

  static associate(models) {

  }
}

module.exports = File;