  
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app.js');
const {Server} = require("socket.io");
const User = require('./model/userRelatedModels/userModel.js');

const server = http.createServer(app);
const io = new Server(server);


dotenv.config({path:'./config/config.env'});


const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);
try{
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('db connection succes');
    });

}catch(err){
  console.log(`err:${err}`);
}

// io server
// io.on("connection",(socket) => {
//   socket.emit("request","send a request");
//   io.emit("broadcast","hello");
//   socket.on("replay")
//   console.log(`user connected ${User.id}`)
// })
//application server
const apiPort = 4000;
server.listen(apiPort,()=>{
    console.log(`app is listening to port ${apiPort}`);
})



// unhandled programer error
// restart automatically
process.on('unhandledRejection',err => {
  console.log(err.name,err.message);
  process.exit(1);
})