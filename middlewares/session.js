
const User = require('../models/userModel')
//---------------After login
const verifyUser=(req,res,next)=>{
    if(req.session.userlogged){
        
        res.locals.user=req.session.user
        next()
    }else{
        res.redirect('/')
    }
}
//---------------Navbar-----------------
const verifyUsernav=(req,res,next)=>{
    if(req.session.userlogged){
        res.locals.user=req.session.user
        next()
    }else{
        res.redirect('/login')
    }
}
//
//before login
const userExist=(req,res,next)=>{
    if(req.session.userlogged){
        res.redirect('/userhome')
    }else{
        next()
    }
}

//admin side

const adminExist=(req,res,next)=>{
    if(req.session.adminlogged){
        res.render('/admin/dashboard')
    }else{
        next()
    }
}

const verifyAdmin=(req,res,next)=>{
    if(req.session.adminlogged){
        next()
    }else{
        res.redirect('/adlogin')
    }
}



module.exports={
    verifyUser,
    verifyUsernav,
    userExist,
    adminExist,
    verifyAdmin

}