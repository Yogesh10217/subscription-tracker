import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

//what is a req body?-> req.body is an object containing data from the client(POST request) to the server

export const signUp = async (req, res, next) => {
  //Impliment sign up logic here
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //logic to create new user
    const { name, email, password } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 409;
      throw error;
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserArr = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );
    //generate JWT token
    const newUser = newUserArr[0];

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { userId: newUser._id, email: newUser.email, token }
    });


  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


export const signIn = async (req, res, next) => {
  try{
    const {email,password}=req.body;
    //check if user exists
    const user=await User.findOne({email});
    if(!user){
      const error=new Error('User Not Found');
      error.statusCode=404;
      throw error;
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
      const error=new Error('Invalid Credentials');
      error.statusCode=401;
      throw error;
    }
    const token=jwt.sign(
      {userId:user._id},
      JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

    res.status(200).json({
      success:true,
      message:'User signed in successfully',
      data:{
        token,
        user,
      }
    });
  }catch(error){
    next(error);
  }

};

export const signOut = async (req, res, next) => { };


