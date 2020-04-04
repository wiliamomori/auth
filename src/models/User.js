const { Model, DataTypes } = require('sequelize');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class User extends Model {
  static init(sequelize) {
    return super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    }, {
      hooks: {
        beforeSave: async (user, options) => {
          if (!user.changed("password")) next();
          user.password = await bcrypt.hash(user.password, 8);
        },
      },
      sequelize
    })
  }

  static associate(models) {

  }

  async compareHash(hash){
    return await bcrypt.compare(hash, this.password);
  }

  async generateToken(){
    return await jwt.sign({ id: this.id }, process.env.SECRET, {
      expiresIn: 86400
    });
  }

}

User.prototype.toJSON =  function () {
  var values = Object.assign({}, this.get());

  delete values.password;
  return values;
}

module.exports = User;