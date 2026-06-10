const userModel = require ("../models/user.model");
const jwt = require ("jsonwebtoken");
const bcrypt = require ("bcryptjs");

async function registerUser (req, res) {
  try { 
  const { name,email,password,phone,role,location } = req.body;

  const isUserAlreadyExists = await userModel.findOne ({
    $or: [
      { phone },
      { email },
    ]
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "user already exists",
    });
  };

  const hash = await bcrypt.hash(password,10);

  const user = await userModel.create ({
    name,
    email,
    phone,
    password: hash,
    role,
    location,
  });

  const token = jwt.sign({
    id: user._id,
    email: user.email,
    role: user.role,
  },
 process.env.JWT_SECRET,
);
res.cookie("token",token)
res.status(201).json({
  message: "User Registered Successfully.",
  user:{
    id: user._id,
    email: user.email,
    role: user.role,
  }
})
} catch (err) {

   console.log(err);
   return res.status(500).json ({
    message: err.message,
   });

};
};

async function loginUser (req, res) {

  try{

  const {email, phone, password} = req.body;

  const user = await userModel.findOne({
    $or: [
      { phone },
      { email },
    ]
  });
  if(!user){
    return res.status(401).json({ message: "user not found" });
  }
  
  const isPasswordValid = await bcrypt.compare (password, user.password);

  if(!isPasswordValid){
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({
    id: user._id,
    email: user.email,
    role: user.role,
  }, process.env.JWT_SECRET);

  res.cookie("token",token);

   return res.status(200).json({
    message: "User logged in successfully",
    user:{
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });

  } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Unauthorized" });
  }  
};

async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
}

module.exports = { registerUser, loginUser, logoutUser };