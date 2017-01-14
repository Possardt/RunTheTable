var app = new PLAYGROUND.Application({
  height: 600,
  width: 800,
  smoothing: true,

  create: function() {

    /* things to preload */

    this.loadImage("giana");

  },

  ready: function() {

    /* after preloading route events to the game state */

    this.setState(ENGINE.Home);

  }

});
