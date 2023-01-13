require('dotenv').config();
require('express-async-errors');

const express = require('express')
const session = require('express-session')

const app = express()
const cors = require('cors');

// app.use(
//   cors({
//     origin: "http://localhost:3001",
//     methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH", "DELETE"],
//     credentials: true,
//   })
// );

const connectDB = require('./db/connect')

//for uploading images
app.use(express.static('./uploads'))

//routers
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const listingRouter = require('./routes/listing')
const publicRouter = require('./routes/public')


app.use(session({ //config object
  cookie: {
      maxAge: Number(process.env.SESSION_LIFETIME),
      sameSite: true,
      secure: false,
      httpOnly: false,
  },
  name: process.env.SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
}))


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(express.json()); //data in req.body is available for POST methods


//middleware for authentication
const extractUserIdMiddleware = require('./middleware/extract-userId');



// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/listing', extractUserIdMiddleware, listingRouter) //authentication middleware placed 
app.use('/api/v1/public', publicRouter) 

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;


const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI)
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();
