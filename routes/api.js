const auth = require('../config/passport')();
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const projectsController = require('../controllers/projectsController');

// auth
router.post('/auth/registration', authController.signUp);
router.post('/auth/sign_in', authController.signIn);
router.get('/auth/validate_token', auth.authenticate(), authController.validateToken);

// projects
router.post('/projects', auth.authenticate(), projectsController.createProject);
router.get('/projects', auth.authenticate(), projectsController.getProjects);
router.put('/projects/:projectId', auth.authenticate(), projectsController.updateProject);
router.delete('/projects/:projectId', auth.authenticate(), projectsController.deleteProject);

// tasks
router.post('/projects/:projectId/tasks', auth.authenticate(), tasksController.createTask);
router.get('/projects/:projectId/tasks', auth.authenticate(), tasksController.getTasks);
router.put('/projects/:projectId/tasks/:taskId', auth.authenticate(), tasksController.updateTask);
router.delete('/projects/:projectId/tasks/:taskId', auth.authenticate(), tasksController.deleteTask);

module.exports = router;
