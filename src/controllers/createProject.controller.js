const createProjectModel = require("../models/createProject.model");

async function createProject(req, res) {
  try {
    const {
      projectName,
      Description,
      Budget,
      ProjectType,
      Location,
      StartDate,
      ProjectDuration,
      DurationUnit,
    } = req.body;

    const project = await createProjectModel.create({
      projectName,
      Description,
      Budget,
      ProjectType,
      Location,
      StartDate,
      ProjectDuration,
      DurationUnit,
    });

    res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = { createProject };