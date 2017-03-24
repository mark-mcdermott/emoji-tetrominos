(function(){

  // init vars
  var canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      canWidth = canvas.width,
      frame = 0,
      pixel = canWidth / 10.0, // unit for width, 1/10 width of board
      landed = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
      ];

      // init blocks
      // using letter names for blocks, see http://i.imgur.com/9Z0oJXe.png
      Block = {
        i: function(x,y){
          this.form = [
            [1,1,1,1]
          ];
          this.height = 1;
          this.width = 3;
          this.num = 4;
          this.initPos = [x,y];
          this.coords = [
            [x,y],[x+1,y],[x+2,y],[x+3,y]
          ];
        }
      };

  // helper functions - draw boxes & text to correct scale
  function strokeRec(x,y,w,h) {
    ctx.strokeRect(x*pixel,y*pixel,w*pixel,h*pixel);
  }
  function fillText(text,x,y) {
    ctx.font="18px Georgia";
    ctx.fillText(text,(x+0.25)*pixel,(y+0.75)*pixel);
  }
  function fillRec(x,y) {
    ctx.fillRect(x*pixel,y*pixel,1*pixel,1*pixel);
  }
  function drawBlock(coords,num) {
    for (var i=0; i<num; i++) {
      ctx.fillRect(coords[i][0]*pixel,coords[i][1]*pixel,1*pixel,1*pixel);
    }
  }

  // add a numbered grid to board.  for debugging
  function makeGrid() {
    for (var i=0; i<10; i++) {
      strokeRec(i,0,1,20);
    }
    for (var i=0; i<20; i++) {
      strokeRec(0,i,10,1);
    }
    for (var i=0; i<20; i++) {
      fillText(i,0,i);
    }
    for (var i=1; i<10; i++) {
      fillText(i,i,0);
    }
  }

  // drops all pieces in array down one pixel
  function lowerBlocks() {

    // loop through every block
    for (var i=0; i<fallingBlocks.length; i++) {

      // check if block is already touching bottom
      var touchingFloor = false;
      for (var j=0; j<fallingBlocks[i]['coords'].length; j++) {
        if (fallingBlocks[i]['coords'][j][1] == 19) {
          touchingFloor = true;
        }
      }

      // lower the block
      if (touchingFloor) {
        //console.log(fallingBlocks[0]);
        for (var i=0; i<fallingBlocks[0]['coords'].num; j++) {
          landed.push(fallingBlocks[0]['coords'][i]);
        }
        //fallingBlocks.pop();
        // lower the block
      } else {
        for (var j=0; j<fallingBlocks[i]['coords'].length; j++) {
          fallingBlocks[i]['coords'][j][1]++;
        }
      }

    }
  }

  // drops all pieces in array down one pixel
  function collisionDetect() {

    if (fallingBlocks.length > 1) {

      // loop through every block
      for (var i=0; i<fallingBlocks.length; i++) {
        // check for block collision
        var blockCollision = false;
        for (var j=0; j<fallingBlocks[i]['coords'].length; j++) {
          //console.log(blocks[i]['coords'][j]);
          for (var k=i+1; k<fallingBlocks.length; k++) {
            //console.log(fallingBlocks[i]['coords'][i][0],fallingBlocks[i]['coords'][i][1]);
            //console.log(fallingBlocks[k]['coords'][i][0],fallingBlocks[i]['coords'][i][1]);
          }

          // if (blocks[i]['coords'][j][1] == 19) {
          //   touchingFloor = true;
          // }
        }

        /*
        // lower the block
        if (!touchingFloor) {
          for (var j=0; j<blocks[i]['coords'].length; j++) {
            blocks[i]['coords'][j][1]++;
          }
        }
        */

      }

    }

  }

  // clear the whole board each frame to redraw all pieces in new pos
  function clearBoard() {
    ctx.clearRect(0,0,10*pixel,20*pixel);
  }

  var falling = new Block['i'](0,17);
  drawBlock(falling['coords']);

  function draw() {
    clearBoard();
    lowerBlocks();
    //console.log(fallingBlocks);
    console.log(landed);
    collisionDetect();
    makeGrid();
    drawBlock(falling['coords'],falling['num']);
  }

  draw();

  document.getElementById("next").addEventListener("click", function(e){
    draw();
    e.preventDefault();
    frame++;
  });




  // drawBlock(i.coords,i.numPix);
  //ctx.fillRect(2*pixel,2*pixel,2*pixel,2*pixel);
  // console.log(i);

  // console.log(blocks);

})();

      // var height = shapeForms[blocks[i]['type']].length;
      // var hitFloor = blocks[i]['y'] >= 20 - height;
      // if (!hitFloor) {
      //   // add one to y
      //   pieces[i]['y'] = blocks[i]['y'] + 1;
      //   //update all of piece's coordinates
      //   for (var j=0; j<blocks[i]['coords'].length; j++) {
      //     pieces[i]['coords'][j]['y']++;
      //     console.log('y');
      //     //console.log(x1+','+y1);
      //   }
      // }

