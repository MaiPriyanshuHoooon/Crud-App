const express = require('express');
const router = express.Router();
const { UserModel } = require('./model/user.model');
const mongoose = require('mongoose');
const { TaskModel } = require('./model/task.model');

// User Registration Route
router.route('/register').post( async(req, res) => {
    try {
        // console.log('Request Body:', req.body);

        if(!req.body){
            throw new Error('Enter valid data');
        }

        const {name, email, password} = req.body;

        if(!name || !email || !password){
            throw new Error('All fields are required');
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const user = await UserModel.create({
            name,
            email,
            password,
        });

        res.status(201).send({ message: 'User registered successfully', token: user._id });

    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// User login Route
router.route('/login').post( async(req, res) => {
    try {

        if(!req.body){
            throw new Error('Enter valid data');
        }

        const {email, password} = req.body;

        if(!email || !password){
            throw new Error('All fields are required');
        }

        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            throw new Error('User not found');
        }

        if(existingUser.password !== password){
            throw new Error('Enter valid password');
        }

        res.status(201).send({ message: 'User logged in  successfully', token: existingUser._id });

    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Middleware to authenticate user

router.use((req, res, next) => {
    try {
        const token = req.headers['user'];
        if(!token){
            throw new Error('Login first to access profile');
        }
        if(!mongoose.isValidObjectId(token)){
            throw new Error('Enter valid ID');
        }
        req.user = token;
        return next();

    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
});

// Profile route
router.route('/profile').get( async(req, res) => {
    try {

        const existingUser = await UserModel.findById(req.user).select('-password');

        return res.status(200).send({existingUser });

    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// router.route('/login').post((req, res) => {
//   console.log('Request Body:', req.body);
//   res.send({ message: 'Login successful' });
// });

router.route('/add-task').post(async(req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      throw new Error('All fields are required');
    }

    await TaskModel.create({
      title,
      description,
      category,
      user: req.user,
    });
    return res.status(200).send({ message: 'Task added successfully' });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.route('/all-task').get( async(req, res) => {
  try {
    const all_tasks = await TaskModel.find({ user: req.user })
    res.status(200).send(all_tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.route('/task/:id').get( async(req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id);
    // if (!task) {
    //   throw new Error('Task not found');
    // }
    res.status(200).send(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})
.put( async(req, res) => {
  try {
    const id = req.params.id;
    if(!mongoose.isValidObjectId(id)){
      throw new Error('Enter valid ID');
    }

    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      throw new Error('All fields are required');
    }

    await TaskModel.findByIdAndUpdate(id, {
      title,
      description,
      category,
    });

    return res.status(200).send({ message: 'Task updated successfully' });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})
.delete( async(req, res) => {
  try {
    const task = await TaskModel.findByIdAndDelete(req.params.id);
    if(!task){
        throw new Error('Task not found');
    }
    res.status(200).send({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;