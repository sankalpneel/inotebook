const express = require('express')
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'sKSama';
var jwt = require('jsonwebtoken');

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
    
    
        


    

    //res.send(req.body);
})

module.exports = router;