const UserModel = require('../models/mongoose/userModel');
const bcrypt = require('bcrypt');

const COST = 12;

class UserService {
  static async getAll() {
    return UserModel.find({}).exec();
  }

  static async getOne(userId) {
    return UserModel.findById(userId).exec();
  }

  static async getByEmail(email) {
      return UserModel.findOne({ 'email': email }).exec();
  }

  static async getByName(name) {
    return UserModel.findOne({ 'name': name }).exec();
}

  static async create(data) {
    const newUser = new UserModel(data);
    newUser.hashPassword = bcrypt.hashSync(data.password, COST);
    return newUser.save();
  }

  static async update(userId, data) {
    
    const user = await UserModel.findById(userId);
    
    
    if(data.password) {
      user.password = data.password;
    }
    if(data.name) {
        user.name = data.name;
      }
    return user.save();
  }

  static async remove(userId) {
    return UserModel.findByIdAndRemove(userId);
  }
  static async removeAll() {
    return UserModel.remove({});
  }
}

module.exports = UserService;