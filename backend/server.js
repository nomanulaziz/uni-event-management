const express = require("express");
const dbConnect = require("./database/index");
const {PORT} = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

//allow/accept/send application to communicate data in json
app.use(express.json());
app.use(router);

dbConnect();

//middleware to access images
//set static storage fro images
app.use('/storage', express.static('storage'));

//testing the response through browser. '/' refers to index.
// app.get('/', (req, res) => res.json({msg: 'Hello World12'}));

//register error handler
//why at end because middlewares are run sequently 
//so we want that when our request response cycle ends
//then error handling before sending response
app.use(errorHandler);

app.listen(PORT, console.log(`Backend is running at port : ${PORT}`));