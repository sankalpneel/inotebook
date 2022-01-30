const express = require('express')
const router = express.Router();

router.get("/",(req,res)=>{
    obj={
        a:"Notes",
        number:54
    }
    console.log(req.body);
    res.json(obj);
    
})

module.exports = router;