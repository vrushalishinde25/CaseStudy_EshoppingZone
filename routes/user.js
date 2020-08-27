//user by id. it will look for user id route paramenter and run automatically and make user available ...when singin if want to user dashbiard and want to display basic information it will be easy

const express = require("express");
const router = express.Router();

const {requireSignin, isAdmin, isAuth} = require("../controllers/auth");

const {userById, read, update} = require("../controllers/user");

router.get("/secret/:userId", requireSignin, isAuth ,(req, res) =>{
    res.json({
        user: req.profile
    });
});

//see and update profile
router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);


router.param("userId", userById);

module.exports = router;
//is Auth ney fakt tyach and not sagale required sign in ney sagala
// is admin ney role change karava lagel to 1