const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    
    email:{
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone:{
      type: String,
      unique: true,
      match: /^[0-9]{10}$/,
    },
    password:{
      type: String,
      required: true,
      minlength: 8,
      match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    },
    role:{
      type: String,
      enum: ["Client","Builder","Labourer","Skilled-Labourer","Dealer","Contractor"],
      required: true,
    },
    location:{
      type: String,
      required: true,
    },
});



const userModel = mongoose.model('User', userSchema);

module.exports = userModel;