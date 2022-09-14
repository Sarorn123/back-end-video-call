const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:3000"
	}
});

app.get("/", (req, res) => {

	res.send("running")
})

io.on("connection", (socket) => {
	socket.on("join-room", (room, user_id) => {
		socket.join(room);

		console.log("room => ", room);
		console.log("user_id => ", user_id);

		socket.broadcast.to(room).emit('user-join', user_id);

		socket.on("disconnect", () => {
			socket.broadcast.to(room).emit('user-gone', user_id);
		})
	});
});

httpServer.listen(process.env.PORT || 8000, () => {
	console.log("server running on port " + 8000);
});