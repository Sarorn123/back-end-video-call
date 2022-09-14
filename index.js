const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		// origin: "http://localhost:3000"
		origin: "https://sparkling-kashata-d148ad.netlify.app"
	}
});

app.get("/", (req, res) => {
	res.send("running")
})

io.sockets.on("connection", (socket) => {
	socket.on("join-room", async (room, user_id) => {

		const ids = await io.in(room).allSockets();
		const sockets = [];
		ids.forEach(re => {
			sockets.push(re);
		});

		// check if user join more than 2

		if (sockets.length < 2) {
			socket.join(room);
			socket.broadcast.to(room).emit('user-join', user_id);
		}
		socket.on("disconnect", () => {
			socket.broadcast.to(room).emit('user-gone', user_id);
		})
	});
});

httpServer.listen(process.env.PORT || 8000, () => {
	console.log("server running on port " + 8000);
});