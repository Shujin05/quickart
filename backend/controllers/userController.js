import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// Login function 
const loginUser = async (req, res) => {
    const {email,password} = req.body; 
    try {
        const user = await userModel.findOne({email}); 

        if (!user) {
            return res.json({success:false, message:"User doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password); 

        if (!isMatch) {
            return res.json({success:false, message:"Invalid credentials"})
        }

        const token = createToken(user._id); 
        res.json({success:true, token})
    } catch (error) {
        console.log(error); 
        res.json({success: false, message: error})
    }
}

// create token 
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// register user
const registerUser = async (req, res) => {
    const {name, password, email} = req.body; 
    try {
        // check if account already exists
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.json({success:false, message:"Account already exists"})
        }

        // validate email and password 
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter a valid email"})
        }

        if (password.length < 8 ) {
            return res.json({success:false, message:"Password length should be greater than 8"})
        }

        // hash user password 
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt)

        // save user to database 
        const newUser = new userModel({
            name: name, 
            email: email, 
            password: hashedPassword, 
        })

        const user = await newUser.save()

        // create token 
        const token = createToken(user._id)
        res.json({success:true, token})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {loginUser, registerUser}; 