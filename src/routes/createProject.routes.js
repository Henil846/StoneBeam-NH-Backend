const express = require("express");
const createProjectController = require("../controllers/createProject.controller");
const router = express.Router();

router.post("/createProject", createProjectController.createProject);

module.exports = router;