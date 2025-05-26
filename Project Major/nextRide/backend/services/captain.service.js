import { Captain } from "../models/captain.model"

export const register = async ({fullName, email, password, vehicle}) => {
    const captain = await Captain.create({fullName, email, password, vehicle});
    delete captain.password;
    return captain
}

export const login = async ({email, password}) => {
    const captain = Captain.findOne({email});
    if(!captain){
        throw new Error("Captain not found");
    }
    const isPasswordCorrect = await captain.comparePassword(password);
    if(!isPasswordCorrect){
        throw new Error("Incorrect password");
    }
    if(captain.isRideActive){
        throw new Error("Captain with same account is riding")
    }
    return captain;
}