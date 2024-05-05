const express=require('express');
const user_route=express();

const bodyParser=require('body-parser');

const session=require('express-session');
const {SESSION_SECRET} =process.env;
user_route.use(session({secret:SESSION_SECRET}));

user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({extended:true}));


user_route.set('view engine','ejs');
user_route.set('views','./views');


user_route.use(express.static('public'));//public is the static folder for interface

const path =require('path');
const multer=require ('multer');

//storage alocation 
 //Returns a StorageEngine implementation configured to store files on the local file system
const storage=multer.diskStorage({    
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'));

    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name);
    }

});
const auth=require('../middlewar/auth');


const upload=multer({storage:storage}); 

const userController =require('../controllers/userController');

user_route.get('/register',auth.islogout,userController.registerLoad);

user_route.post('/register',upload.single('image'),userController.register);

user_route.get('/',auth.islogout,userController.loadLogin);
user_route.post('/',userController.login);
user_route.get('/logout',auth.islogin,userController.logout);
user_route.get('/dashboard',auth.islogin,userController.loadDashboard);

//load profile

user_route.get('/profile',auth.islogin,userController.loadprofile);
user_route.post('/profile',upload.single('image'),userController.loadprofile);

// user_route.get('/updateprofile',auth.islogin,userController.updateLoad);

// user_route.post('/updateprofile',upload.single('image'),userController.update);


user_route.post('/save-chat',userController.saveChat)
user_route.post('/delete-chat',userController.deleteChat)
user_route.post('/update-chat',userController.updateChat)
user_route.post('/save-pics',userController.savePics)

user_route.get('*',function(req,res){
    res.redirect('/');
});
module.exports=user_route;
