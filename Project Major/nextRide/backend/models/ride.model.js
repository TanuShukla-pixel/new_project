import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    captain: {
        type: mongoose.Types.ObjectId,
        ref: "Captain",
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true,
    },
    fare: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending","accepted", "ongoing", "completed", "cancelled"]
    },
    duration: Number, //Seconds
    distance: Number, //Meters
    payementId: String,
    OrderId: String,
    Signature: String,
    otp: {
        type: String,
        required: true,
        select: false
    }
});

export const Ride = new mongoose.model("Ride", rideSchema);