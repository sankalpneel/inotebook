const express = require('express')
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'sKSama';
var jwt = require('jsonwebtoken');



//Registering a User using : "/api/auth/createuser" . No Login Required
router.post("/createuser",[
    body('name',"Enter a Valid Name").isLength({ min: 3 }),
    body('email',"Enter a Valid Email").isEmail(),
    body('password',"Minimum Password Length: 5").isLength({ min: 5 })
], async (req,res)=>{

    //checking if any errors and sending response for the same
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    try{

        //checking if user Already exists
        let fUser= await User.findOne({ email: req.body.email});
        if(fUser){
        return res.status(400).json({ error: "User Already Exsist"});
        }


        //Hashing Password
        const salt = await bcrypt.genSalt(10);
        var safPass = await bcrypt.hash(req.body.password,salt);

        
        //Save User in DB
        let user = await User.create( {
            name : req.body.name,
            password: safPass,
            email: req.body.email
        });
        console.log("Registered");
        
        const data = {
            user:{
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        
        res.json({authToken});
    }
    catch (error) {
        console.log(error.messages);
        res.status(500).send("Some Error Occured");
    }

  
})

//Authenticate a User using : "/api/auth/login" . No Login Required
router.post('/login',[
    body('email',"Enter a Valid Email").isEmail(),
    body('password',"Password Can not be blank").exists()
], async (req,res)=>{

    //checking if any errors and sending response for the same
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password}=req.body;

    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please Enter Correct Credentials"});
        }

        const passwordCompare = await bcrypt.compare(password,user.password);

        if(!passwordCompare){
            return res.status(400).json({error: "Please Enter Correct Credentials"});
        }

        const data = {
            user:{
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        console.log("Login Success")
        res.json({authToken});

    }
    catch (error) {
        console.log(error.messages);
        res.status(500).send("Internal Server  Occured");
    }

})

module.exports = router;