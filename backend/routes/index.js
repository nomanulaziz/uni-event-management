const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const eventController = require("../controller/eventController");
//for logout auth middleware usage
const auth = require("../middlewares/auth");

//testing
router.get('/test',(req,res) => res.json({msg: 'Working:'}));

//==============================
//      Auth End Points
//==============================
//register
router.post('/register', authController.register);

//login
router.post('/login', authController.login);


//logout
//parameters -> request, middleware, controller
//middleware will check if the user is authenticated\
//e.g his tokens (I don't used tokens....)
router.post('/logout', authController.logout);

//refresh
router.get('/refresh', authController.refresh);

//==============================
//      Event end points
//==============================

//crud

//create
router.post('/event', eventController.create); // --- Removed auth
//read all events
router.get('/event/all', eventController.getAll); // --- Removed auth
//read event by id
router.get('/event/:id', eventController.getById) // --- Removed auth
//update
router.put('/event', eventController.update); // --- Removed auth
//delete
router.delete('/event/:id', eventController.delete); // --- Removed auth

module.exports = router