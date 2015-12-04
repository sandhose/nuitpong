"use strict";

import Peer from "simple-peer";

export default class ControllerPeer {
  constructor() {
    this.peer = new Peer({ trickle: false });
  }

  signal(masterOffer) {
    return new Promise((resolve, reject) => {
      this.peer.on("signal", s => {
        resolve(s);
      });
      this.peer.signal(masterOffer);
    });
  }

  sendOffer(offer) {
    return fetch("/o/", {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(offer)
    })
    .then(res => res.text())
    .then(res => {
      if(res == "ERR") throw new Error();
      else return res;
    });
  }
}
