var board = function() {
  var tileLocations;
  var boardWidth;
  var padding;
  var pieceWidth;
  var svg;
  var square1;

  var initialize = function(options) {
    if(typeof options.boardWidth === 'undefined') { options.boardWidth = 100; }
    if(typeof options.padding === 'undefined') { options.padding = 5; }
    if(typeof options.tilesPerSide === 'undefined') { options.tilesPerSide = 4; }

    boardWidth = options.boardWidth;
    padding = options.padding;
    pieceWidth = (boardWidth - (padding * (options.tilesPerSide + 1))) / options.tilesPerSide;
    tileLocations = [
      [{value: 2}, {value: 0}, {value: 3}, {value: 0}],
      [{value: 0}, {value: 1}, {value: 0}, {value: 0}],
      [{value: 2}, {value: 0}, {value: 1}, {value: 0}],
      [{value: 0}, {value: 0}, {value: 0}, {value: 1}]
    ];
  };

  var move = function(direction) {
    shiftBoard(direction);
    //addRandomPiece();
  };

  var shiftBoard = function(direction) {
    var i, j, k;
    if(direction === 'down') {
      outerStart = 0;
      outerEnd = function(j) { return j < tileLocations[0].length; };
      innerStart = function(j) { return tileLocations.length - 1; };
      innerEnd = function(i) { return i >= 0;};

    } else if(direction === 'up') {
    } else if(direction === 'left') {
    } else if(direction === 'right') {
      outerStart = 0;
      outerEnd = function(j) { return j < tileLocations.length; };
      innerStart = function(j) { return tileLocations[j].length - 1; };
      innerEnd = function(i) { return i >= 0; };
    }
    if(direction === 'down') {
      for(j = outerStart; outerEnd(j); j++) {
        for(i = innerStart(j); innerEnd(i); i--) {
          if(tileLocations[i][j].value !== 0) {
            for(k = i; k < tileLocations.length - 1; k++) {
              if(tileLocations[k+1][j].value === 0) {
                tileLocations[k+1][j].value = tileLocations[k][j].value;
                tileLocations[k][j].value = 0;
                movePiece({x: j, y: k}, {x: j, y: k+1});
              }
            }
          }
        }
      }
    } else if(direction === 'right') {
      for(j = outerStart; outerEnd(j); j++) {
        for(i = innerStart(j); innerEnd(i); i--) {
          if(tileLocations[j][i].value !== 0) {
            for(k = i; k < tileLocations[j].length - 1; k++) {
              if(tileLocations[j][k+1].value === 0) {
                tileLocations[j][k+1].value = tileLocations[j][k].value;
                tileLocations[j][k].value = 0;
                movePiece({x: k, y: j}, {x: k+1, y: j});
              }
            }
          }
        }
      }
    } else if(direction === 'up') {
      for(j = 0; j < tileLocations[0].length; j++) {
        for(i = 0; i < tileLocations.length; i++) {
          if(tileLocations[i][j].value !== 0) {
            for(k = tileLocations.length - 1; k > 0; k--) {
              if(tileLocations[k-1][j].value === 0) {
                tileLocations[k-1][j].value = tileLocations[k][j].value;
                tileLocations[k][j].value = 0;
                movePiece({x: j, y: k}, {x: j, y: k-1});
              }
            }
          }
        }
      }
    } else if(direction === 'left') {
      for(i = 0; i < tileLocations.length; i++) {
        for(j = 0; j < tileLocations[i].length; j++) {
          if(tileLocations[i][j].value !== 0) {
            for(k = tileLocations[i].length - 1; k > 0; k--) {
              if(tileLocations[i][k-1].value === 0) {
                tileLocations[i][k-1].value = tileLocations[i][k].value;
                tileLocations[i][k].value = 0;
                movePiece({x: k, y: i}, {x: k-1, y: i});
              }
            }
          }
        }
      }
    }
  };

  var movePiece = function(from, direction) {
    if(typeof tileLocations[from.y][from.x].rect !== 'undefined') {
      tileLocations[from.y][from.x].rect
        .transition()
        .attr('x', getLocation(to.x))
        .attr('y', getLocation(to.y));
      tileLocations[to.y][to.x].rect = tileLocations[from.y][from.x].rect;
      tileLocations[from.y][from.x].rect = [];
    }
  };

  var addRandomPiece = function() {

  };

  var drawBoard = function() {
    for(var i = 0; i < tileLocations.length; i++) {
      for(var j = 0; j < tileLocations[i].length; j++) {
        if(tileLocations[i][j].value > 0) {
          tileLocations[i][j].rect = svg.append('rect')
            .style('fill', getColorFromValue(tileLocations[i][j].value))
            .attr('x', getLocation(j))
            .attr('y', getLocation(i))
            .attr('width', pieceWidth)
            .attr('height', pieceWidth);
        }
      }
    }
  };

  var drawBackground = function() {
    var background = svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('fill', '#bbada0');

    for(var i = 0; i < 4; i++) {
      for(var j = 0; j < 4; j++) {
        svg.append('rect')
          .attr('x', getLocation(i))
          .attr('y', getLocation(j))
          .attr('width', pieceWidth)
          .attr('height', pieceWidth)
          .style('fill', 'rgba(238, 228, 218, 0.35)');
      }
    }
  };

  var createSvg = function() {
    svg = d3.select('body')
      .append('svg')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', boardWidth)
      .attr('height', boardWidth);
  };

  var getLocation = function(position) {
    return ((position + 1) * padding) + (position * pieceWidth);
  };

  var getColorFromValue = function(value) {
    var colors = {
      1: '#eee4da',
      2: '#ede0c8',
      3: '#f2b179',
      4: '#f59563',
      5: '#f67c5f',
      6: '#f65e3b',
      7: '#edcf72',
      8: '#edcc61',
      9: '#edc850',
      10: '#edc53f',
      11: 'red'
    };
    return colors[value];
  };

  var setBoard = function(locations) {
    var row = [];
    tileLocations = [];
    for(var i = 0; i < locations.length; i++) {
      for(var j = 0; j < locations[i].length; j++) {
        row.push({value: locations[i][j]});
      }
      tileLocations.push(row);
      row = [];
    }
  };

  var getBoard = function() {
    var simplifiedTileLocations = [];
    var row = [];
    for(var i = 0; i < tileLocations.length; i++) {
      for(var j = 0; j < tileLocations[i].length; j++) {
        row.push(tileLocations[i][j].value);
      }
      simplifiedTileLocations.push(row);
      row = [];
    }
    return simplifiedTileLocations;
  };

  var public = {
    initialize: initialize,
    move: move,
    createSvg: createSvg,
    drawBackground: drawBackground,
    drawBoard: drawBoard
  };

  public._private = {
    shiftBoard: shiftBoard,
    getLocation: getLocation,
    setBoard: setBoard,
    getBoard: getBoard
  };

  return public;
}();