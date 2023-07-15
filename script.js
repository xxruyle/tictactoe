
const gameBoard = ( () => {
    let board = [[' ', ' ', ' '],
                 [' ', ' ', ' '],
                 [' ', ' ', ' '],
                ]


    const boardClear = () => {
        for (let i = 0; i < board.length; i++) 
        {
            for (let j = 0; j < board[i].length; j++) 
            {
                board[i][j] = ' '; 
            }
        }
    }

    return {board, boardClear};  
} ) (); 

const player = (type, name) => {
    return {type, name}; 
}

playerX = player("X", "Player1"); 

playerO = player("O", "Player2");   


const gameController = (() => {
    let player1 = playerX; 
    let player2 = playerO; 

    let currentPlayer = player1; 

    let {board, boardClear} = gameBoard; 

    let isRunning = false; 


    let getCurrentMoveType = () => {
        return currentPlayer; 
    }


    let nextRound = () => {
        currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1; 
    }

    let checkWin = () => {
        // horizontals 
        for (let i = 0; i < 3; i++) 
        {
            if (board[i][0] !== " " && board[i][0] === board[i][1] && board[i][0] === board[i][2]) 
            {
                return board[i][0]; 
            }
        }

        // columns 
        for (let j = 0; j < 3; j++) 
        {

            if (board[0][j] !== " " && board[0][j] === board[1][j] && board[0][j] === board[2][j]) 
            {
                return board[0][j]; 
            }
        }

        // diagonals 
        if (board[0][0] !== " " && board[0][0] === board[1][1] && board[0][0] === board[2][2]) 
        {
            if (board[0][0] === " ")
            {
                return false; 
            }

            return board[0][0]; 
        }
        if (board[0][2] !== " " && board[0][2] === board[1][1] && board[0][2] === board[2][0] )
        {


            return board[0][2]; 
        }

        return false; 
    }

    let checkTie = () => {
        for (let i = 0; i < board.length; i++) 
        {
            for (let j = 0; j < board[i].length; j++) 
            {
                if (board[i][j] === ' ')  
                {
                    return false 
                }
            }
        }

        return true; // if all of the squares are non empty then it is a tie 
    }


    return {getCurrentMoveType, nextRound, board, boardClear, checkWin, checkTie, isRunning}; 

})(); 


const displayController = ( () => {
    const boardContainer = document.querySelector('.board-container'); 
    const squares = document.querySelectorAll('.square'); 
    const message = document.querySelector('.message'); 
    const form = document.querySelector('#playerNames'); 

    const restart = document.querySelector('#restart'); 
    


    let {getCurrentMoveType, nextRound, board, boardClear, checkWin, checkTie, isRunning} = gameController; 

    const updateBoardDom = () => {
        for (let i = 0; i < board.length; i++) 
        {
            const row = boardContainer.querySelector(`.row[data-id="${i}"]`); 
            for (let j = 0; j < board[i].length; j++) 
            {
                const col = row.querySelector(`.square[data-id="${j}"]`); 
                col.textContent = board[i][j].type; 
            }
        }
    }

    const displayWin = (winningPlayer) => {
        message.textContent = `${winningPlayer.name} Wins!`; 
    }

    const displayTie = () => {
        message.textContent = "Cat's game!";
    }

    // changes board and returns true if a valid move was made 
    const changeBoard = (col, row) => { 
        if (board[row][col] === ' ')  {
            board[row][col] = getCurrentMoveType(); 
            updateBoardDom();
            nextRound(); 
            let result = checkWin(); 
            if (result) // if the result was a win 
            {
                displayWin(result); 
                isRunning = false; 
                return 
            }
            tieResult = checkTie();  
            if (tieResult)   
            {
                displayTie(); 
                return  
            }

            return 
        }

    }


    const handleBoardChanges = (event) => {
        const col = event.target.dataset['id']; 
        const row = event.target.parentNode.dataset['id']; 
        changeBoard(col, row);  
    }

    const getSquareEvents = (square) => {
        square.addEventListener('click', handleBoardChanges)
    }
   
    const detectForm = () => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const player1Name = form.elements['player1_name'].value; 
            const player2Name = form.elements['player2_name'].value;  
            
            playerX.name = player1Name; 
            playerO.name = player2Name; 

            message.textContent = "Game in progress"; 
            isRunning = true; 


        })
    }

    const resetEverything = () => {
        message.textContent = "Enter info to start playing!"; 
        isRunning = false;  
        playerX.name = "Player1"; 
        playerO.name = "Player2";  

        boardClear(); 
        updateBoardDom(); 
    }

    const detectRestart = () => {
        restart.addEventListener('click', resetEverything); 
    }



    const detectClick = () => {
        if (isRunning)
        {
            squares.forEach((square) => {
                getSquareEvents(square); 
            }); 

            detectRestart();
        } else {
            detectForm(); 
        }

    }

    return {detectClick};  
}) (); 




window.addEventListener('click', displayController.detectClick); 



