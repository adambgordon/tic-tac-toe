/* MODULES & FUNCTIONS */

// gameBoard module
const gameBoard = (() => {
    let counter = 0;
    const _board = [];

    // indices of all 8 valid sets of 3 spaces
    const _winningSets = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    // returns x, o, or none the given set of three spaces is a winning set
    const _checkSetForWinner = function (i,j,k) {
        if( _board[i] !== "" && _board[i] === _board[j] && _board[i] === _board[k]) {
            return _board[i];
        }
        return "none";
    };
    
    // check for a potential winning space given a set of three spaces (using a copy of the board i.e. 10-1-0 space assignments)
    const _checkSetForOpening = function (newBoard,i,j,k) {
        let sum = newBoard[i] + newBoard[j] + newBoard[k];
        if (sum === 21) {
            if (newBoard[i] === 1) return i;
            if (newBoard[j] === 1) return j;
            if (newBoard[k] === 1) return k;
        }
        return "none";
    }

    // finds a potential winning space cycling through the entire board
    const _findOpening = function (newBoard) {
        let openSpace;
        let a;
        let b;
        let c;
        for (let i = 0; i < _winningSets.length; i++) {
            a = _winningSets[i][0];
            b = _winningSets[i][1];
            c = _winningSets[i][2];
            openSpace = _checkSetForOpening(newBoard,a,b,c);
            if (openSpace !== "none") return openSpace;
        }
        return openSpace;
    }

    // checks the whole board for a winning set, returning x, o, or none
    const _winner = function () {
        let winner;
        let a;
        let b;
        let c;
        for (let i = 0; i < _winningSets.length; i++) {
            a = _winningSets[i][0];
            b = _winningSets[i][1];
            c = _winningSets[i][2];
            winner = _checkSetForWinner(a,b,c);
            if (winner !== "none") return winner;
        }
        return winner;
    };

    // receives user click on a space
    const _receiveClick = function () {
        if (computer.getMarker() !== "x" && computer.getMarker() !== "o") computer.setMarker("o");
        if (!openAt(this.id)) return;
        updateAt(this.id);
    };

    // ends the game and displays modal dialog box
    const _endGame = function (winner) {
        document.querySelector(".modal").classList.add("modal-displayed");
        const message = document.createElement("div");
        message.classList.add("message");
        if (winner === "none") {
            message.textContent = "Tie";
        } else {
            message.textContent = winner.toUpperCase() + " wins!";
        }
        const modalBox = document.querySelector(".modal-box");
        modalBox.insertBefore(message,modalBox.firstElementChild);
    };

    // closes modal dialog and resets the board
    const _playAgain = function () {
        reset();
        document.querySelector(".modal").classList.remove("modal-displayed");
        document.querySelector(".message").remove();
    };

    // function called when user chooses "o" at the start of the game
    // and calls computer to make first move as "x"
    const _selectO = function () {
        if (computer.getMarker() === "x" || computer.getMarker() === "o") return;

        document.querySelector("#x").classList.remove("selected");
        document.querySelector("#o").classList.add("selected");

        computer.setMarker("x");
        setTimeout(computer.move,350);

    }

    // changes computer diffuculty setting
    const _updateDifficulty = function () {
        computer.setSkillLevel(document.querySelector("#difficulty").value.toLowerCase());
    };

    // returns the potential winning open space on the board for the given player ("x" or "o").
    // note: this function builds a copy of the game board, replacing
    // player spaces with 10's, open spaces with 1's, and opponent space with 0's
    // allowing the _findOpening function to look for sets totaling 21.
    // This both keeps the function agnostic to "x" or "o" instead relying on the parameter when called
    // and keeps the function agnostic to set order (e.g. x-x vs. xx- vs. -xx).
    const winningSpace = function (playerChar) {
        const newBoard = _board.slice();
        for (let i = 0; i < _board.length; i++) {
            if(_board[i] === playerChar) {
                newBoard[i] = 10;
            } else if (_board[i] === "") {
                newBoard[i] = 1;
            } else {
                newBoard[i] = 0;
            }
        }
        return _findOpening(newBoard);
    };

    // updates the game board at a given index.
    // a counter is built-in to ensure moves alternate between x and o
    const updateAt = function (index) {
        let newValue;
        if (counter%2 === 0) {
             newValue = "x";
        } else {
            newValue = "o";
        }
        counter++;
        _board[index] = newValue;
        const space = document.querySelector(`[id="${index}"`);
        space.textContent = newValue.toUpperCase();
        space.classList.add("marked");
        if (counter >=5) { // winning in less than 5 combined moves is impossible -> saves computation and memory
            const winner = _winner();
            if (winner !== "none" || counter === 9) {
                setTimeout(function(){_endGame(winner)},500);
                return;
            }
        }
        if (newValue !== computer.getMarker() && counter < 9) {
            setTimeout(computer.move,350);
        }
    };

    // returns boolean if space is open
    const openAt = function (index) {
        return _board[index] === "";
    };

    // initializes the gameBoard module (builds spaces and adds listeners)
    const init = () => {
        counter = 0;
        for (let i = 0; i < 9; i++) {
            _board[i] = "";
            const space = document.createElement("div");
            space.id = i;
            space.addEventListener("click",_receiveClick);
            space.textContent = _board[i];
            space.classList.add("space");
            document.querySelector(".board").appendChild(space);
        }
        document.querySelector("#reset").addEventListener("click",reset);
        document.querySelector("#play-again").addEventListener("click",_playAgain);
        document.querySelector("#o").addEventListener("click",_selectO);
        document.querySelector("#difficulty").onchange = _updateDifficulty;
    };

    // helper function to log board array to console
    const print = () => console.log(_board);

    // resets the game baord by clearing all spaces in both the array and DOM
    // also clears games settings and added classes as necessary
    const reset = function() {
        counter = 0;
        let i = 0;
        document.querySelectorAll(".space").forEach( (space) => {
            space.textContent = "";
            if(space.classList.contains("marked")) space.classList.remove("marked");
            _board[i++] = "";
        });
        if (computer.getMarker() === "x") {
            document.querySelector("#o").classList.remove("selected");
            document.querySelector("#x").classList.add("selected");
        }
        computer.setMarker("");
        // if (computer.getSkillLevel() === "hard") {
        //     document.querySelector("#difficulty").selectedIndex = 0;
        //     _updateDifficulty();
        // }
    };

    return {
        init,
        print,
        reset,
        openAt,
        updateAt,
        winningSpace
    };
})();


