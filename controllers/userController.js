const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// SIGN UP
exports.createUser = async(req, res)=>{
    try{
        const existingUser = await User.findOne({email: req.body.email});
        if(existingUser)
        {
            return res.status(404).json({message:'User already exists'});
        }
        const hashedPassword= await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({message:'New user added', user:newUser});
    }
    catch(err){
        res.status(500).json({
            message: 'Invalid authentication credentials'
        });
    }
}

// LOGIN
exports.login = async(req, res)=>{

    try{
        const user = await User.findOne({email: req.body.email});
        if(!user)
        {
            return res.status(401).json({message:'Auth failed: Not a existing user'});
        }

        // if user -> check password
        const matched = await bcrypt.compare(req.body.password, user.password);
        if(!matched)
        {
            return res.status(401).json({message:'Auth failed: Incorrect password'})
        }

        // if valid -> generate jwt
        // jwt.sign(payload, secretkey, options_to_configure_token)
        const token = jwt.sign(
            {email: user.email, userId: user._id}, 
            process.env.secretKey,
            {expiresIn:'1h'}
        );

        res.status(200).json({message:'User logged in successfuly', token:token, expiresIn:'3600', userId:user._id}); //seconds
    }
    catch(err){
        res.status(500).json({message:'Invalid authentication credentials'})
    }
}
