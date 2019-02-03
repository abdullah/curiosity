class Rover {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.direction = "N";
  }

  toString() {
    return `${this.name} x${this.x + 1} y${this.y + 1}`;
  }
}

class RoverManager {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.rovers = [];

    this.render();
  }

  addRover(x, y, name) {
    if (x > this.x || x < 0 || y > this.y || y < 0) {
      console.warn(`Out of the range ${this.x}X${this.y}`);

      return;
    }

    const hasRoverOnPosition = this.rovers.find(r => r.x === x && r.y === y);
    if (!hasRoverOnPosition) {
      this.rovers.push(new Rover(x, y, name));
      this.render();
    } else {
      console.warn("There is a rover");
    }
  }

  getRover(name) {
    return this.rovers.find(r => r.name === name);
  }

  render() {
    const mars = document.querySelector("#mars");
    mars.innerHTML = "";

    function createRow() {
      const row = document.createElement("div");
      row.classList.add("row");
      return row;
    }

    function createColWithRover(rover) {
      const col = document.createElement("div");
      col.classList.add("col");
      if (rover) {
        col.classList.add(`direction-${rover.direction}`);
        col.innerHTML = rover.toString();
        col.dataset.name = rover.name;
      }
      return col;
    }

    for (let ii = 0; ii < this.y; ii++) {
      const row = createRow();
      for (let jj = 0; jj < this.x; jj++) {
        const rover = this.rovers.find(r => r.y === ii && r.x === jj);

        row.appendChild(createColWithRover(rover));
      }
      mars.appendChild(row);
    }
  }

  move(rover) {
    let x = rover.x;
    let y = rover.y;
    switch (rover.direction) {
      case "W":
        x--;
        break;
      case "E":
        x++;
        break;
      case "N":
        y--;
        break;
      case "S":
        y++;
        break;

      default:
        break;
    }

    const isInArea = x >= 0 && x < this.x && y >= 0 && y < this.y;
    const hasConflict = this.rovers.find(r => r.x === x && r.y === y);
    if (isInArea && !hasConflict) {
      rover.x = x;
      rover.y = y;
      return true;
    } else {
      const roverElement = document.querySelector(
        `[data-name="${rover.name}"]`
      );
      roverElement.classList.add("animated");
      roverElement.classList.add("shake");
      console.warn("Out of the box or conflict");
      return false;
    }
  }

  sendCommands(name, commands) {
    const currentRover = this.rovers.find(r => r.name === name);

    const directionsR = {
      N: "E",
      W: "N",
      E: "S",
      S: "W"
    };

    const directionsL = {
      N: "W",
      W: "S",
      S: "E",
      E: "N"
    };

    commands.split("").forEach(command => {
      switch (command) {
        case "R":
          currentRover.direction = directionsR[currentRover.direction];
          this.render();
          break;
        case "L":
          currentRover.direction = directionsL[currentRover.direction];
          this.render();
          break;
        case "M":
          if (this.move(currentRover)) {
            this.render();
          }
          break;

        default:
          break;
      }
    });
  }
}

const rm = new RoverManager(10, 5);

rm.addRover(1, 2, "sprit");
rm.addRover(2, 2, "opportunity");
rm.addRover(1, 3, "sojourner");

rm.sendCommands("opportunity", "L");
rm.sendCommands("sojourner", "L");
rm.sendCommands("sprit", "LL");

let currentRoverName = "";
const nameIndicator = document.querySelector(".current-rover-name");

document.addEventListener("click", e => {
  const col = e.target.closest(".col");

  if (col && col.dataset.name) {
    currentRoverName = col.dataset.name;
    nameIndicator.innerHTML = `Current rover: ${currentRoverName}`;
  }
});

document.addEventListener("keydown", e => {
  if (!currentRoverName) {
    nameIndicator.innerHTML = "Please select a rover";
    return;
  }

  if (e.keyCode === 37 /* left */) {
    rm.sendCommands(currentRoverName, "L");
  }
  if (e.keyCode === 38 /* up */) {
    rm.sendCommands(currentRoverName, "M");
  }
  if (e.keyCode === 39 /* right */) {
    rm.sendCommands(currentRoverName, "R");
  }
});

///////////////////////////////////
/// FANTASY ///////////////////////////////////
///////////////////////////////////

// rm.addRover(5, 5, "sojourner");
// rm.addRover(4, 4, "pathfinder");

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function asyncForEach(array, callback) {
//   for (let index = 0; index < array.length; index++) {
//     await callback(array[index], index, array);
//   }
// }

// asyncForEach("MMMMRMMMMRMMMMRRRMMMMMMMMMM".split(""), async cmd => {
//   await sleep(100);
//   rm.sendCommands("sojourner", cmd);
// });

// asyncForEach("MMMMMMMLLLLRMRLRMLMRLMRL".split(""), async cmd => {
//   await sleep(300);

//   rm.sendCommands("pathfinder", cmd);
// });
