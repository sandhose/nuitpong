"use strict";

import ConnPeer from "./peer";
import uuid from "uuid";
import { log } from "./log";
let qrcode = require("yaqrcode");

export default class MasterPeer {
  constructor() {
    this.peers = new Map();
  }

  addPeer(player) {
    let pid = uuid.v1();
    let peer = new ConnPeer(true);
    this.peers.set(pid, peer);
    peer.init();
    peer.peer.on("data", data => this.cb(player, data));

    let offerElem = document.createElement("div");
    offerElem.className = "offer";
    document.getElementById("offers").appendChild(offerElem);

    offerElem.innerHTML = "<h1>Negociating offer...</h1>";

    return peer.waitSignal()
      .then(o => peer.sendOffer(o))
      .then(id => this.showQRCode(id, offerElem))
      .then(() => this.waitForm(offerElem))
      .then(id => peer.fetchOffer(id))
      .then(o => peer.signal(o))
      .then(() => peer.waitConnect())
      .then(() => offerElem.innerHTML = "<h1>Connecté !</h1>");
  }

  waitForm(node) {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let submit = document.createElement("button");

    input.placeholder = "Code de connexion...";
    submit.innerHTML = "Go";
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

  showQRCode(id, offerElem) {
    let href = window.location.origin + "/#" + id;
    let link = document.createElement("a");
    link.href = href;
    let img = new Image();
    img.src = qrcode(href)
    link.appendChild(img);
    offerElem.appendChild(link);
    offerElem.querySelector("h1").innerHTML = "Flashez ce code";
  }
}
