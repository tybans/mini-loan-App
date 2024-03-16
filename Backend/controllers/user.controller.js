
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register (req, res) {

  console.log('SignUp data', req.body );
  try {
    const {name, email, password, isAdmin} = req.body;
    console.log('sign up data: ', req.body);

    if(!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid Name, Email and Password..."
      });
    }

    if(password.length < 8){
      return res.status(400).json({
        success: false,
        message: "Your password must 8 characters long..."
      });
    }

    const user = await userModel.findOne({email, isAdmin});

    if(user){
      return res.status(400).json({
        success: false,
        message: "User already exists..."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await userModel.create({
      email, 
      name,
      password: hashedPassword,
      isAdmin
    });
    return res.status(201).json({
      success: true,
      message: "SignUp Successful..."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server error: ${error}`
    });
  }
};


async function login (req, res) {
  console.log('login data: ', req.body);
  try {
    const {email, password, isAdmin, } = req.body;
    
    if(!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid Email and Password..."
      });
    }

    const user = await userModel.findOne({
      email,
      isAdmin
    });

    if(!user){
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password..."
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(isPasswordValid){
      const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET);

      return res.status(200).json({
        success: true,
        message: "User successfully logged in...",
        token,
        user: user,
      });
    }
    else{
      return res.status(401).json({
        success: false,
        message:"Invalid Email or Password..."
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      succss: false,
      message : "Internal server error"
    });
  }
};


module.exports = {register, login}