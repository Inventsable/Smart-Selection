var exist = app.documents.length > 0;
var hasSelection = app.selection.length > 0;
var nameRX = /(horizontal)|x/i;

// alignObjects('x', 10)
// alignObjects('horizontal');
// alignObjects('Horizontal', 4);

// alignObjects('y');
// alignObjects('vertical');
// alignObjects('Vertical', 10);

function alignObjects() {
  if (exist && hasSelection) {

    // Get the [x1, y1, x2, y2] array for the bounding box of our current selection
    var fullRect = getBounds(app.selection);
    // Centerpoint positions for total selection is width/2 or height/2:
    var verticalMidpoint = (fullRect[2] - fullRect[0])/2;
    var horizontalMidpoint = (fullRect[3] - fullRect[1])/2;

    // declare our offsets
    var lastXOffset, lastYOffset;

    // Resort our selection from left-right or top-down, in case selected out of order
    var selector = (/(horizontal)|x/i.test(arguments[0])) ? 'x' : 'y' ;
    var selection = orderByPosition(selector);

    // iterate through each item in our selection
    for (var i = 0; i < selection.length; i++) {
      // the current item is
      var target = selection[i];

      // declare transform properties
      var xPos, yPos;
      var width = target.width;
      var height = target.height;

      // Offset should be zero at first or when distribute isn't needed
      if ((i < 1) || (arguments.length == 1)) {
        lastXOffset = 0;
        lastYOffset = 0;
      } else {
        // but calculate position by total previous width/height plus an offset number:
        if (/(horizontal)|x/i.test(arguments[0])) {
          // horizontal adds previous item's width plus number from function and itself (previous value)
          lastXOffset = lastXOffset + selection[i-1].width + arguments[1];
        } else {
          // vertical adds previous height plus offset plus itself
          lastYOffset = lastYOffset + selection[i-1].height + arguments[1];
        }
      }

      // So if horizontal
      if (/(horizontal)|x/i.test(arguments[0])) {
        // and has two parameters (to distribute)
        if (arguments.length > 1) {
          // then the x position is the selection box's start/left plus the previous total width of our loop
          xPos = fullRect[0] + lastXOffset;
        } else {
          // but if only one parameter, keep the original x position
          xPos = target.geometricBounds[0];
        }
        // Now align -- y position is the selection box's midpoint plus half this item's height (align to it's center)
        target.position = [xPos, horizontalMidpoint + (height/2)]
      } else {
        // otherwise if vertical and distribute
        if (arguments.length > 1) {
          // y position is selection box top minus total height of loop
          yPos = fullRect[1] - lastYOffset;
        } else {
          // but if vertical and align without distribute, keep the original y
          yPos = target.geometricBounds[1];
        }
        // Align every x position to center of selection minus half this item's width, it's own center
        target.position = [verticalMidpoint - (width/2), yPos]
      }
    }
  }
}

function orderByPosition(param) {
  var minX = [], minY = [];
  for (var e = 0; e < app.selection.length; e++) {
    minX.push( app.selection[e].geometricBounds[0] );
    minY.push( app.selection[e].geometricBounds[1] );
  }
  if (/x/i.test(param)) {
    minX.sort(sortOrder);
  } else {
    minY.sort(sortOrder);
  }
  var sortedSelection = [], mirror = [], targ;
  for (var i = 0; i < minX.length; i++) {
    for (var u = 0; u < app.selection.length; u++) {
      if (/x/i.test(param)) {
        targ = app.selection[u].geometricBounds[0] == minX[i];
      } else {
        targ = app.selection[u].geometricBounds[1] == minY[i];
      }
      if (targ) {
        sortedSelection.push(app.selection[u])
        break;
      }
    }
  }
  return sortedSelection;
}

function sortOrder(a, b) {
  return (a - b)
}

// Alexander Ladygin
// https://forums.adobe.com/message/8582018#8582018
function getBounds ( arr, bounds ) {
    var x1 = [], y1 = [], x2 = [], y2 = [],
        bounds = bounds || 'geometricBounds';
    for ( var i = 0; i < arr.length; i++ ) {
        x1.push( arr[i][bounds][0] );
        y1.push( arr[i][bounds][1] );
        x2.push( arr[i][bounds][2] );
        y2.push( arr[i][bounds][3] );
    }
    x1 = Math.min.apply( null, x1 );
    y1 = Math.max.apply( null, y1 );
    x2 = Math.max.apply( null, x2 );
    y2 = Math.min.apply( null, y2 );
    return rect = [ x1, y1, x2, y2 ];
};
