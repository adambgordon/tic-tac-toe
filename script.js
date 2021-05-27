

const gameBoard = (() => {
    let counter;
    const _board = [];

    const _update = function() {
        if (_board[this.id] !== "") return;
        let newValue;
        if (counter%2 === 0) {
             newValue = "x";
        } else {
            newValue = "o";
        }
        _board[this.id] = newValue;
        this.textContent = newValue.toUpperCase();
        counter++;
    }

    const init = () => {
        counter = 0;
        for (let i = 0; i < 9; i++) {
            _board[i] = "";
            const space = document.createElement("div");
            space.id = i;
            space.addEventListener("click",_update);
            space.textContent = _board[i];
            space.classList.add("space");
            document.querySelector(".board-wrapper").appendChild(space);
        }
        document.querySelector("#reset").addEventListener("click",reset);
    }

    const print = () => console.log(_board);

    const reset = function() {
        let i = 0;
        document.querySelectorAll(".space").forEach( (space) => {
            space.textContent = "";
            _board[i++] = "";
        });
    }

    return {
        init,
        print,
        reset
    };
})();


const Player = function (name) {
    const getName = function () {
        return name;
    }
    return {getName};
}

gameBoard.init();

const player1 = Player("person guy");
const player2 = Player("computer computer");
console.log(player1.getName());
console.log(player2.getName());