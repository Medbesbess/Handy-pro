const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/ControllerAdmin/serviceController');

router.get('/', serviceController.getAllServices);


module.exports = router;