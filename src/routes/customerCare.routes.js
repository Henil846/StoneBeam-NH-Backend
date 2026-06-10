const express = require('express');
const router = express.Router();
const  { customerCare }  = require('../controllers/customerCare.controller');

router.post('/customerCare', customerCare);

module.exports = router;