"use strict";

import ConnPeer from "./peer";
import uuid from "uuid";
import { log } from "./log";
let qrcode = require("yaqrcode");

export default class MasterPeer {
  constructor() {
    this.peers = new Map();
  }

  addPeer() {
    let id = uuid.v1();
    let peer = new ConnPeer(true);
    this.peers.set(id, peer);
    peer.init();
    peer.peer.on("data", this.cb);


    return peer.waitSignal()
      .then(o => peer.sendOffer(o))
      .then(id => this.showQRCode(id))
      .then(() => this.waitForm(document.getElementById("offer")))
      .then(id => peer.fetchOffer(id))
      .then(o => peer.signal(o))
      .then(() => peer.waitConnect())
      .then(() => log("Connected !"));
  }

  waitForm(node) {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let submit = document.createElement("button");
    input.className = "form-control";
    submit.className = "btn btn-default btn-block";

    submit.innerHTML = "Send";
    submit.type = "submit";
    form.appendChild(input);
    form.appendChild(submit);
    node.appendChild(form);

    return new Promise((resolve, reject) => {
      form.addEventListener("submit", e => {
        e.preventDefault();
        e.stopPropagation();
        resolve(input.value);
      });
    });
  }

  showQRCode(id) {
    let href = window.location.origin + "/#" + id;
    let link = document.createElement("a");
    link.href = href;
    let img = new Image();
    img.src = qrcode(href)
    link.appendChild(img);
    document.getElementById("offer").appendChild(link);
    document.getElementById("offer-title").innerHTML = "Flashez ce code";
  }
}
