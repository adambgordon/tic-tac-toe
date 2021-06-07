

const gameBoard = (() => {
    let counter = 0;
    const _board = [];

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

    const _checkSetForWinner = function (i,j,k) {
        if( _board[i] !== "" && _board[i] === _board[j] && _board[i] === _board[k]) {
            return _board[i];
        }
        return "none";
    };
    

    const _checkSetForOpening = function (newBoard,i,j,k) {
        let sum = newBoard[i] + newBoard[j] + newBoard[k];
        if (sum === 21) {
            if (newBoard[i] === 1) return i;
            if (newBoard[j] === 1) return j;
            if (newBoard[k] === 1) return k;
        }
        return "none";
    }

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

    const _receiveClick = function () {
        if (computer.getMarker() !== "x" && computer.getMarker() !== "o") computer.setMarker("o");
        if (!openAt(this.id)) return;
        updateAt(this.id);
    };

    const _endGame = function (winner) {
        // document.querySelector(".modal").style.display = "block";
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

    const _playAgain = function () {
        // document.querySelector(".modal").style.display = "none";
        document.querySelector(".modal").classList.remove("modal-displayed");
        document.querySelector(".message").remove();
        reset();
    };

    const _selectO = function () {
        if (computer.getMarker() === "x" || computer.getMarker() === "o") return;

        document.querySelector("#x").classList.remove("selected");
        document.querySelector("#o").classList.add("selected");

        computer.setMarker("x");
        setTimeout(computer.move,350);

    }

    const _updateDifficulty = function () {
        computer.setSkillLevel(document.querySelector("#difficulty").value.toLowerCase());
    };

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
        if (counter >=5) {
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

    
    const openAt = function (index) {
        return _board[index] === "";
    };

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

    const print = () => console.log(_board);

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
        console.log(computer.getSkillLevel());
        if (computer.getSkillLevel() === "hard") {
            document.querySelector("#difficulty").selectedIndex = 0;
            _updateDifficulty();
        }
        console.log(computer.getSkillLevel());
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


const Player = function (name) {
    let _skillLevel = "easy";
    let _marker;

    const _randomMove = function () {
        let i;
        do {
            i = Math.floor(Math.random()*9);
        } while (!gameBoard.openAt(i));
        gameBoard.updateAt(i);
    };

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

gameBoard.init();
const computer = Player("computer");