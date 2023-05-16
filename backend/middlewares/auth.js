// created after logout controller 
//to use auth 
//for protected pages
const User = require("../models/user");
const UserDTO = require("../dto/user");

const auth = async (req, res, next) => {
    try {
        //1. validate refresh, access token validation
        // const {refreshToken, accessToken} = req.cookies;

        let user;
        try {
            //he used _id that he got using refresh token
            //in my case I'll need to implement the logic that wise
            user = await User.findOne({_id: User._id });
        } 
        catch (error) {
            return next("error");
        }

        const userDto = new UserDTO(user);

        req.user = userDto;

        next();
    } catch (error) {
        return next(error);
    }
   
}

module.exports = auth;