// player factory function
// (only ended up making computer player object for simplicity)
const Player = function (name) {
    let _skillLevel = "easy";
    let _marker;

    // player (computer) moves to random open space
    const _randomMove = function () {
        let i;
        do {
            i = Math.floor(Math.random()*9);
        } while (!gameBoard.openAt(i));
        gameBoard.updateAt(i);
    };

    // player moves to "smart" open space, priority being:
    // 1 - an open winning space for the player (computer)
    // 2 - an open winning space for the opponent
    // 3 - a random open space
    const _smartMove = function () {
        let i = gameBoard.winningSpace("o");


        if (i !== "none") {
            gameBoard.updateAt(i);
        } else {
            i = gameBoard.winningSpace("x");
            if (i !== "none") {
                gameBoard.updateAt(i);
            } else {
                _randomMove();
            }
        }
    };

    const getName = function () {
        return name;
    };
    const getMarker = function () {
        return _marker;
    };
    const setMarker = function (marker) {
        _marker = marker;
    };
    const getSkillLevel = function () {
        return _skillLevel;
    };
    const setSkillLevel = function (newSkillLevel) {
        _skillLevel = newSkillLevel;
    };

    // makes the move based on chosen skill level
    const move = function () {
        if (getSkillLevel() === "hard") {
            _smartMove();
        } else {
            _randomMove();
        }
    };
    
    return {
        getName,
        move,
        getMarker,
        setMarker,
        getSkillLevel,
        setSkillLevel
    };
};

/* MAIN CODE */

gameBoard.init();
const computer = Player("computer");