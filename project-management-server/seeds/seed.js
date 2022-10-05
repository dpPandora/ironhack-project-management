const mongoose = require('mongoose');

const Project = require('../models/Project.model');
const Task = require("../models/Task.model");
const User = require('../models/User.model');

mongoose
  .connect('mongodb://127.0.0.1/projectManagementPractice')
  .then(connectObj => {
    console.log('Connected to db', connectObj.connections[0].name);

    return Project.create({
      title: 'Test project',
      desc: 'Hopefully this works!'
    })
  })
  .then(createdProj => {
    console.log(createdProj);

    return Task.create({
      title: 'Test task',
      desc: 'Babababa idk',
      project: createdProj._id
    });
  })
  .then(createdTask => {
    console.log(createdTask);

    return User.create({
      username: "m1n3craftSt3v3",
      password: "diamonds1234",
    });
  })
  .then(createdUser => {
    console.log(createdUser);

    return mongoose.connection.close();
  })
  .then(() => {
    console.log('Connection closed :3');
  })
  .catch(err => console.log('Error connecting to db', err));

/* 
mongoose.connection
  .close()
  .then(console.log('Connection closed'))
  .catch(err => console.log('Error closing connection', err))
 */