require('dotenv').config();

var mongoose=require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/dynamic-chat-App');

const app=require('express')();

const http=require('http').Server(app);

const userRoute=require('./routes/userRoute');

var User=require('./models/userModel');

const Chat=require('./models/ChatModel')

app.use('/',userRoute)

const io = require('socket.io')(http);

var uns=io.of('/user-namespace');

uns.on('connection',async function(socket){
    console.log('user Connected');

    //showing online or not
    var userId=socket.handshake.auth.token;
      
    await User.findByIdAndUpdate({_id:userId},{$set:{is_online:'1'}});

// console.log(socket)

        socket.broadcast.emit('getOnlineUser',{user_id:userId});

    socket.on('disconnect',async function(){
        console.log('user disconected');

        await User.findByIdAndUpdate({_id:userId},{$set:{ is_online:'0'}});


            socket.broadcast.emit('getOfflineUser',{user_id:userId});
    
    });
    socket.on('newChat',function(data){
        socket.broadcast.emit('loadNewChat',data);
    });
    // socket.on('updatePic',function(data){
    //     // console.log(data)
    //     // console.log(data.name)
    //      User.findByIdAndUpdate({_id:userId},{$set:{image:data.name}})
    //     socket.broadcast.emit('updateProfile',data);

    // });
    // socket.on('newPic',function(data){
    //     socket.broadcast.emit('loadNewPic',data)
    // })

    //   load reciver id
socket.on('reciverProfile',async function(data){
    // var receiver_id=socket.handshake.auth.token;
    var receiver =await User.findOne({_id:data.receiver_id});
    socket.emit('profile',{receiver:receiver});
  
  });
    //load old chats
    socket.on('existschats',async function(data){
        var chats =await Chat.find({$or:[
            {
                sender_id:data.sender_id,receiver_id:data.receiver_id
            },
            {
                sender_id:data.receiver_id,receiver_id:data.sender_id
            }
        ]});

        var receiver =await User.findOne({_id:data.receiver_id});
        socket.emit('profile',{receiver:receiver});

        socket.emit('loadChats',{chats:chats});
        // socket.emit('loadpicture',{chats:chats});

    });
    //  delete chat
    socket.on('chatDelete',function(id){
        socket.broadcast.emit('chatMessageDeleted',id);
    })

  
});






http.listen(3300,function(){
    console.log(`server is running..`);
});