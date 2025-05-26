import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const captainSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, "Firstname must have atleast 3 characters"]
        },
        lastName: {
            type: String,
            required: true,
            minlength: [3, "Lastname must have atleast 3 charaters"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    socketId: String,
    status: {
        type: String,
        enum: ["active", "inactive"]
    },
    vehicle: {
        type: {
            type: String,
            required: true,
            enum: ["car", "bike", "auto"],
            required: true
        },
        color: {
            type: String,
            required: true,
            minlength: [3, "Color must have atleast 3 charaters"]
        },
        numberPlate: {
            type: String,
            required: true,
            minlength: 10
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
            max: 4
        }
    },
    location: {
        lat: Number,
        lng: Number
    },
    token: String,
    isRideActive:{
        default: false,
        enum: [false, true]
    }
}, {timestamps: true});

captainSchema.methods.generateAuthToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h"
        }
    )
}

captainSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}

captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const Captain = mongoose.model("Captain", captainSchema);