

const gameBoard = (() => {
    let counter = 0;
    const _board = [];

    const _checkSet = function (i,j,k) {
        if( _board[i] !== "" && _board[i] === _board[j] && _board[i] === _board[k]) {
            return _board[i];
        }
        return "none";
    }

    const _winner = function () {
        let win = _checkSet(0,1,2);
        if (win !== "none") return win;
        win = _checkSet(3,4,5);
        if (win !== "none") return win;
        win = _checkSet(6,7,8);
        if (win !== "none") return win;
        win = _checkSet(0,3,6);
        if (win !== "none") return win;
        win = _checkSet(1,4,7);
        if (win !== "none") return win;
        win = _checkSet(2,5,8);
        if (win !== "none") return win;
        win = _checkSet(0,4,8);
        if (win !== "none") return win;
        win = _checkSet(2,4,6);
        return win;
    }

    const _receiveClick = function () {
        if (!openAt(this.id)) return;
        updateAt(this.id);
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
        document.querySelector(`[id="${index}"`).textContent = newValue.toUpperCase();

        if (counter >=5) {
            const win = _winner();
            if (win !== "none") {
                setTimeout(() => {alert(win + " wins!")}, 0);
                return;
            }
        }

        if (newValue === "x" && counter < 9) {
            player2.move();
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
            document.querySelector(".board-wrapper").appendChild(space);
        }
        document.querySelector("#reset").addEventListener("click",reset);
    };

    const print = () => console.log(_board);

    const reset = function() {
        counter = 0;
        let i = 0;
        document.querySelectorAll(".space").forEach( (space) => {
            space.textContent = "";
            _board[i++] = "";
        });
    };

    return {
        init,
        print,
        reset,
        openAt,
        updateAt,
    };
})();


const Player = function (name) {
    const getName = function () {
        return name;
    };
    const move = function () {
        let i;
        do {
            i = Math.floor(Math.random()*9);
            console.log(i);
        } while (!gameBoard.openAt(i));
        gameBoard.updateAt(i);
    };
    return {getName, move};
};

gameBoard.init();

const player1 = Player("person guy");
const player2 = Player("computer computer");
console.log(player1.getName());
console.log(player2.getName());