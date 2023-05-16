const Joi = require("joi");
//builtin file system node js module
const fs = require("fs");
const Event = require("../models/new_event");
const {BACKEND_SERVER_PATH} = require("../config/index");
const EventDTO = require("../dto/event");
const EventDetailsDTO = require("../dto/event_details");

//mango db id pattern
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const eventController = {
    //==============================================================
    //============================ Create ==========================
    //==============================================================
    async create(req, res, next){
        //1. validate req body
        //2. handle photo storage, naming
        //3. add to db
        //4. send response

        console.log("Inside create -> event controller");

        //client side -> base64 encoded string -> 
        //decode -> save photo's path in db
        const createEventSchema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            // type: Joi.string().required(),
            // date: Joi.date().required(),
            // time: Joi.string().required(),
            // venue: Joi.string().required(),
            image: Joi.string().required(),
            admin: Joi.string().regex(mongodbIdPattern).required()

        });

        const {error} = createEventSchema.validate(req.body);

        if(error){
            return next(error);
        }
        //if not error
        // -------- change values here later on
        const {title,  content, image, admin} = req.body;

        //read as node js buffer
        //photo formats
        // /^data:image\/(png|jpg|jpeg);base64,/,''
        const buffer = Buffer.from(image.replace(/^data:image\/(png|jpg|jpeg);base64,/,''), 'base64');
        
        // alot a random name
        const imagePath = `${Date.now()}-${admin}`;

        //save locally
        try {
            fs.writeFileSync(`storage/${imagePath}.png`, buffer);
        } 
        catch (error) {
            //handlde error through middleware
            return next(error);
        }

        //save event in db
        let newEvent;
        try {
            newEvent = new Event({
                title,
                content,
                // type,
                // date,
                // time,
                // venue,
                image: `${BACKEND_SERVER_PATH}/storage/${imagePath}.png`,
                admin
            });

            await newEvent.save();
        } 
        catch (error) {
            return next(error);
        }

        const eventDto = new EventDTO(newEvent);
        return res.status(201).json({event: eventDto});

    },

    //==============================================================
    //======================= Get All Events =======================
    //==============================================================
    async getAll(req, res, next){
        try {
            //no validation because we are not sending data
            //find() -> empty filter -> collection all data will e fetched
            const events = await Event.find({});

            const eventsDto = [];

            for(let i=0; i< events.length; i++)
            {
                const dto = new EventDTO(events[i]);
                eventsDto.push(dto);
            }

            return res.status(200).json({events: eventsDto});
        } 
        catch (error) {
            return next(error); 
        }
    },

    //==============================================================
    //================== Get Event by Id ==========================
    //==============================================================
    async getById(req, res, next){
        //validate id
        //send response

        const getByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        });

        const {error}  = getByIdSchema.validate(req.params);

        if(error){
            return next(error);
        }

        let event;

        const {id} = req.params;

        try {
            event = await Event.findOne({_id: id}).populate('admin');
        } 
        catch (error) {
            return next(error);
        }

        const eventDto = new EventDetailsDTO(event);

        return res.status(200).json({event: eventDto});
    },

    //==============================================================
    //====================== Update Event ==========================
    //==============================================================
    async update(req, res, next){
        //validate request body
        //delete previous photo if photo update
        //if photo not chnage change all other details

        const updateEventSchema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            admin: Joi.string().regex(mongodbIdPattern).required(),
            eventid: Joi.string().regex(mongodbIdPattern).required(),
            image: Joi.string(),
        });

        const {error} = updateEventSchema.validate(req.body);

        const {title, content, admin, eventid, image} = req.body;

        // delete previous photo
        //save new photo

        let event;
        try {
            event = await Event.findOne({_id: eventid});
            
        } catch (error) {
            return next(error);
        }

        if(image){
            let previousImage = event.image;

            //through this we will get our previous image
            //path starting from 1251362-21371254.png
            //at(-1) -> splits from last index
            previousImage = previousImage.split('/').at(-1); 

            //delete image
            fs.unlinkSync(`storage/${previousImage}`);

            //store new image (steps copied from above create function)
            // /^data:image\/(png|jpg|jpeg);base64,/,''
            const buffer = Buffer.from(image.replace(/^data:image\/(png|jpg|jpeg);base64,/,''), 'base64');
            
            // alot a random name
            const imagePath = `${Date.now()}-${admin}`;

            //save locally
            try {
                fs.writeFileSync(`storage/${imagePath}.png`, buffer);
            } 
            catch (error) {
                //handlde error through middleware
                return next(error);
            }
            await Event.updateOne({_id: eventid},
                {title, content, image: `${BACKEND_SERVER_PATH}/storage/${imagePath}.png`}
                );
        }
        else{
            await Event.updateOne({_id: eventid},{title, content});
        }
        return res.status(200).json({message: 'blog updated:'});
    },

    //==============================================================
    //====================== Delete Event ==========================
    //==============================================================
    async delete(req, res, next){
        //validate id
        //delete event

        const deleteEventSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        });

        const {error} = deleteEventSchema.validate(req.params);

        const {id} = req. params;

        //delete event
        try {
            await Event.deleteOne({_id: id});
        } 
        catch (error) {
            return next(error);
        }

        return res.status(200).json({message: 'blog deleted'});
    }
    

}

module.exports = eventController;