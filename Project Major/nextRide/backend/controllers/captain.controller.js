import {validationResult} from "express-validator";
import {Captain} from "../models/captain.model.js";
import captainService from "../services/captain.service.js"
import { BlackListedToken } from "../models/blackListedToken.model.js";

export const registerCaptain = async function(req, res, next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array(), message: "All parameters are required"});
    }
    try {
        const {fullName, email, password, vehicle} = req.body;
        const oldCaptain = await Captain.findOne({email});
        if(oldCaptain){
            throw new Error("Captain already exist")
        }
        const hashedPassword = await Captain.hashPassword(password);
        const captain = await captainService.register({fullName, email, password:hashedPassword, vehicle});
        const token = await captain.generateAuthToken();
        captain.token = token;
        await captain.save();
        res.status(200).cookie("token", token).json({captain, token})
    } catch (error) {
        
    }
}

export const loginCaptain = async function (req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({message: "All parameters are required", errors: errors.array()});
    }
    try {
        const {email, password} = req.body;
        const captain = await captainService.login({email, password});
        const token = await captain.generateAuthToken();
        captain.token = token; // logout another user
        await captain.save();
        res.status(200).cookie("token", token).json({captain, token});
    } catch (error) {
        res.status(400).json({message: error.message || "Something went wrong"})
    }
}

export const updateCaptain = async function (req, res, next){
    const errors = validationResult(req);
    if(errors.length){
        return res.status(400).json({message: "All parameters are required", errors: errors.array()})
    }
    try {
        const {_id} = req.user;
        const {email, fullName} = req.body;
        const updatedCaptain = await captainService.update({email, fullName, captainId: _id});
        return res.status(200).json({message: "Captain updated successfully", captain: updatedCaptain})
    } catch (error) {
        res.status(400).json({message: error.message || "Something went wrong"})
    }
}

export const getCaptain = async function (req, res, next) {
    return res.status(200).json({message: "Captain details fetched successfully", captain: req.user});
}

export const logoutCaptain = async function(req, res, next){
    // const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    // await BlackListedToken.create({token});
    const {_id} = req.captain;
    await Captain.findByIdAndUpdate(_id, {token: ""});
    res.status(400).clearCookie("token").json({message: "Logout successfully"})
}