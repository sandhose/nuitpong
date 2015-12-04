"use strict";

import Peer from "simple-peer";

export default class ConnPeer {
  constructor(initiator = false) {
    this.initiator = initiator;
  }

  init() {
    this.peer = new Peer({ initiator: this.initiator, trickle: false });
    this.peer.on("signal", s => {
      this.lastSignal = s;
      console.log("signal", s);
    });
  }

  signal(offer) {
    console.log("signal", offer);
    this.peer.signal(offer);
    return this.waitSignal();
  }

  waitSignal() {
    return new Promise((resolve, reject) => {
      if(this.lastSignal) {
        return resolve(this.lastSignal);
      } else {
        this.peer.on("signal", d => resolve(d));
        this.peer.on("error", err => reject(err));
      }
    });
  }

  waitConnect() {
    return new Promise((resolve, reject) => {
      this.peer.on("connect", () => resolve());
    });
  }

  fetchOffer(id) {
    return fetch("/o/" + id)
      .then(res => res.json())
      .then(offer => {
        if(!offer) {
          throw new Error();
        } else {
          return offer;
        }
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
