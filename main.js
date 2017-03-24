(function(){

  // init vars
  var canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      canWidth = canvas.width,
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
      ],

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

      // check if block is already touching bottom
      var touchingFloor = false;
      for (var j=0; j<falling['coords'].length; j++) {
        if (falling['coords'][j][1] === 19) {
          touchingFloor = true;
        }
      }

      // lower the block
      if (touchingFloor) {
        //console.log(fallingBlocks[0]);
        for (var i=0; i<falling['coords'].num; j++) {
          landed.push(falling['coords'][i]);
        }
        //fallingBlocks.pop();
        // lower the block
      } else {
        for (var j=0; j<falling['coords'].length; j++) {
          falling['coords'][j][1]++;
        }
      }
  }

  // drops all pieces in array down one pixel
  /*
  function collisionDetect() {

    if (fallingBlocks.length > 1) {

      // loop through every block
      for (var i=0; i<fallingBlocks.length; i++) {
        // check for block collision
        var blockCollision = false;
        for (var j=0; j<falling[i]['coords'].length; j++) {
          //console.log(blocks[i]['coords'][j]);
          for (var k=i+1; k<fallingBlocks.length; k++) {
            //console.log(fallingBlocks[i]['coords'][i][0],fallingBlocks[i]['coords'][i][1]);
            //console.log(fallingBlocks[k]['coords'][i][0],fallingBlocks[i]['coords'][i][1]);
          }

          // if (blocks[i]['coords'][j][1] == 19) {
          //   touchingFloor = true;
          // }
        }

        // lower the block
        if (!touchingFloor) {
          for (var j=0; j<blocks[i]['coords'].length; j++) {
            blocks[i]['coords'][j][1]++;
          }
        }

      }

    }

  }
  */

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
    //console.log(landed);
    //collisionDetect();
    makeGrid();
    drawBlock(falling['coords'],falling['num']);
  }

  draw();

  function drawOnEvent(e)
  {
    draw();
    e.preventDefault();

  }
  document.getElementById("next").addEventListener("click", drawOnEvent);
  // document.getElementById("next").addEventListener("click", function(e){
  //   draw();
  //   e.preventDefault();
  //   frame++;
  // });



  // drawBlock(i.coords,i.numPix);
  //ctx.fillRect(2*pixel,2*pixel,2*pixel,2*pixel);
  // console.log(i);

  // console.log(blocks);

})();
