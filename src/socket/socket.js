const socketIO = require("socket.io");
require("dotenv").config();
let connections = [];
module.exports = (server) => {
  console.log(`http://${process.env.SOCKET_HOST}:${process.env.SOCKET_PORT}`);
  const io = socketIO(server, {
    cors: {
      origin: `http://${process.env.SOCKET_HOST}:${process.env.SOCKET_PORT}`,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("----------------------kết nói", socket.id);
    userLogin(socket, io);
    notyfy(socket, io);
    socket.on("disconnect", () => {
      connections = connections.filter((item) => item.idsoket !== socket.id);
      console.log("----------------------thoát", socket.id);
    });
  });

  const userLogin = (socket, io) => {
    socket.on("userLogin", ({ userId }) => {
      console.log("login", userId);
      connections = connections.filter((item, index) => {
        if (item.userId === userId && item.soketID !== socket.id) {
          socket.to(item.socketID).emit("userLogin", {
            msg: "Tài khoản của bạn đã được đăng nhập ở một nới khác!",
            from: item.soketID,
          });
          return false;
        } else {
          return true;
        }
      });
      let checkUser = connections.find(
        (item) => item.userId === userId && item.soketID === socket.id
      );
      if (!checkUser) {
        connections.push({
          socketID: socket.id,
          userId: userId,
        });
      }
    });
  };

  const notyfy = (socket, io) => {
    socket.on("notify", ({ userId, mesenger, username }) => {
      //   connections = connections.filter((item, index) => {
      //     if (item.userId === userId) {
      //       console.log("------------------gửi thông bóa----");
      //       socket.to(item.socketID).emit("notify", {
      //         mesenger: mesenger,
      //         username: username,
      //         from: item.soketID,
      //       });
      //     }
      //   });
      console.log(userId, mesenger, username);
      for (const connection of connections) {
        if (connection.userId === userId) {
          console.log("------------------gửi thông báo----");
          socket.to(connection.socketID).emit("notify", {
            mesenger: mesenger,
            username: username,
            from: connection.socketID,
          });
        }
      }
    });
  };
};
