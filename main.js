var keypress = require('keypress');
var launchpadder = require('launchpadder')
var launchpadder = require("launchpadder").Launchpad;
var events = require('events')
var stopnowfam = false
var child_process = require('child_process');



var thing = new events()
global.Launchpad = new launchpadder(0,1)
keypress(process.stdin);
var tetris = require('./tetris.js')
process.stdin.on('keypress', function(ch, key) {
    if (key && key.ctrl && key.name == 'c') {
        process.exit();
    }
    if (stopnowfam) return

    if(key  && key.name == 'a') {
      tetris.emit("left")
    }
    if(key && key.name == "d") {
      tetris.emit("right")
    }
    if(key && key.name == "w") {
      tetris.emit("rotate")
    }
    if(key && key.name == "s") {
      tetris.emit("down")
    }



});
tetris.on("end", () => {
  stopnowfam = true
  setTimeout(function () {
    let x = 0
    const { spawn } = require('child_process');
    const bat = spawn('cmd.exe', ['/c', 'thing.bat']);
    noinput = true
    setTimeout(function () {
   end(0, 0, false)
    }, 1000);

})})
process.stdin.setRawMode(true);
process.stdin.resume();
function end(x, y, ran) {

  if(y === 8) {

     setTimeout(function () {
       global.Launchpad.allDark()
       tetris = require('./tetris.js')
       tetris.emit("start")
       stopnowfam = false
     }, 1000);
  }
  if(y === 8) {setTimeout(function () {
    process.exit()
  }, 100);}
  setTimeout(function () {

    let butt = global.Launchpad.getButton(x, y)
    butt.light(15)
    x++
    if(x === 8) {
      x = 0
      y++
    }


    end(x,y, true)
  }, 20);

}
tetris.emit("start")
