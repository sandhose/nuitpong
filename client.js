"use strict";

import MasterPeer from "./lib/master-peer";
import ConnPeer from "./lib/peer";
import { log } from "./lib/log";
import Game from "./lib/game";

class App {
  constructor() {
    let match = window.location.hash.match(/#(\d{4})/);
    if(match) {
        let offer = match[1];
        this.peer = new ConnPeer();
        this.connectControl(offer)
          .then(() => this.showControls())
          .then(() => this.initCtrl());
    } else {
      this.mp = new MasterPeer();
      this.mp.cb = k => this.sendKey(k);
      this.connectMaster()
        .then(() => this.initGame());
    }
  }

  sendKey(k) {
    this.game.playerInput("one", k);
  }

  initGame() {
    document.getElementById("offer").style.display = "none";
    document.getElementById("canvas").style.display = "block";
    this.game = new Game(document.getElementById("canvas"));
    requestAnimationFrame(() => this.game.loop());
  }

  initCtrl() {
    this.up = document.getElementById("up");
    this.down = document.getElementById("down");

    this.up.addEventListener("touchstart", e => {
      this.absorbEvent(e);
      this.sendCtrl(1);
    });

    this.down.addEventListener("touchstart", e => {
      this.absorbEvent(e);
      this.sendCtrl(-1);
    });

    document.body.addEventListener("touchend", e => {
      this.absorbEvent(e);
      this.sendCtrl(0);
    });

    document.body.addEventListener("touchcancel", e => this.absorbEvent(e));
    document.body.addEventListener("touchmove", e => this.absorbEvent(e));

    this.up.addEventListener("mousedown", () => this.sendCtrl(1));
    this.down.addEventListener("mousedown", () => this.sendCtrl(-1));
    document.body.addEventListener("mouseup", () => this.sendCtrl(0));
  }

  absorbEvent(e) {
    var e = event || window.event;
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }

  sendCtrl(key) {
    this.peer.peer.send(key);
  }

  connectMaster() {
    return this.mp.addPeer();
  }

  connectControl(offer) {
    return this.peer.fetchOffer(offer)
      .then(o => {
        this.peer.init();
        return this.peer.signal(o);
      })
      .then(o => this.peer.sendOffer(o))
      .then(this.showOffer)
      .then(() => this.peer.waitConnect());
  }

  showOffer(offerId) {
    let offerElem = document.createElement("h1");
    offerElem.innerHTML = offerId;
    document.getElementById("offer").appendChild(offerElem);
    document.getElementById("offer-title").innerHTML = "Entrez ce code dans le navigateur";
  }

  showControls() {
    document.getElementById("offer").style.display = "none";
    document.getElementById("controls").style.display = "block";
  }
}

new App();
