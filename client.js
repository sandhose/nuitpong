"use strict";

import MasterPeer from "./lib/master-peer";
import ControllerPeer from "./lib/controller-peer";

class App {
  constructor() {
    if(window.location.hash.length > 1) {
      try {
        let offer = JSON.parse(atob(window.location.hash.substring(1)));
        console.log(offer);
        let cp = new ControllerPeer(offer);
      } catch(e) {
        console.error(e);
      }
    } else {
      let mp = new MasterPeer();
      mp.addPeer();
    }
  }
}

new App();
