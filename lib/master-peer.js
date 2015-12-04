"use strict";

import Peer from "simple-peer";
import uuid from "uuid";
import qrcode from "qrcode";

export default class MasterPeer {
  constructor() {
    this.peers = new Map();
  }

  addPeer() {
    let id = uuid.v1();
    let peer = new Peer({ initiator: true, trickle: false });
    this.peers.set(id, peer);

    return new Promise((resolve, reject) => {
      peer.on("connect", () => console.log("connect"));
      peer.on("signal", data => {
        console.log(data);
        let encoded = btoa(JSON.stringify(data));
        qrcode.toDataURL(window.location.origin + "/#" + encoded, (e, url) => {
          let img = new Image();
          img.src = url;
          document.body.appendChild(img);
        });
      });
    });
  }
}
