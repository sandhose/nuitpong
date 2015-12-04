"use strict";

import Peer from "simple-peer";

export default class ControllerPeer {
  constructor(offer) {
    this.peer = new Peer({ tickle: false });
    this.peer.on("signal", s => console.log(s));
    this.peer.on("connect", () => console.log("connect"));
    this.peer.signal(offer);
  }
}
