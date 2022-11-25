const express = require('express')
const mongoose = require("mongoose");
const { rawListeners } = require('./model/user');
const bcrypt = require('bcrypt');
const user = require('./model/user')
const ejs = require('ejs');
const path = require('path');
const fs = require("fs");
const { Console } = require('console');
const { application } = require('express');
const app = express()
const port = 3000
app.use(express.json());
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:false}));

//MongoDB connection
mongoose.connect('mongodb://localhost:27017/User',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(function(result){
    console.log("MongoDB connected");
  }).catch(function(err){
    console.log(err);
  })

  //Register
app.post('/register',async(req,res)=>{
  try{
    const isEmail =await user.findOne({email: req.body.email});
    if(isEmail){
       res.status(400).json("User already register");
    }else{
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
    const User = new user({
      Username: req.body.Username,
      email: req.body.email,
      password: hash,
      Avatar:req.body.Avatar
    })
    const userData = await User.save();
    res.send("Thanks for registering")
    // res.status(201).json(userData);
    //  console.log(req.body.Username);
    // res.send(req.body.Username);
  }
  }catch(err){
    res.status(500).json(err)
  }
})

//register ejs
app.get('/signup', function (req, res) {
  res.render('SignUp.ejs', {
    title: 'Please SignUp'
  })
})

// Login ejs
app.get('/signin', function (req, res) {
  res.render('Signin.ejs', {
    title: 'Please Login'
  })
})

//Login
app.post('/login',async(req,res)=>{
  try{
    // console.log(req.body.email);
    const Isemail =await user.findOne({email: req.body.email});
    if(Isemail){
     let Ismatch =  await bcrypt.compare(req.body.password, Isemail.password);
     if(Ismatch){
      Isemail.password = "";
      // res.status(200).json({msg:"Login successfully",data:Isemail });
      res.send("Login successfully");
     }else{
      res.status(400).json("Invalid Password");
     }
    }else{
      res.status(404).json("User not found");
    }
  }catch(err){
    res.status(500).json(err)

  }
})

//List
app.get('/getAllUser',async(req,res)=>{
  try{
    let allUser = await user.find({});
    // res.status(200).json(allUser)
    res.render('List.ejs', {
      title: 'All Users',
      data:allUser
    })
  }catch(err){
    res.status(500).json(err)
  }
})

//Delete User
app.get('/delete/:id', async(req,res)=>{
  try{
    let toDelete = await user.findByIdAndDelete({_id:req.params.id});
    res.redirect('/getAllUser');
    res.status(200).json("Deleted successfully");
  }catch(err){
    res.status(500).json(err)
  }
})

//Update ejs
app.get('/edit/:id', async(req, res) =>{
  try{
    let toEdit = await user.findById({_id:req.params.id});
    // console.log(toEdit)
    res.render('edit.ejs',{
      data:toEdit
    });
  }catch(err){
    res.status(500).json(err)
  }
  
})
//Update User
app.post('/edit/:id',async(req,res)=>{
    try{
      // console.log(req.params.id)
      // console.log(req.body);
      let toUpdate = await user.findByIdAndUpdate({_id:req.params.id},{$set:req.body}, {$new:true});
      res.status(200).json("Your Profile has been updated successfully");
    }catch(err){
      res.status(500).json(err);
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})