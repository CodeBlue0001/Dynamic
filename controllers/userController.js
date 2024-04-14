// const { response } = require("../routes/userRoute");
const User = require('../models/userModel');
const bcrypt =require('bcrypt');
const Chat=require('../models/ChatModel');

const registerLoad=async(req , res)=>{

    try {
        res.render('register')
        
    } catch (error) {
        console.log(error.message);
        
    }
}
const register =async(req,res)=>{

    try{
        const passwordHash =await bcrypt.hash(req.body.password,10);
        //takeing data and adding data in database
       const user = new User({
            name: req.body.name,
            email:req.body.email,
            number:req.body.number,
            image:'images/'+req.file.filename,
            // is_image:'1',
            password:passwordHash
        });

        await user.save();

        res.render('register',{message:'Ragistration complete'});
    } catch(error) {
        console.log(error.message);
    }

}

const loadLogin=async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
        
    }
};
const login=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        const userData= await User.findOne({email:email});
        if(userData){
            const passwordMatch=await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                req.session.user=userData;
                res.redirect('/dashboard');
            }
            else{
                res.render('login',{message:'password is incorrect'});
            }
        }
        else{
            res.render('login',{message:'Email and password is incorrect'});
        }

    } catch (error) {
        console.log(error.message);
        
    }
}
const logout=async(req,res)=>{
    try {

        req.session.destroy();
        res.redirect('/');
        
    } catch (error) {
        console.log(error.message);
        
    }
}
const loadDashboard=async(req,res)=>{
    try {
        var users= await User.find({_id:{ $nin:[req.session.user._id]}});
        res.render('dashboard',{user:req.session.user, users:users});
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const saveChat= async(req,res)=>{
    try {
        
       var chat=  new Chat({
            sender_id:req.body.sender_id,
            receiver_id:req.body.receiver_id,
            // picture:'photos/'+req.file.filename,
            message:req.body.message
        });

        var newChat=await chat.save();
        res.status(200).send({success:true,msg:'chat inserted',data:newChat});

    } catch (error) {
        
        res.status(400).send({success:false,msg:error.msg});
    }
}
//save pictures
const savePics= async(req,res)=>{
    try {
        
       var chat=  new Chat({
            sender_id:req.body.sender_id,
            receiver_id:req.body.receiver_id,
            picture:'photos/'+req.file.filename,
            // message:req.body.message
        });

        var newChat=await chat.save();
        res.status(200).send({success:true,msg:'chat inserted',data:newChat});

    } catch (error) {
        
        res.status(400).send({success:false,msg:error.msg});
    }
}
// load profile
const loadprofile=async (req,res)=>{
    try {
       
        res.render('profile',{user:req.session.user});

    } catch (error) {
       console.log(error.message);
        
    }
}
const updateLoad=async(req , res)=>{

    try {
        res.render('updateprofile')
        
    } catch (error) {
        console.log(error.message);
        
    }
}
const update=async(req,res)=>{
    try{
    var newChat=await chat.save();
    res.status(200).send({success:true,msg:'chat inserted',data:newChat});

    await admin.save();
  }
  catch(error)
  {
    console.log(error.msg)
  }
  

  }
  const deleteChat =async(req,res)=>{
    try {
        await Chat.deleteOne({_id:req.body.id});
        res.status(200).send({success:true});

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
        
    }

  }
  const updateChat=async(req,res)=>{
    try{
      await  Chat.findByIdAndUpdate({_id:req.body.id},{
         $set:{
            message:req.body.message
         }
        });
        res.status(100).send({success:true});
    }catch(error){
        res.status(410).send({success:false,msg:error.message});
    }
  }
module.exports={

    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboard,
    saveChat,
    savePics,
    loadprofile,
    // updateLoad,
    deleteChat,
    // update,
    updateChat
}