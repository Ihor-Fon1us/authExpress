const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    name: {
        type: String, required: true, trim: true,
    },
    email: {
        type: String, required: true, trim: true,
    },
    hashPassword: {
        type: String, required: true, trim: true,
    },  
    confirmed: {
        type: Boolean, default: false
    },
  }, { timestamps: true });
  

UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
 return bcrypt.compare(candidatePassword, this.hashPassword);
};

module.exports = mongoose.model('User', UserSchema);