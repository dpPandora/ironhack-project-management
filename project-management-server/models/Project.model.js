// #/models/Project.model.js

const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const projectSchema = new Schema({
  title: String,
  desc: String,
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }]
});

const Project = model('Project', projectSchema);

module.exports = Project;