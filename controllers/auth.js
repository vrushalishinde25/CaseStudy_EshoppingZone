const User = require("../models/user");
const jwt = require('jsonwebtoken');//to generate signed token
const expressJwt = require('express-jwt');//used for auth check

exports.signup = (req, res) =>{
    console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err
            });
        }
        res.json({
            user
        });
    });
};

exports.signin = (req,res) => {
    //find user based on email
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                err : "user with this email not exist please signup"
            });
        }
        //if user is found make sure email and password is matched
        //create authenticate method in user model
        if(!user.authenticate(password)){
            return res.status(401).json({//unauthoried
                error: "email and password dont match"
            });
        }
        //generate a signed token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)//user got from database
        //persist the token as 't' in cookie with expiry
        res.cookie('t', token, {expire: new Date() + 9999})//now to 9999sec
        //return response with user and token to frontend client
        const {_id, name, email, role} = user//destructuring not everytime user.
        return res.json({token, user: {_id, email, name, role}})
    
    });
};

//To signout clear the cookie
exports.signout = (req, res) =>{
    res.clearCookie('t')
    res.json({
        message: "Signed out successfully"
    });
};

//protecting route miidleware
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
});

exports.isAuth = (req, res, next) =>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id
        if(!user){
            return res.status(403).json({
                error: "Access Denied"
            });
        }
    next();
};

exports.isAdmin = (req, res, next) =>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "Admin resource!!!access denied"
        });
    }
    next();
};



