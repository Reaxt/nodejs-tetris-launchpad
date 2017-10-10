var events = require('events')
var launchpadder = require('launchpadder')
var launchpadder = require("launchpadder").Launchpad;
var launchpad = global.Launchpad
var tetris = new events();
var rotation
var start = false
var collidedown = [[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[-1,7],[-1,6],[-1,5],[-1,4],[-1,3],[-1,2],[-1,1],[-1,0],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8]]
var all = []
var justspawnned = true
var xoffset = 0
var yoffset = 0
var cancel = false
var collide = false
var cancelman = false
var linescore = 0
/*
[0,0][1,0][2,0][3,0]
[0,1][1,1][2,1][3,1]
[0,2][1,2][2,2][3,2]
[0,3][1,3][2,3][3,3]
*/
var tetrinominos = {
  cube:{
    up:[[1,0], [2,0], [1,1], [2,1]],
    down:[[1,0], [2,0], [1,1], [2,1]],
    left:[[1,0], [2,0], [1,1], [2,1]],
    right:[[1,0], [2,0], [1,1], [2,1]],
    color:60
  },
  line:{
    up:[[0,1], [1,1], [2,1], [3,1]],
    down:[[0,1], [1,1], [2,1], [3,1]],
    left:[[1,0],[1,1],[1,2],[1,3]],
    right:[[1,0],[1,1],[1,2],[1,3]],
    color:63
  }, t:{
    up:[[1,1],[2,1],[0,1],[1,0]],
    down:[[1,1],[1,2],[0,1],[2,1]],
    right:[[1,1],[2,1],[1,0],[1,2]],
    left:[[0,1],[1,0],[1,1],[1,2]],
    color:23
  }, leftl:{
    up:[[0,0],[0,1],[1,1],[2,1]],
    right:[[2,0],[1,0],[1,1],[1,2]],
    down:[[2,2],[2,1],[1,1],[0,1]],
    left:[[0,2],[1,2],[1,1],[1,0]],
    color:52
  }, rightl:{
    up:[[2,0],[0,1],[1,1],[2,1]],
    right:[[2,2],[1,0],[1,1],[1,2]],
    down:[[0,2],[2,1],[1,1],[0,1]],
    left:[[0,0],[1,2],[1,1],[1,0]],
    color:71
  },
  zthingl:{
    up:[[0,0],[1,0],[1,1],[2,1]],
    right:[[2,0],[2,1],[1,1],[1,2]],
    down:[[2,2],[1,2],[1,1],[0,1]],
    left:[[0,2],[0,1],[1,1],[1,0]],
    color:24

  }
}
var options = ["cube", "line", "t","leftl", "rightl","zthingl"]

var current
var currentcoords = []

tetris.on("start", () => {
  var running = true
  tetris.emit("init")
})
tetris.on("init", () => {
  launchpad.allDark()
   current = tetrinominos[options[Math.floor(Math.random() * options.length)]]
   rotation = "up"
   xoffset++
   xoffset++
   current.up.forEach(function(element) {
     let x = element[0] + 2
     let y = element[1]
     currentcoords.push([x, y])
   })
   tetris.emit("step")
   tetris.emit("drawcurrent")
})
tetris.on("spawn", () => {
  justspawnned = true
  current = tetrinominos[options[Math.floor(Math.random() * options.length)]]
  rotation = "up"
  currentcoords = []
  collide = false
  xoffset++
  xoffset++
  current.up.forEach(function(element) {
    let x = element[0] + 2
    let y = element[1]
    currentcoords.push([x, y])
  })
  cancel = true
  setTimeout(function () {
    tetris.emit("step")
    tetris.emit("drawcurrent")
  }, 100);

})

