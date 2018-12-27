export const listLife = {

  actualState: [],
  redrawList: [],


  /**
   *
   */
  init: function () {
    this.actualState = [];
  },


  /**
   *
NOTE: The following code is slower than the used one.

(...)

if (allDeadNeighbours[key] === undefined) {
allDeadNeighbours[key] = {
  x: deadNeighbours[m][0],
  y: deadNeighbours[m][1],
  i: 1
};
} else {
allDeadNeighbours[key].i++;
}

(...)

// Process dead neighbours
for (key in allDeadNeighbours) {

if (allDeadNeighbours[key].i === 3) { // Add new Cell

this.addCell(allDeadNeighbours[key].x, allDeadNeighbours[key].y, newState);
alive++;
this.redrawList.push([allDeadNeighbours[key].x, allDeadNeighbours[key].y, 1]);
}
}
*/
  nextGeneration: function () {
    var x, y, i, j, m, n, key, t1, t2, alive = 0, neighbours, deadNeighbours, allDeadNeighbours = {}, newState = [];
    this.redrawList = [];

    for (i = 0; i < this.actualState.length; i++) {
      this.topPointer = 1;
      this.bottomPointer = 1;

      for (j = 1; j < this.actualState[i].length; j++) {
        x = this.actualState[i][j];
        y = this.actualState[i][0];

        // Possible dead neighbours
        deadNeighbours = [[x - 1, y - 1, 1], [x, y - 1, 1], [x + 1, y - 1, 1], [x - 1, y, 1], [x + 1, y, 1], [x - 1, y + 1, 1], [x, y + 1, 1], [x + 1, y + 1, 1]];

        // Get number of live neighbours and remove alive neighbours from deadNeighbours
        neighbours = this.getNeighboursFromAlive(x, y, i, deadNeighbours);

        // Join dead neighbours to check list
        for (m = 0; m < 8; m++) {
          if (deadNeighbours[m] !== undefined) {
            key = deadNeighbours[m][0] + ',' + deadNeighbours[m][1]; // Create hashtable key

            if (allDeadNeighbours[key] === undefined) {
              allDeadNeighbours[key] = 1;
            } else {
              allDeadNeighbours[key]++;
            }
          }
        }

        if (!(neighbours === 0 || neighbours === 1 || neighbours > 3)) {
          this.addCell(x, y, newState);
          alive++;
          this.redrawList.push([x, y, 2]); // Keep alive
        } else {
          this.redrawList.push([x, y, 0]); // Kill cell
        }
      }
    }

    // Process dead neighbours
    for (key in allDeadNeighbours) {
      if (allDeadNeighbours[key] === 3) { // Add new Cell
        key = key.split(',');
        t1 = parseInt(key[0], 10);
        t2 = parseInt(key[1], 10);

        this.addCell(t1, t2, newState);
        alive++;
        this.redrawList.push([t1, t2, 1]);
      }
    }

    this.actualState = newState;

    return alive;
  },


  topPointer: 1,
  middlePointer: 1,
  bottomPointer: 1,

  /**
         *
         */
  getNeighboursFromAlive: function (x, y, i, possibleNeighboursList) {
    var neighbours = 0, k;

    // Top
    if (this.actualState[i - 1] !== undefined) {
      if (this.actualState[i - 1][0] === (y - 1)) {
        for (k = this.topPointer; k < this.actualState[i - 1].length; k++) {

          if (this.actualState[i - 1][k] >= (x - 1)) {

            if (this.actualState[i - 1][k] === (x - 1)) {
              possibleNeighboursList[0] = undefined;
              this.topPointer = k + 1;
              neighbours++;
            }

            if (this.actualState[i - 1][k] === x) {
              possibleNeighboursList[1] = undefined;
              this.topPointer = k;
              neighbours++;
            }

            if (this.actualState[i - 1][k] === (x + 1)) {
              possibleNeighboursList[2] = undefined;

              if (k == 1) {
                this.topPointer = 1;
              } else {
                this.topPointer = k - 1;
              }

              neighbours++;
            }

            if (this.actualState[i - 1][k] > (x + 1)) {
              break;
            }
          }
        }
      }
    }

    // Middle
    for (k = 1; k < this.actualState[i].length; k++) {
      if (this.actualState[i][k] >= (x - 1)) {

        if (this.actualState[i][k] === (x - 1)) {
          possibleNeighboursList[3] = undefined;
          neighbours++;
        }

        if (this.actualState[i][k] === (x + 1)) {
          possibleNeighboursList[4] = undefined;
          neighbours++;
        }

        if (this.actualState[i][k] > (x + 1)) {
          break;
        }
      }
    }

    // Bottom
    if (this.actualState[i + 1] !== undefined) {
      if (this.actualState[i + 1][0] === (y + 1)) {
        for (k = this.bottomPointer; k < this.actualState[i + 1].length; k++) {
          if (this.actualState[i + 1][k] >= (x - 1)) {

            if (this.actualState[i + 1][k] === (x - 1)) {
              possibleNeighboursList[5] = undefined;
              this.bottomPointer = k + 1;
              neighbours++;
            }

            if (this.actualState[i + 1][k] === x) {
              possibleNeighboursList[6] = undefined;
              this.bottomPointer = k;
              neighbours++;
            }

            if (this.actualState[i + 1][k] === (x + 1)) {
              possibleNeighboursList[7] = undefined;

              if (k == 1) {
                this.bottomPointer = 1;
              } else {
                this.bottomPointer = k - 1;
              }

              neighbours++;
            }

            if (this.actualState[i + 1][k] > (x + 1)) {
              break;
            }
          }
        }
      }
    }

    return neighbours;
  },


  /**
   *
   */
  isAlive: function (x, y) {
    var i, j;

    for (i = 0; i < this.actualState.length; i++) {
      if (this.actualState[i][0] === y) {
        for (j = 1; j < this.actualState[i].length; j++) {
          if (this.actualState[i][j] === x) {
            return true;
          }
        }
      }
    }
    return false;
  },


  /**
   *
   */
  removeCell: function (x, y, state) {
    var i, j;

    for (i = 0; i < state.length; i++) {
      if (state[i][0] === y) {

        if (state[i].length === 2) { // Remove all Row
          state.splice(i, 1);
        } else { // Remove Element
          for (j = 1; j < state[i].length; j++) {
            if (state[i][j] === x) {
              state[i].splice(j, 1);
            }
          }
        }
      }
    }
  },


  /**
   *
   */
  addCell: function (x, y, state) {
    if (state.length === 0) {
      state.push([y, x]);
      return;
    }

    var k, n, m, tempRow, newState = [], added;

    if (y < state[0][0]) { // Add to Head
      newState = [[y, x]];
      for (k = 0; k < state.length; k++) {
        newState[k + 1] = state[k];
      }

      for (k = 0; k < newState.length; k++) {
        state[k] = newState[k];
      }

      return;

    } else if (y > state[state.length - 1][0]) { // Add to Tail
      state[state.length] = [y, x];
      return;

    } else { // Add to Middle

      for (n = 0; n < state.length; n++) {
        if (state[n][0] === y) { // Level Exists
          tempRow = [];
          added = false;
          for (m = 1; m < state[n].length; m++) {
            if ((!added) && (x < state[n][m])) {
              tempRow.push(x);
              added = !added;
            }
            tempRow.push(state[n][m]);
          }
          tempRow.unshift(y);
          if (!added) {
            tempRow.push(x);
          }
          state[n] = tempRow;
          return;
        }

        if (y < state[n][0]) { // Create Level
          newState = [];
          for (k = 0; k < state.length; k++) {
            if (k === n) {
              newState[k] = [y, x];
              newState[k + 1] = state[k];
            } else if (k < n) {
              newState[k] = state[k];
            } else if (k > n) {
              newState[k + 1] = state[k];
            }
          }

          for (k = 0; k < newState.length; k++) {
            state[k] = newState[k];
          }

          return;
        }
      }
    }
  }

}