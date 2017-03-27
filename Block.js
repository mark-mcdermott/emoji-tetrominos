// Block class
// Using letter names for blocks, see http://i.imgur.com/9Z0oJXe.png
//
// All block movement/collision calculated from block coordiates.
// Blocks are made of 4 "pixels"
// First block "pixel" is bottom left pixel.
// Subsequent ones are calculated from first pixel

function getCoords(x, y, rotation)
{
  let coords = [];
  const rows = rotation.length;
  const cols = rotation[0].length;
  for (let row in rows)
  {
    for (let col in cols)
    {
      coords[col][row] = [ x + col, y + row ];
    }
  }
  return coords;
}

module.exports = class Block {

  constructor(letter, x, y)
  {
    this._letter = letter.toUpperCase();
    this[`_init${this._letter}`](x, y);
  }

  _initI(x, y)
  {
    this.height = 1;      // block height (used for floor collision math)
    this.width = 4;       // block width (used for side wall collision math)
    this.numPix = 4;      // this is num pixels in this block
    this.rotations = [    // the different possible rotations of this block

      [ [ 1, 1, 1, 1 ] ],

      [ [ 1 ],
        [ 1 ],
        [ 1 ],
        [ 1 ] ]

    ];
    this.curRotation = 0;
    this.coords = getCoords(x, y, this.rotations[this.curRotation]);
  }

};
