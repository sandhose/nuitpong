"use strict";

import connect from "connect";
import http from "http";
import createStatic from "connect-static";
import body from "body-parser";

let app = connect();
let offers = new Map();

app.use(body.json());

createStatic({
  dir: "public",
  aliases: [
    ["/", "/index.html"]
  ]
}, (err, middleware) => {
  if(err) throw err;
  app.use(middleware);
});

app.use((req, res, next) => {
  let match = req.url.match(/^\/o\/(\d{4})$/)
  if(match) {
    console.log("get offer", match[1]);
    let offer = offers.get(match[1]);
    res.writeHead(200, {"Content-Type": "application/json"});
    if(!offer) {
      offer = {};
    }
    res.end(JSON.stringify(offer));
  }
  else {
    next();
  }
});

app.use((req, res, next) => {
  if(req.url.match(/^\/o\/$/) && req.method == 'POST') {
    if(req.body) {
      let id = (Math.floor(Math.random() * 9000) + 1000).toString();
      offers.set(id, req.body);
      res.writeHead(200, {"Content-Type": "text/plain"});
      res.end(id);
      console.log("post offer", id);
    } else {
      res.end("ERR");
    }
  }
  else {
    next();
  }
});

let server = http.createServer(app);
server.listen(1337);
