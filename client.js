"use strict";

import MasterPeer from "./lib/master-peer";
import ControllerPeer from "./lib/controller-peer";
import ConnPeer from "./lib/peer";

class App {
  constructor() {
    let match = window.location.hash.match(/#(\d{4})/);
    if(match) {
        let offer = match[1];
        let peer = new ConnPeer();
        peer.fetchOffer(offer)
          .then(o => {
            peer.init();
            return peer.signal(o);
          })
          .then(o => peer.sendOffer(o))
          .then(this.showOffer)
          .then(() => peer.waitConnect())
          .then(() => console.log("\o/"));
    } else {
      let mp = new MasterPeer();
      mp.addPeer();
    }
  }

  showOffer(offerId) {
    let offerElem = document.createElement("p");
    offerElem.innerHTML = offerId;
    document.body.appendChild(offerElem);
  }
}

new App();
