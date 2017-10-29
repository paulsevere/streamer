require("dotenv").config();
const os = require("os");
const express = require("express");
const fs = require("fs");
const { join, resolve } = require("path");
const app = express();
const videoRoot = process.env.VIDEOS_ROOT;
const memeye = require("memeye");
memeye();

app.use(express.static(join(__dirname, "public")));
app.get("/list", (req, res) => {
  let files = fs.readdirSync(videoRoot);
  res.json(files);
});
app.use(express.static("public"));
// app.use(express.static(videoRoot));
app.get("/perf", (req, res) => {
  const stats = {
    global: { totalMemory: os.totalmem(), freeMemory: os.freemem() },
    memoryUsage: process.memoryUsage()
  };
  res.json(stats);
});
app.get("/*", function(req, res) {
  const path = resolve(videoRoot, req.url.slice(1));
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
