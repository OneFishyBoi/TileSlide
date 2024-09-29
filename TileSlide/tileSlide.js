
var rows = 3;
var collumns = 3;
var blankTile;
var slides = 0;
var imgOrder = shuffle()
// var imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
var complete = false

window.onload = function () {
    // load tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < collumns; c++) {
            // creating tag in format <img id="0-0" src="1.jpg">
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            let num = imgOrder.shift()
            tile.src = num + ".jpg";

            // updating pos of blank tile
            if (num == '9') {
                blankTile = tile
            }

            // adding click functionality
            tile.addEventListener("click", shift)

            // adding element to page
            document.getElementById("board").append(tile);

        }
    }
}

// creates a randomly shuffled list from 1-9
function shuffle() {
    let randOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    let currentIndex = randOrder.length;

    do {
        // picks a random item in the list by index
        let randomIndex = Math.floor(Math.random() * currentIndex);
        if (currentIndex > 0) {
            currentIndex--;
        }

        // swaps the item at the current index with the selected one
        [randOrder[currentIndex], randOrder[randomIndex]] = [randOrder[randomIndex], randOrder[currentIndex]];

    } while (!(currentIndex != 0 && isSolvable(randOrder)));

    return randOrder;
}

// checks if the order given is a solvable puzzle
function isSolvable(randOrder) {
    // changing all items to ints
    for (item in randOrder) {
        item = parseInt(item)
    }

    // looping through each item and checking how many items ahaed of it in the list are lower value
    // (likely could have done this better using a hashmap however due to the scale i don't really care)
    let inversions = 0;
    for (let i = 0; i < randOrder.length - 1; i++) {
        if (randOrder[i] == 9) {
            continue;
        }

        for (let j = i + 1; j < randOrder.length; j++) {
            if (randOrder[j] < randOrder[i]) {
                inversions++;
            }
        }
    }

    // checking if valid num of inversions returning result
    if (inversions % 2 == 0) {
        return true;
    } else {
        return false;
    }
}

// swaps two tiles if certain conditions are met
function shift() {
    // stops movement if puzzle already complete
    if (complete) {
        return;
    }

    // check if current tile is blank tile
    let currTile = this;
    if (currTile == blankTile) {
        return;
    }

    // getting coords of tiles being swapped
    currX = currTile.id.charAt(0);
    currY = currTile.id.charAt(2);
    blankX = blankTile.id.charAt(0);
    blankY = blankTile.id.charAt(2);

    // checking if adjacent
    if ((Math.abs(currX - blankX) == 1 && currY == blankY) || (Math.abs(currY - blankY) == 1 && currX == blankX)) {
        // swapping img srcs
        let tempTileSrc = currTile.src.toString();
        currTile.src = blankTile.src;
        blankTile.src = tempTileSrc;

        // changing the blank tile pos
        blankTile = currTile;

        // incrementing slides counter
        slides++;
        document.getElementById("slides").innerHTML = slides.toString();
    }

    completeCheck()
}

function completeCheck() {
    complete = true;
    // checking if each tile is complete
    // if a tile is correct the src num == 3r + (c+1)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < collumns; c++) {
            // getting the tile based on position
            let currTile = document.getElementById(r.toString() + "-" + c.toString());

            // checking if the pos matches the img
            if (!(currTile.src.charAt(currTile.src.length - 5) == (3 * r + c + 1).toString())) {
                complete = false;
                return;
            }
        }
    }

    // telling user they have completed puzzle
    window.alert("You have completed the puzzle in: " + slides + " slides")
}