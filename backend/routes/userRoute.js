const express = require('express');
const router = express.Router();

const { newUser,getUser } = require('../controller/userController');

router.post('/users', newUser);
router.get('/users/:id', getUser);

module.exports = router;
