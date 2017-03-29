let block = require("./block.js");

(function(){

  // init vars
  const canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      canWidth = canvas.width,

      // "Pixel" is unit of height/width, 1/10 width of board.
      // Each block is made of 4 pixels.
      pixel = canWidth / 10.0;

      // frame counter (needed for block entrance timing)
    let frame = 0,
      fallingBlock,

      // 2d array of board layout for keeping track
      // of all "landed" blocks.
      // Landed blocks are blocks that have hit
      // the floor or hit other blocks collected at bottom.
      //
      // landed array is all 0's to start, since no
      // blocks have hit the floor.  Every coordinate
      // with a landed block will gets a 1.
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

  // function defs
  // helper functions - draw boxes & text to correct scale
  function strokeRec(x, y, w, h) {
    ctx.strokeRect(x * pixel, y * pixel, w * pixel, h * pixel);
  }
  function fillText(text, x, y) {
    ctx.font="18px Georgia";
    ctx.fillText(text, (x + 0.25) * pixel, (y + 0.75) * pixel);
  }
  function drawPixel(x, y) {
    ctx.fillRect(x * pixel, y * pixel, 1 * pixel, 1 * pixel);
  }
  function drawBlock(coords, numPix) {
    for (let i=0; i<numPix; i++) {
      ctx.fillRect(coords[i][0] * pixel, coords[i][1] * pixel, 1 * pixel, 1 * pixel);
    }
  }

  // add a numbered grid to board.  for debugging
  function makeGrid() {
    for (let i=0; i<10; i++) {
      strokeRec(i, 0, 1, 20);
    }
    for (let i=0; i<20; i++) {
      strokeRec(0, i, 10, 1);
    }
    for (let i=0; i<20; i++) {
      fillText(i, 0, i);
    }
    for (let i=1; i<10; i++) {
      fillText(i, i, 0);
    }
  }

  function checkFullRows() {

    // check for any full rows
    for (let i=0; i<20; i++) {
      if (landed[i][0] === 1) {
        let fullRow = true;
        for (let j=1; j<10; j++) {
          if (landed[i][j] === 0) {
            fullRow = false;
          }
        }
        if (fullRow) {
          // clear full rows
          for (let j=0; j<10; j++) {
            landed[i][j] = 0;
          }
          for (let k=i-1; k>=0; k--) {
            for (let l=0; l<10; l++) {
              if (landed[k][l] === 1) {
                landed[k][l] = 0;
                landed[k+1][l] = 1;
              }
            }
          }
        }
      }
    }
  }

  // move the falling block down
  function moveDown() {

    if (fallingBlock) {

      // check if block is touching bottom now
      var touchingFloor = false;
      for (let i=0; i<fallingBlock.coords.length && touchingFloor===false; i++) {
        if (fallingBlock['coords'][i][1] === 19) {
          touchingFloor = true;
        }
      }

      // check if touching another block
      // (this approach to collision detection from https://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-collision-detection--gamedev-852 )
      let collision = false;
      if (!touchingFloor) {
        for (let coords of fallingBlock.coords) {
          const [ x, y ] = coords;
          if (landed[ y + 1 ][ x ] === 1) {
            collision = true;
          }
        }
      }

      // if at floor or , add block's pixels to landed array
      if (touchingFloor || collision) {
        for (let coords of fallingBlock.coords) {
          const [ x, y ] = coords;
          landed[y][x] = 1;
          checkFullRows();
        }
        fallingBlock = null;
        return;
      } else {
        // lower the block
        for (let i=0; i<fallingBlock.coords.length; i++) {
          fallingBlock['coords'][i][1]++;
        }
      }

    }
  }

  function moveSide(direction) {

    if (direction === 'left') {
      // if not at left edge, move left
      let firstPixel = fallingBlock['coords'][0];
      if (firstPixel[0] > 0) {

        // check if touching another block
        // (this approach to collision detection from https://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-collision-detection--gamedev-852 )
        let collision = false;
        for (let coords of fallingBlock.coords) {
          const [ x, y ] = coords;
          if ( (x > 0) && ( y >= 0) ) {
            //console.log(x+','+y+'   '+landed[y]);
            if (landed[ y ][ x - 1 ] === 1) {
              collision = true;
            }
          }
        }

        if (!collision) {
          for (let i=0; i<fallingBlock.coords.length; i++) {
            fallingBlock['coords'][i][0]--;
          }

        }

      }
    }

    if (direction === 'right') {

      // TODO: run this check on every pixel in block, not just last
      // if not at right edge, move right
      let length = fallingBlock.coords.length;
      let lastPixel = fallingBlock['coords'][length-1];
      if (lastPixel[0] < 9) {

        // check if touching another block
        // (this approach to collision detection from https://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-collision-detection--gamedev-852 )
        let collision = false;
        for (let coords of fallingBlock.coords) {
          const [ x, y ] = coords;
          if ( (x < 9) && (y>=0) ) {
            if (landed[ y ][ x + 1 ] === 1) {
              collision = true;
            }
          }
        }

        if (!collision) {
          for (let i=0; i<fallingBlock.coords.length; i++) {
            fallingBlock['coords'][i][0]++;
          }
        }

      }
    }

  }

  // rotate block
  function rotate() {
    // todo: add collision detection
    fallingBlock.rotate();
  }

  // clear the whole board each frame to redraw all pieces in new pos
  function clearBoard() {
    ctx.clearRect(0, 0, 10 * pixel, 20 * pixel);
  }

  // draw all pieces that have hit the bottom
  // (this set grows as new pieces hit the bottom)
  function drawLanded() {
    for (let i=0; i<landed.length; i++) {
      for (let j=0; j<landed[i].length; j++) {
        if (landed[i][j] === 1) {
          drawPixel(j,i);
        }
      }
    }
  }

  function drawFallingBlock() {
    if (fallingBlock) {
      drawBlock(fallingBlock['coords'],fallingBlock['numPix']);
    }
  }

  // check if fallen pieces have reached top
  // if so clear board
  function checkFullBoard() {
    let boardFull = false;
    for (let i=0; i<10; i++) {
      if (landed[0][i] === 1) {
        boardFull = true;
      }
    }
    if (boardFull) {
      for (let i=0; i<10; i++) {
        for (let j=0; j<20; j++) {
          landed[j][i] = 0;
        }
      }
    }
  }

  function moveDownOrNewBlock() {
    if (frame % 125 === 0) {
      if (!fallingBlock) {
        spawnBlock();
      } else {
        moveDown();
      }
    }
  }

  // spawns new block at top
  // (todo: x-pos will be random & will account for block width
  //        so not over either edge)
  // this falling var couldn't be seen by the other functions
  // (scoping issues), so scrapping for now...
  function spawnBlock() {

    let blockType;
    let x;
    const numBlock = Math.floor(Math.random() * 3);

    switch (numBlock) {

      case 0:
        blockType = 'i';
        x = Math.floor(Math.random() * (10 - 3));
        break;

      case 1:
        blockType = 'o';
        x = Math.floor(Math.random() * (10 - 2));
        break;

      case 2:
        blockType = 't';
        x = Math.floor(Math.random() * (10 - 2));
        break;

    }

    const y = 0;
    fallingBlock = new block(blockType, x, y);
  }



  // process all keystrokes
  function processKeystroke(key) {

    if (!fallingBlock) {
      return;
    }

    // move block keyboard input
    switch (key) {

      case 38:  // up arrow
        rotate();
        break;
      case 40:  // down arrow
        moveDown();
        break;
      case 39:  // right arrow
        moveSide('right');
        break;
      case 37:  // left arrow
        moveSide('left');
        break;
    }

  }

  function drawOnEvent(e) {
    draw();
    e.preventDefault();
  }

  // main draw loop (calls itself recursively at end)
  function draw() {
    moveDownOrNewBlock();
    clearBoard();
    makeGrid();
    drawLanded();
    drawFallingBlock();
    checkFullBoard();
    frame++;
    requestAnimationFrame(draw);
  }



  // event listeners
  // for testing - "next" button below board
  // (make sure moveDown() in draw() is uncommented)
  document.getElementById("next").addEventListener("click", drawOnEvent);

  // event listener for all keystrokes
  document.onkeydown = function(e) {
    processKeystroke(e.keyCode);
  };




  // start game
  spawnBlock();
  draw();  // call main draw loop



})();