/*
// using letter names for blocks, see http://i.imgur.com/9Z0oJXe.png
var blocks = {}['i','t','s','z','j','l','o'];
var shapeForms = {
  'i': [
    [1,1,1,1]
  ],
  't': [
    [0,1,0],
    [1,1,1]
  ],
  's': [
    [0,1,1],
    [1,1,0]
  ],
  'z': [
    [1,1,0],
    [0,1,1]
  ],
  'j': [
    [1,0,0],
    [1,1,1]
  ],
  'l': [
    [0,0,1],
    [1,1,1]
  ],
  'o': [
    [1,1],
    [1,1]
  ]
}

function printShape(x,y,shape) {
  for (var i=0; i<shape.length; i++) {
    for (var j=0; j<shape[i].length; j++) {
      if (shape[i][j]) {
        ctx.fillRect(j*pixel+x*pixel,i*pixel+y*pixel,pixel,pixel);
      }
    }
  }
}



// drops all pieces in array down one pixel
function lowerPieces() {

  // drop pieces until they hit the floor
  for (var i=0; i<pieces.length; i++) {

    var height = shapeForms[pieces[i]['type']].length;

    var hitFloor = pieces[i]['y'] >= 20 - height;

    if (!hitFloor) {

      // add one to y
      pieces[i]['y'] = pieces[i]['y'] + 1;

      //update all of piece's coordinates
      for (var j=0; j<pieces[i]['coords'].length; j++) {
        pieces[i]['coords'][j]['y']++;
        console.log('y');
        //console.log(x1+','+y1);
      }

    }
  }

}

// randomly gets type & place of new piece & pushes it on array
function getNewPiece() {

  // gets random piece string letter like 'o' or 'i'
  var newPiece = shapeArr[(Math.floor(Math.random() * 7))];

  // longer pieces need offset so they aren't placed out of board
  // o = 0.  s,z,t,j,l = 1.   i = 2.
  var offset = shapeForms[newPiece][0].length - 2;

  // rand x val: 0-7 for o, 0-6 for s,z,t,j,l and 0-5 for i
  var randX = Math.floor(Math.random() * (9 - offset));

  // get coordinates for each pixel in new piece & push to array
  var coords = [];
  for (var i=0; i<shapeForms[newPiece].length; i++) {
    for (var j=0; j<shapeForms[newPiece][i].length; j++) {
      if (shapeForms[newPiece][i][j] == 1) {
        coords.push({'x':j+randX, 'y':i});
      }
    }

  }

  //push new piece onto pieces array
  pieces.push( { 'type':newPiece, 'x':randX, 'y':0, 'coords':coords } );
}

// prints out all pieces in pieces array
function printPieces() {
  for (i=0; i<pieces.length; i++) {
    var x = pieces[i]['x'];
    var y = pieces[i]['y'];
    var type = shapeForms[pieces[i]['type']];
    printShape(x,y,type);
  }
}


function draw(){


  // clearBoard();
  // if (frame == 0) getNewPiece();
  // if (frame == 5) getNewPiece();
  // lowerPieces();
  // console.log(detectCollision());
  // // console.log('lower done');
  // // if (frame % 12 == 0) {
  // //   getNewPiece();
  // // }
  // // if (frame == 3) {
  // //   getNewPiece();
  // // }
  // printPieces();
  // frame++;

  clearBoard();
  printGrid();
  if (frame % 23 == 0) getNewPiece();
  printPieces();
  lowerPieces();
  console.log('');
  frame++;

}

//setInterval( draw, 100 );
draw();


document.getElementById("next").addEventListener("click", function(e){
  draw();
  e.preventDefault();
});
*/
