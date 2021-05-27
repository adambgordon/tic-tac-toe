let counter = 0;

// const spaceFactory = (index, value) => {
//     return {index, value};
// };


const gameBoard = (() => {
    const _board = [];
    const _update = () => {
        console.log(this.id);
    };
    const init = () => {
        const wrapper = document.querySelector(".board-wrapper");
        for (let i = 0; i < 9; i++) {
            _board[i] = "-";
            const space = document.createElement("div");
            space.id = i;
            space.addEventListener("click",_update);
            space.textContent = _board[i];
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
