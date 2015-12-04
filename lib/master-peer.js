"use strict";

import ConnPeer from "./peer";
import uuid from "uuid";
//import qrcode from "qrcode";
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

    return peer.waitSignal()
      .then(o => peer.sendOffer(o))
      .then(id => this.showQRCode(id))
      .then(() => this.waitForm())
      .then(id => peer.fetchOffer(id))
      .then(o => peer.signal(o))
      .then(() => peer.waitConnect())
      .then(() => console.log("\o/"));
  }

  waitForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let submit = document.createElement("button");
    submit.innerHTML = "Send";
    submit.type = "submit";
    form.appendChild(input);
    form.appendChild(submit);
    document.body.appendChild(form);

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
    link.innerHTML = "Offer";
    link.href = href;
    let img = new Image();
    img.src = qrcode(href)
    document.body.appendChild(img);
    document.body.appendChild(link);
  }
}
