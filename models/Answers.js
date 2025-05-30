import mongoose from "mongoose";

const Schema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    formId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt:{
        type: Number
    },
    updatedAt:{
        type: Number
    }
},
{
    timestamps: { 
        currentTime: () => Math.floor(Date.now() / 1000) 
    },
 strict: false 
})

export default mongoose.model('Answer', Schema);