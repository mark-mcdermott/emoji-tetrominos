// Block class
// Using letter names for blocks, see http://i.imgur.com/9Z0oJXe.png
//
// All block movement/collision calculated from block coordiates.
// Blocks are made of 4 "pixels"
// First block "pixel" is bottom left pixel.
// Subsequent ones are calculated from first pixel

module.exports = class Block {
  constructor(letter, x, y)
  {
    this._letter = letter.toUpperCase();
    this[`_init${this._letter}`](x, y);
  }

  _initI(x, y)
  {
    this.form = [   // this is the visual layout of this block
      [ 1, 1, 1, 1 ]
    ];
    this.height = 1;      // block height (used for floor collision math)
    this.width = 3;       // block width (used for side wall collision math)
    this.num = 4;         // this is num pixels in this block, change to numPix i think
    this.initPos = [ x, y ]; // init block position (eventually may not be necessary)
    this.coords = [       // block's coordiates.  used for most block movement calculations
      [ x, y ], [ x + 1, y ], [ x + 2, y ], [ x + 3, y ]
    ];

    // rotation positions
    // todo: too many "magic numbers" here, use array forms
    // to make this visual and so quickly understandable
    this.positions = [
      [ [ x , y ], [ x + 1, y ], [ x + 2, y ], [ x + 3, y ] ],
      [ [ x + 1, y - 1 ], [ x + 1, y ], [ x + 1, y + 1 ], [ x + 1, y + 2 ] ],
      [ [ x, y ], [ x, y ], [ x, y ], [ x, y ] ]
    ];
    this.position = 0;
  }
};
