// -------------------------------------------------------------
// --------------------- Block Class ---------------------------
// -------------------------------------------------------------

// Blocks have letter name: I, T, J, L & O (http://i.imgur.com/9Z0oJXe.png)
// All block movement/collision calculated from block coordiates
// Blocks are made of 4 "pixels"
// First block "pixel" is top left pixel
// Subsequent block coordinates are calculated from first pixel
// Rotations based on NES controls (http://imgur.com/a/IVRrf)

// For collision detection, make first coordinate pair in coords
// array the block's far left pixel.  Make the last coorinate
// coordinate pair the far right pixel.


module.exports = class Block {

  // block constructor (needs block letter & initial coords)
  constructor(letter, x, y)
  {
    this.letter = letter.toUpperCase();
    this[`_init${this.letter}`](x, y);
  }


    // init L block (needs its initial coords)
    _initL(x, y)
    {
      this.height = 2;       // L block height (for floor/block collision)
      this.width = 3;        // L block width (for wall collision)
      this.numPix = 4;       // num pixels in L block
      this.curRotation = 0;  // current pos in rotations array
      this.emoji = "😀";
      this.coords = [ [ x, y ], [ x, y + 1 ], [ x + 1, y ], [ x + 2, y ]  ];
      this.rotate = function() {

        // gets current x & y
        let x = this.coords[0][0];
        let y = this.coords[0][1];

        // if L is vert, checks for collisions
        if ( (this.curRotation === 0 && y < 1)
           || (this.curRotation === 1 && x < 1)
           || (this.curRotation === 1 && x > 7)
           || (this.curRotation === 3 && x < 1) ) {
          return;
        }

        if ( (x >= 0) && (x < 9) ) {

          // advances curRotation (always 0 or 1)
          this.curRotation = (this.curRotation + 1) % 4;

          // rotates to new curRotation
          switch(this.curRotation) {

            /* down facing L block */
            case 0:
              this.coords = [ [ x - 1, y + 1 ], [ x, y + 1 ], [ x + 1, y + 1 ], [ x - 1, y + 2 ] ];
              break;

            /* left facing L block */
            case 1:
              this.coords = [ [ x, y - 1 ], [ x + 1, y - 1], [ x + 1, y ], [ x + 1, y + 1 ]  ];
              break;

            /* up facing L block */
            case 2:
              this.coords = [ [ x, y + 1 ], [ x + 1, y + 1 ], [ x + 2, y + 1 ], [ x + 2, y ]  ];
              break;

            /* right facing L block */
            case 3:
              this.coords = [ [ x + 1, y - 1 ], [ x + 1, y ], [ x + 1, y + 1 ], [ x + 2, y + 1 ]  ];
              break;

          }

        }

      };
    }



  // init J block (needs its initial coords)
  _initJ(x, y)
  {
    this.height = 2;       // J block height (for floor/block collision)
    this.width = 3;        // J block width (for wall collision)
    this.numPix = 4;       // num pixels in J block
    this.curRotation = 0;  // current pos in rotations array
    this.emoji = "💩";
    this.coords = [ [ x, y ], [ x + 1, y ], [ x + 2, y ], [ x + 2, y + 1 ]  ];
    this.rotate = function() {

      // gets current x & y
      let x = this.coords[0][0];
      let y = this.coords[0][1];

      // if J is vert, checks for collisions
      if ( (this.curRotation === 0 && y < 1)
         || (this.curRotation === 1 && x < 1)
         || (this.curRotation === 1 && x > 7)
         || (this.curRotation === 3 && x < 1) ) {
        return;
      }

      if ( (x >= 0) && (x < 9) ) {

        // advances curRotation (always 0 or 1)
        this.curRotation = (this.curRotation + 1) % 4;

        // rotates to new curRotation
        switch(this.curRotation) {

          /* down facing J block */
          case 0:
            this.coords = [ [ x - 1, y - 1 ], [ x, y - 1 ], [ x + 1, y - 1 ], [ x + 1, y ] ];
            break;

          /* left facing J block */
          case 1:
            this.coords = [ [ x, y + 1 ], [ x + 1, y + 1], [ x + 1, y ], [ x + 1, y - 1 ]  ];
            break;

          /* up facing J block */
          case 2:
            this.coords = [ [ x, y - 2 ], [ x, y - 1 ], [ x + 1, y - 1 ], [ x + 2, y - 1 ]  ];
            break;

          /* right facing J block */
          case 3:
            this.coords = [ [ x + 1, y + 2 ], [ x + 1, y + 1 ], [ x + 1, y ], [ x + 2, y ]  ];
            break;

        }

      }

    };
  }

  // init Z block (needs its initial coords)
  _initZ(x, y)
  {
    this.height = 2;       // Z block height (for floor/block collision)
    this.width = 3;        // Z block width (for wall collision)
    this.numPix = 4;       // num pixels in Z block
    this.curRotation = 0;  // current pos in rotations array
    this.emoji = "🐶";
    this.coords = [ [ x, y ], [ x + 1, y ], [ x + 1, y + 1 ], [ x + 2, y + 1 ] ];
    this.rotate = function() {

      // gets current x & y
      let x = this.coords[0][0];
      let y = this.coords[0][1];

      // if Z is vert, checks for collisions
      if (this.curRotation === 0 && y < 1) {
        return;
      }

      if ( (x >= 0) && (x < 9) ) {

        // advances curRotation (always 0 or 1)
        this.curRotation = (this.curRotation + 1) % 2;

        // rotates to new curRotation
        switch(this.curRotation) {

          /* down facing Z block */
          case 0:
            this.coords = [ [ x, y ], [ x - 1, y ], [ x, y + 1 ], [ x + 1, y + 1] ];
            break;

          /* vert Z block */
          case 1:
            this.coords = [ [ x, y ], [ x, y + 1 ], [ x + 1, y ], [ x + 1, y - 1 ] ];
            break;

        }

      }

    };
  }

  // init S block (needs its initial coords)
  _initS(x, y)
  {
    this.height = 2;       // S block height (for floor/block collision)
    this.width = 3;        // S block width (for wall collision)
    this.numPix = 4;       // num pixels in S block
    this.curRotation = 0;  // current pos in rotations array
    this.emoji = "🐮";
    this.coords = [ [ x, y ], [ x + 1, y ], [ x + 1, y - 1 ], [ x + 2, y - 1 ] ];
    this.rotate = function() {

      // gets current x & y
      let x = this.coords[0][0];
      let y = this.coords[0][1];

      // if S is vert, checks for collisions
      if (this.curRotation === 0 && y < 1) {
        return;
      }

      if ( (x >= 0) && (x < 9) ) {

        // advances curRotation (always 0 or 1)
        this.curRotation = (this.curRotation + 1) % 2;

        // rotates to new curRotation
        switch(this.curRotation) {

          /* down facing S block */
          case 0:
            this.coords = [ [ x - 1, y + 1 ], [ x, y + 1 ], [ x, y ], [ x + 1, y ] ];
            break;

          /* vert S block */
          case 1:
            this.coords = [ [ x + 1, y - 1 ], [ x + 1, y - 2 ], [ x + 2, y - 1 ], [ x + 2, y ] ];
            break;

        }

      }

    };
  }

  // init T block (needs its initial coords)
  _initT(x, y)
  {
    this.height = 2;       // T block height (for floor/block collision)
    this.width = 3;        // T block width (for wall collision)
    this.numPix = 4;       // num pixels in T block
    this.curRotation = 0;  // current pos in rotations array
    this.emoji = "🚔";
    this.coords = [ [ x, y ], [ x + 1, y ], [ x + 1, y + 1 ], [ x + 2, y ] ];
    this.rotate = function() {

      // gets current x & y
      let x = this.coords[0][0];
      let y = this.coords[0][1];

      // if T is vert, checks for collisions
      if ( (this.curRotation === 0 && y < 1)
         || ( this.curRotation === 1 && x > 7)
         || ( this.curRotation === 1 && x < 0)
         || ( this.curRotation === 3 && x < 1) ) {
        return;
      }

      if ( (x >= 0) && (x < 9) ) {

        // advances curRotation (always 0 or 1)
        this.curRotation = (this.curRotation + 1) % 4;

        // rotates to new curRotation
        switch(this.curRotation) {

          /* down facing T block */
          case 0:
            this.coords = [ [ x - 1, y - 1 ], [ x , y - 1 ], [ x, y ], [ x + 1, y - 1 ] ];
            break;

          /* left facing T block */
          case 1:
            this.coords = [ [ x, y ], [ x + 1, y ], [ x + 1, y - 1 ], [ x + 1, y + 1 ] ];
            break;

          /* up facing T block */
          case 2:
            this.coords = [ [ x, y ], [ x + 1, y ], [ x + 1, y - 1 ], [ x + 2, y ] ];
            break;

          /* right facing T block */
          case 3:
            this.coords = [ [ x + 1, y + 1 ], [ x + 1, y ], [ x + 1, y - 1 ], [ x + 2, y ] ];
            break;

        }

      }

    };
  }

  // init I block (needs its initial coords)
  _initI(x, y)
  {
    this.height = 1;       // I block height (for floor/block collision)
    this.width = 4;        // I block width (for wall collision)
    this.numPix = 4;       // num pixels in I block
    this.curRotation = 0;  // current pos in rotations array
    this.emoji = "🚀";
    this.coords = [ [ x, y ], [ x + 1, y ], [ x + 2, y ], [ x + 3, y ] ];
    this.rotate = function() {

      // gets current x & y
      let x = this.coords[0][0];
      let y = this.coords[0][1];

      // if I is vert, checks for collisions
      if ( ( ( this.curRotation === 0 ) && (y < 2) )
         || ( (this.curRotation === 1 ) && ( x < 2 ) ) ) {
        return;
      }

      if ( (x >= 0) && (x < 9) ) {

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
    this.emoji = "🍆";
    this.coords = [ [ x, y ], [ x + 1, y ], [ x, y + 1 ], [ x + 1, y + 1 ] ];
    this.rotate = function() {
      // no rotation on O block;
    };
  }

};
