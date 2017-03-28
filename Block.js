// -------------------------------------------------------------
// --------------------- Block Class ---------------------------
// -------------------------------------------------------------

// Blocks have letter name: I, T, J, L & O (http://i.imgur.com/9Z0oJXe.png)
// All block movement/collision calculated from block coordiates
// Blocks are made of 4 "pixels"
// First block "pixel" is top left pixel
// Subsequent block coordinates are calculated from first pixel
// Rotations based on NES Tetris (http://imgur.com/a/IVRrf)


module.exports = class Block {

  // block constructor (needs block letter & initial coords)
  constructor(letter, x, y)
  {
    this.letter = letter.toUpperCase();
    this[`_init${this.letter}`](x, y);
  }

  // init I block (needs its initial coords)
  _initI(x, y)
  {
    this.height = 1;       // I block height (for floor/block collision)
    this.width = 4;        // I block width (for wall collision)
    this.numPix = 4;       // num pixels in I block
    this.curRotation = 0;  // current pos in rotations array
    this.coords = [ [ x, y ], [ x + 1, y ], [ x + 2, y ], [ x + 3, y ] ];
    this.rotate = function() {

      // gets current x & y
      let x = this.coords[0][0];
      let y = this.coords[0][1];

      // never rotation wall collisions when I is horiz
      // if I is vert, checks for collisions
      if (this.curRotation === 0 || ( (x > 1) && (x < 9) ) ) {

        // advances curRotation (always 0 or 1)
        this.curRotation = (this.curRotation + 1) % 2;

        // rotates to new curRotation
        switch(this.curRotation) {

          /* vert I block */
          case 0:
            this.coords = [ [ x - 2 , y + 2 ], [ x - 1 , y + 2 ], [ x , y + 2 ], [ x + 1 , y + 2 ] ];
            break;

          /* horiz I block */
          case 1:
            this.coords = [ [ x + 2, y - 2 ], [ x + 2, y - 1 ], [ x + 2, y ], [ x + 2, y + 1 ] ];
            break;

        }

      }

    };
  }

  // init I block (needs its initial coords)
  _initO(x, y)
  {
    this.height = 2;       // I block height (for floor/block collision)
    this.width = 2;        // I block width (for wall collision)
    this.numPix = 4;       // num pixels in I block
    this.curRotation = 0;  // current pos in rotations array
    this.coords = [ [ x, y ], [ x + 1, y ], [ x, y + 1 ], [ x + 1, y + 1 ] ];
    this.rotate = function() {
      // no rotation on O block;
    };
  }

};
