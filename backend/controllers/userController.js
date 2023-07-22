const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @description Register USer
//@route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async(req, res)=>{
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already exists");
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt value
    console.log("Hashed Pass:", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log(`User created: ${user}`);
    if(user){
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    }
    else{
        res.status(400);
        throw new Error("Invalid user data");
    }
    res.json({message: "Register the user"});
});

// @description Register Login
//@route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const existingUser = await User.findOne({email});
    //compare the password wirth the hashed password
    if(existingUser && (await bcrypt.compare(password, existingUser.password))){
        // create a token
        const accessToken = jwt.sign({
            user:{
                username: existingUser.username,
                email: existingUser.email,
                _id: existingUser._id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "20m"});
        res.status(200).json({accessToken});
    }
    else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
});


// @description Curren user info
//@route POST /api/users/current
// @access private
const currentUser = asyncHandler(async(req, res)=>{
    res.json(req.user);
});


module.exports={registerUser, loginUser, currentUser};