tetris.on("step", () => {
  let daada = false
  collision = false
  if(cancelman) return
  if(!justspawnned){
    yoffset++
    currentcoords.forEach(function(element) {
      launchpad.getButton(element[0], element[1]).dark()
      currentcoords[currentcoords.indexOf(element)] = [element[0], element[1] + 1]
    })} else {justspawnned = false}
    collidedown.forEach(function(element) {
      currentcoords.forEach(function(element2) {
        if(element[0] === element2[0]) {
          if(element[1] === element2[1]) {


          currentcoords.forEach(function(element3){

            currentcoords[currentcoords.indexOf(element3)] = [element3[0], element3[1] - 1]
          })
          setTimeout(function () {
            tetris.emit("drawcurrent")
            tetris.emit("collide")

            daada = true
          }, 5);

          }
        }

      })
    })
setTimeout(function () {
  if(!daada) {
    tetris.emit("drawcurrent")
  }
}, 10);

setTimeout(function () {

  if(cancel) return cancel = false

  tetris.emit("step")

}, 1000);
})
tetris.on("drawcurrent", () => {
  currentcoords.forEach(function(element) {
    try{
    launchpad.getButton(element[0], element[1]).light(current.color)
  } catch(err) {
    rotation
     start = false
     collidedown = [[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[-1,7],[-1,6],[-1,5],[-1,4],[-1,3],[-1,2],[-1,1],[-1,0],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8]]
     all = []
     justspawnned = true
     xoffset = 0
     yoffset = 0
     cancel = false
     collide = false
     cancelman = false
     linescore = 0
     cancelman = true
     cancel = true

    tetris.emit("end")
  }
  })
})
tetris.on("collide", () => {
  collision = true
  currentcoords.forEach(function(element) {
    collidedown.push(element)
    all.push(element)
  })
  for(i = 0; i == 8; i++) {

  }
  xoffset = 0
  yoffset = 0
  tetris.emit("checklines")
  tetris.emit("spawn")
})
tetris.on("left", () => {
let leftcollide = false
if (collision) return
currentcoords.forEach(function(currentcoord) {
let x = currentcoord[0] - 1
let y = currentcoord[1]
if(x === (-1)) leftcollide = true
collidedown.forEach(function(element) {
  if(y != element[1]) return
  if(x === element[0]) leftcollide = true
})
})
if(!leftcollide) {
  xoffset--
  collide = false
  currentcoords.forEach(function(element) {
    launchpad.getButton(element[0], element[1]).dark()
    let x = element[0] - 1

    currentcoords[currentcoords.indexOf(element)] = [x, element[1]]

  })
  collidedown.forEach(function(element) {
    currentcoords.forEach(function(element2) {
      if(element[0] === element2[0]) {
        if(element[1] === element2[1] + 1) {
        collide = true
        }
      }
    })
  })
  tetris.emit("drawcurrent")

}
})
tetris.on("rotate", () => {
if(collision) return
let newcoords = []
let rot
switch (rotation) {
  case "up":
    rot = "right"
    break;
  case "right":
    rot = "down"
    break;
  case "down":
    rot = "left"
    break;
  case "left":
    rot = "up"
  default:

}

let dontgo = false
current[rot].forEach(function(element){
let x = element[0] + xoffset
let y = element[1] + yoffset
newcoords.push([x, y])
})
collidedown.forEach(function(element) {
  newcoords.forEach(function(element1) {
    if(element[0] == element1[0]) {
      if(element[1] == element1[1]) {
      dontgo = true
      }
    }
  })
})
if(!dontgo) {
rotation = rot
currentcoords.forEach(function(element) {
  launchpad.getButton(element[0], element[1]).dark()
})
currentcoords = newcoords

tetris.emit("drawcurrent")} else {
}
})
tetris.on("right", () => {
  if (collision) return
let rightcollide = false
currentcoords.forEach(function(currentcoord) {
  let x = currentcoord[0] + 1
  let y = currentcoord[1]
  if(x === 8) rightcollide = true
  collidedown.forEach(function(element) {
    if(y == element[1]) {
      if(x == element[0]) {
        rightcollide = true
      }
    }
  })
})
if(!rightcollide) {
  xoffset++
  currentcoords.forEach(function(element) {
    launchpad.getButton(element[0], element[1]).dark()
    let x = element[0] + 1
    currentcoords[currentcoords.indexOf(element)] = [x, element[1]]
  })
  collidedown.forEach(function(element) {
    currentcoords.forEach(function(element2) {
      if(element[0] === element2[0]) {
        if(element[1] === element2[1] + 1) {
        collide = true
        }
      }
    })
  })
  tetris.emit("drawcurrent")
}
})

tetris.on("checklines", () => {
let  lights = []
let linearray = [[],[],[],[],[],[],[],[]]
let lineamount = 0
let firstline = 8
  for(i = 0; i < 8; i++) {
    let templine = []
    all.forEach(function(element) {
      if(element[1] === i) {
        templine.push(element)
        if(templine.length == 8) {
          linearray[i].push(templine)
          if(firstline > i) {
            firstline = i
          }
          lineamount++

        }

      }

    })

}

if(lineamount > 0) {
linearray.forEach(function(element) {

  element.forEach(function(element3){
    element3.forEach(function(element2){
    launchpad.getButton(element2[0], element2[1]).dark();
    all.splice(all.indexOf(element2), 1)
    collidedown.splice(collidedown.indexOf(element2), 1)
  })
  })
})
setTimeout(function () {
  tetris.emit("score", lineamount)
  tetris.emit("rebuild", firstline, lineamount)
}, 30);

}
})


tetris.on("rebuild", (firstline, lineamount) => {

let allothers = []
let lights = []
let newdowncollide = [[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[-1,7],[-1,6],[-1,5],[-1,4],[-1,3],[-1,2],[-1,1],[-1,0],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8]]
let x = 0
all.forEach(function(element) {
  if(element[1] <= firstline) {

  allothers.push([element[0], element[1] + lineamount])
  newdowncollide.push([element[0], element[1] + lineamount])
  lights.push([element[0], element[1] + lineamount, launchpad.getButton(element[0], element[1]).getState()])
  launchpad.getButton(element[0], element[1]).dark()} else {
    allothers.push([element[0], element[1]])
    newdowncollide.push([element[0], element[1]])
  }
})
setTimeout(function () {
  all = allothers
  collidedown = newdowncollide
  lights.forEach(function(element) {
    launchpad.getButton(element[0], element[1]).light(element[2])
  })
}, 20);
})
tetris.on("score", (score) => {
})

module.exports = tetris
