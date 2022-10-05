// #/App.js
require('dotenv').config();

const Express = require('express')
const app = Express();
const jsonParser = Express.json;

const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const { isAuth } = require('./middleware/jwt.middleware');

mongoose
  .connect('mongodb://127.0.0.1/projectManagementPractice')
  .then(connectObj => {
    console.log('Connected to db', connectObj.connections[0].name);
  })
  .catch(err => console.log('Error connecting to db', err));

app.use(jsonParser());
app.use(morgan('dev'));
app.use(cors({origin:['http://localhost:3000']}));

app.get('/', (req, res, next) => {
  res.send('howdy');
});

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const projectRoutes = require('./routes/project.routes');
app.use('/api', isAuth, projectRoutes);

const taskRoutes = require('./routes/tasks.routes');
app.use('/api', isAuth, taskRoutes);

app.listen(5173, () => {
  console.log("We're live on port 5173!");
})