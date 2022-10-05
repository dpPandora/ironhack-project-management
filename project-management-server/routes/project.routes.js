// #/routes/project.routes.js

const Express = require('express');
const { default: mongoose } = require('mongoose');
const router = Express.Router();

const Project = require('../models/Project.model');
const Task = require('../models/Task.model');

router.post('/projects', (req, res, next) => {
  const { title, desc } = req.body;

  Project
    .create({title, desc})
    .then(createdProj => {
      console.log(createdProj);
      res.status(200).json({message: 'POST projects worked', createdProj});
    })
    .catch(err => console.log('Error creating a project', err));

});

router.get('/projects', (req, res, next) => {
  Project
    .find()
    .populate('tasks')
    .then(foundProjects => {
      console.log(foundProjects);
      res.status(200).json({message: 'GET projects worked', projects: foundProjects});
    })
    .catch(err => console.log('Fetching array of projects failed', err));
});

router.get('/projects/:projectId', (req, res, next) => {
  const { projectId } = req.params;

  if(!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({message: 'Project Id is invalid'});
    return;
  }

  Project
    .findById(projectId)
    .populate('tasks')
    .then(foundProject => {
      console.log(foundProject);
      res.json({message: 'GET project by ID worked', projectId: projectId, foundProject})
    })
    .catch(err => console.log('Error GETting project by ID', err));
});

router.put('/projects/:projectId', (req, res, next) => {
  const { projectId } = req.params;
  const { title, desc } = req.body;

  if(!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({message: 'Project Id is invalid'});
    return;
  }

  Project
    .findByIdAndUpdate(projectId, {title, desc}, {new: true})
    .then(updatedProj => {
      res.status(200).json({message: "Project updated", updatedProj});
    })
    .catch(err => {
      console.log(err);
      res.status(500);
    })

  //res.json({message: 'PUT projects worked', projectId: projectId})
});

router.delete('/projects/:projectId', (req, res, next) => {
  const { projectId } = req.params;

  if(!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({message: 'Project Id is invalid'});
    return;
  }

  Task
    .deleteMany({project: projectId})
    .then(res => {
      console.log('deleted attached tasks', res);
    })
    .catch(err => {
      console.log(err);
    });

  Project
    .findByIdAndDelete(projectId)
    .then(deletedProj => {
      console.log(deletedProj);
      res.status(200).json({message: 'DELETE projects worked', projectId: projectId, deletedProj: deletedProj})
    })

  //res.json({message: 'DELETE projects worked', projectId: projectId})
});
module.exports = router;