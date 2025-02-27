import mongoose from "mongoose"

const Schema = new mongoose.Schema({
    fullname: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true,
    },
    password: {
        type: 'string',
        required: true
    },
    status: {
        type: 'string',
        enum: ['active', 'inactive'],
        default: 'active',
        required: true
    },
    createdAt: {
        type: Number
    },
    updatedAt: {
        type: Number
    }    
},
{
    timestamps: {
        currentTime: () => Math.floor(Date.now() / 1000)
    }
})

export default mongoose.model('User', Schema)