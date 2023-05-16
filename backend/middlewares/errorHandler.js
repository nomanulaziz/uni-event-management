const {ValidationError} = require('joi');

const errorHandler = (error, req, res, next) => {
    //default error
    let status = 500;
    let data = {
        message: 'Internal Server Error'
    }

    //if validation error instanceof -> type
    if(error instanceof ValidationError){
        status = 401;
        data.message = error.message;

        return res.status(status).json(data);
    }

    //any other error than validation with status property
    if(error.status){
        status = error.status;
    }

    //if message in error
    if(error.message){
        data.message = error.message;
    }

    return res.status(status).json(data);
}

module.exports = errorHandler;