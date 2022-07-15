// server/routes/route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
 
router.post('/signup', userController.signup);

router.post('/saveData', userController.saveData)
 
router.post('/login', userController.login);
 
router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);
 
router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);
 
router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);
 
router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.get('/welcome', userController.welcomeMessage);
 
module.exports = router;

