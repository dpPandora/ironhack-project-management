// #/routes/tasks.routes.js

const Express = require('express');
const router = Express.Router();

const mongoose = require('mongoose');

const Project = require('../models/Project.model');
const Task = require('../models/Task.model');

router.post('/tasks', (req, res, next) => {
  const { project, title, desc } = req.body;

  if(!mongoose.Types.ObjectId.isValid(project)) {
    res.status(400).json({message: 'Project Id is invalid'});
    return;
  }

  Task
    .create({
      title,
      desc,
      project
    })
    .then(createdTask => {
      console.log(createdTask);

      return Project
        .findByIdAndUpdate(project, { $push: { tasks: createdTask._id }}, {new: true});
    })
    .then(updatedProj => {    
      res.status(200).json({message: 'POST task worked', updatedProj: updatedProj});
    })
    .catch(err => {
      console.log('Error at POST task', err);
    })
});

module.exports = router;