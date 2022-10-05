// #/models/User.model.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
});

const User = model('User', userSchema);

module.exports = User;