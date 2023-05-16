// all routes business logic

//library for data validation
const Joi = require("joi");
const User = require("../models/user");
//library for hashing passwords
const bcrypt = require("bcryptjs");
const UserDto = require("../dto/user");


//password pattern
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
    //==============================================================
    //=========================== Register =========================
    //==============================================================
    async register(req, res, next) {
        //1. validate user input(email, password)
        const userRegisterSchema = Joi.object({
            name: Joi.string().max(30).required(),
            username: Joi.string().min(5).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password')
        });

        const {error} = userRegisterSchema.validate(req.body);

        //2. if error in validation -> return error via middleware
        if(error){
            //calls next middleware we have only one in server.js 
            //so it will call it and error will be thrown
            return next(error);
        }

        //3. if email or username is already registered -> error return (not available)
        const {name, username, email, password} = req.body;

        //check if email is already not registered
        try {
            const emailInUse = await User.exists({email});
            const usernameInUse = await User.exists({username});

            if(emailInUse){
                const error = {
                    status : 409,
                    message: 'Email already registered, use another email:'
                }
                return next(error);
            }
            if(usernameInUse){
                const error = {
                    status : 409,
                    message: 'Username not available, use another username:'
                }
                return next(error);
            }
        } 
        catch (error) {
            return next(error);
        }
 
        //4. password hash if no error
        // 123abc -> to random string oqjdiocwciuwucbuiwb
        //non-reversible
        //login -> 123abc convert hash and match

        const hashedPassword = await bcrypt.hash(password, 10)
        // 10 means 10 sorting rounds for additional security
        //bcrypt will automatically handle this


        //5. store user data in db
        const userToRegsiter = new User({
            name,
            username, 
            email,
            password: hashedPassword
        });

        //saving to database
        const user = await userToRegsiter.save();

        //6. response send to user
        //additional change done here for future perspective
        //in parameter added auth: true
        const userDto = new UserDto(user);
        return res.status(201).json({user: userDto, auth: true});

    },
    //==============================================================
    //============================ Login ==========================
    //==============================================================
    async login(req, res, next) {
        //1.validate user input
        //if something is change in previous register schema
        //it should also change here

        //This can be seen as DTO
        //we expect data to be in such shape
        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattern).required()
        });


        //2. if validation error return wit help of middleware error handling
        const {error} = userLoginSchema.validate(req.body);

        if(error){
            return next(error);
        }

        //3. match username and password
        const {username, password} = req.body;

        //if not using short hand
        //const username = req.body.username;
        //const password = req.body.password;
        let user;
        try {
            //match username
            user = await User.findOne({username: username});

            if(!user){
                const error = {
                    status: 401,
                    message: 'Invalid username'
                }
                return next(error);
            }
            // match password
            //req.body.password -> hash -> match

            const match = await bcrypt.compare(password, user.password);

            if(!match){
                const error = {
                    status: 401,
                    message: 'Invalid password'
                }
                return next(error);
            }
        } 
        catch (error) {
            return next(error);
         }
        
        const userDto = new UserDto(user);
        //4. return response
        //if successfully matched credentials
        return res.status(200).json({user: userDto});
    },

    //==============================================================
    //============================ Logout ==========================
    //==============================================================
    async logout(req, res, next){
        // console.log(req);
        //1.  delete refresh token from database

        //2. response user (through this front-end will know user is anauthenticated)
        res.status(200).json({user: null, auth: false});

        //I skipped this part because in video he is deleting 
        //firstly the refresh token and then the record related to refresh token
        //if in front-end the logic is not handled I'll come here and apply logic
        //Video time 3:13 min
    },

    //==============================================================
    //============================ Refresh ==========================
    //==============================================================
    async refresh(req, res, next){
        //1.  get refresh token from cookies
        //2.  verify refresh token
        //3. generate new tokens
        //4. update db, return response

        // const user = await User.findOne({_id: id});
        // const userDto = new UserDto(user);
        // return res.status(200).json({user: userDto, auth: true});
    }

  
}

module.exports = authController;