const mongoose=require('mongoose');

const ChatSchema=mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'//refference taken from user
    },
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'//refference taken from user
    },
    picture:{
        // type:mongoose.Schema.Types.ObjectId,
        // ref:'User'
        type:String,
        default:'0'

    },
    message:
    {
        type:String,
        // required:true
        default:'0'
    }
},
{timestamps:true}
);
module.exports=mongoose.model('Chat',ChatSchema);