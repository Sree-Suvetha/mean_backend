const express = require('express');
const router  = express.Router();

const userController = require('../controllers/userController'); 

// sign up
router.post("/signup", userController.createUser);

// login
router.post("/login", userController.login);

module.exports = router;