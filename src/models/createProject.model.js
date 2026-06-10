const mongoose = require ("mongoose");

const createProjectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },

  Description:{
   type: String,
    required: true,
  },

  Budget:{
    type: Number,
    required: true,
  },

  ProjectType: {
    type: String,
    enum: ["Residential","Commercial","Industrial","Infrastructure","Renovation","Interior Design"],
    required: true,
  },

  Location: {
    type : String,
    required : true,
  },

  StartDate: {
    type : Date,
    required : true,
  },

  ProjectDuration: {
    type : Number,
    required : true,
  },

  DurationUnit: {
    type : String,
    enum : ["Days","Months","Years"],
    required : true,
  }
})

const createProjectModel = mongoose.model('CreateProject',createProjectSchema);

module.exports = createProjectModel;