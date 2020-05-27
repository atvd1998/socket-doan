const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const mongoose = require('mongoose');
const Chair = require('./models/Chair');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://localhost/socket', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('mongo connected');
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.Promise = global.Promise;
io.on('connect', (socket) => {
  console.log(`User ${socket.id} has connected`);
  Chair.findOne({ socketId: socket.id }).then((user) => {
    if (!user) {
      let user = new Chair({ socketId: socket.id });
      user.save();
      console.log('Không tìm thấy');
    } else {
      console.log('Tìm thấy');
    }
  });

  socket.on('sendvalue', (data, cb) => {
    let chairname = [];
    Chair.findOneAndUpdate(
      { socketId: socket.id },
      { $push: { chairName: data } }
    ).then((user) => {
      if (!user) console.log('update failed');
      else console.log('update success');
    });

    Chair.aggregate([
      { $match: { socketId: { $ne: socket.id } } },
      { $unwind: '$chairName' },
    ]).then((user) => {
      console.log(user);
    });
  });

  socket.on('disconnect', () => {
    Chair.findOneAndDelete({ socketId: socket.id }).then((user) => {
      console.log('Xóa thành công');
    });
    console.log(`User ${socket.id} has left`);
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
