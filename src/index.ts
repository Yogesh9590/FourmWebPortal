
import * as express from 'express'
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as mongo from "connect-mongo";
import * as logger from "morgan";
import * as mongoose from "mongoose";
import * as flash from "express-flash"; 
import * as jwt from "jsonwebtoken";
import * as cors from "cors";
import expressValidator = require("express-validator");

import * as msg from "./services/response-msg-service";
import * as JSONRes from "./services/response-service";

// Controllers (route handlers).
import * as authController from "./controllers/auth";

const env = require('./config/env');
const config = require('./config/config');

// const MongoStore = mongo(session);
const app = express();

//Connect to MongoDB.
// mongoose.connect(config.mongoURI,{ useMongoClient: true });

// mongoose.connection.on("error", () => {
//   console.log("MongoDB connection error. Please make sure MongoDB is running.");
//   process.exit();
// });

// enable cors
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(logger('dev'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  // store: new MongoStore({
  //   url: config.mongoURI,
  //   autoReconnect: true
  // })
}));
app.use(flash());


// get an instance of the router for api routes
var apiRoutes = express.Router(); 
// route to authenticate a user (POST http://localhost:8080/api/authenticate)

//app.post("/api/signIn", authController.signIn);


// route middleware to verify a token
apiRoutes.use(function(req:any, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['auth-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {      
      if (err) {
        return res.status(401).json(JSONRes.constructResponseJson(401, "FAIL", msg.RES_MSG.TOKAN_EXPIRED));
        //return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.body.decoded = decoded;    
        next();
      }
    });
  } else {
    // if there is no token
    return res.status(403).json(JSONRes.constructResponseJson(403, "FAIL", msg.RES_MSG.NO_TOKEN_PROVIDED)); 
  }
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
//app.get("/api/logout", authController.logout);


//app.post("/api/signUp", authController.resetPassword);
app.get("/", authController.defaultRoute);


const port = process.env.PORT;
app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})
