

const Admin=require('../models/adminModel')

module.exports={
    getadminlog:async (req,res)=>{
        
        res.render('Admin/Adlogin')
    },
    postadminlog: async (req,res)=>{
        try{
            console.log('-----------------------------------------------------------------------');
            const data= await Admin.findOne({email:req.body.email})
            
            if(data){
                if(data.password===req.body.password){
                    req.session.adminlogged=true
                    // console.log(req.session.adminlogged);
                    req.session.adminname=data.name
                    res.redirect("/Admin/dashboard");
                }else{
                    res.render('Admin/Adlogin',({err:"Incorect password or email "}))
                }
            }else{
                res.render('Admin/Adlogin',({err:"Incorect pasword or email"}))
            }
        }catch(err){
            console.log(err);
        }
    },
    addlogout:async (req,res)=>{
        try{
            req.session.adminlogged=false
            res.render('admin/adlogin')
        }catch(err){
            console.log("adminlogout",err);
        }
    }
}