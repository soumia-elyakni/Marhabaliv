const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = "MyKeyIsHim";
const ls =require('local-storage')


const signup = async(req, res) => {
    const {body}=req
    const email= await User.findOne({email: body.email})
    if(email) return res.status(400).send('user exist already')
    const hash= await bcrypt.hash(body.password,10)
    body.password= hash
    const create = User.create({...body})
    if(!create) return res.status(400).send('not created')
    return res.status(201).json({...create})
};

const login = async(req, res) =>{
    const {body} = req 
    const currentUser= await User.findOne({email: body.email})
    if(!currentUser) return res.status(400).json({message:'user\'s email not exesting. You need to signup first'})
    const pass = await bcrypt.compare(body.password, currentUser.password)
    if(!pass) return res.status(400).json({message: 'Wrong password'})
    const token = jwt.sign({user : currentUser}, JWT_SECRET_KEY )
    // res.cookie()
    

    return res.status(200).json({message : 'logged in successfuly', user:currentUser, token})
    // return res.status(200).json({...body})
};

const verifyToken = (req, res, next) => {
    const headers = req.headers['authorization'];
    const token = headers.split(" ")[1];
    if(!token){
        res.status(404).json({message :"No token Found"})
    }
    jwt.verify(String(token), JWT_SECRET_KEY, (err, user)=> {
        if (err) {return res.status(400).json({message:"Invalid Token"})} 
        req.id = user.id
    })
    next();
};

const getUser = async(req, res, next) => {
    const id = req.id;
    let user;
    try {
        user = await User.findById(id);
    } catch(err){ return new Error(err)}
    if(!user){ 
        return res.status(404).json({message : "user not found"})
    } else {
        return res.status(200).json({user})
    }
}

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;