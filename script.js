

const gameBoard = (() => {
    let counter;
    const _board = [];

    const _update = function() {
        let newValue;
        if (counter%2 === 0) {
             newValue = "x";
        } else {
            newValue = "o";
        }
        _board[this.id] = newValue;
        this.textContent = newValue.toUpperCase();
        counter++;
        printBoard();
    }

    const init = () => {
        counter = 0;
        const wrapper = document.querySelector(".board-wrapper");
        for (let i = 0; i < 9; i++) {
            _board[i] = "";
            const space = document.createElement("div");
            space.id = i;
            space.addEventListener("click",_update);
            space.textContent = _board[i];
            space.classList.add("space");
            wrapper.appendChild(space);
        }
    }
    const printBoard = () => console.log(_board);

    return {
        init,
        printBoard,
    };
})();

gameBoard.init();
