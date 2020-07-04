//Known bugs...
//changing names when changing starting player arrow.
//showing AI name.

//The word coordinate is used throughout this codebase. It is referencing a specific place. Like coordinates on a map. Not coordinate as in work together.

//Prototype for playerX and playerO.
const player = (name, piece) => {
    let winCount = 0;
    const addWin = () => winCount++;
    const updateName = newName => name = newName;
    const getWinCount = () => winCount;
    const getName = () => name;
    const getPiece = () => piece;
    return {addWin, updateName, getWinCount, getName, getPiece};
}

//Adds or removes grey background highlight. Also reverses flexDirection.
const changeGUI = (() => {  
    const removeHighlightPlayer = id => document.getElementById(id).style.backgroundColor = 'transparent';
    const addHighlightPlayer = id => document.getElementById(id).style.backgroundColor = 'lightgrey';
    const addHighlightAll = e => document.querySelectorAll(`.${e.target.classList.item(1)}`).forEach(object => object.style.backgroundColor = 'lightgrey'); //item[1] because item[0] has the class "placement-option"
    const removeHighlightAll = e => document.querySelectorAll(`.${e.target.classList.item(1)}`).forEach(object => object.style.backgroundColor = 'transparent');
    const changePlayerArrow = isFinished => {
        const domLocation = document.getElementById('change-player-one');
        if (isFinished) {
            domLocation.textContent = '\u263A';
        }
        else if (game.currentPlayer() === 'O') {
            domLocation.textContent = '\u2192';
        } else {
            domLocation.textContent = '\u2190';
        }
    }
    const changeNextMoveText = isFinished => {
        const currentPlayer = game.currentPlayer();
        const domGoesFirstLabel = document.getElementById('goes-first-label');
        if (isFinished) {
            domGoesFirstLabel.textContent = 'Game Over'
        }    
        else if (currentPlayer === 'X'){
            domGoesFirstLabel.textContent = 'X\'s turn'
        } else {
            domGoesFirstLabel.textContent = 'O\'s turn'
        }
    }
    const hideNextMoveText = () => document.getElementById('goes-first-label').style.display = 'none';
    const showNextMoveText = () => document.getElementById('goes-first-label').style.display = 'block';
    const showWinnerArea = winnerString => {
        document.getElementById('winner-area').style.display = 'flex';
        document.getElementById('winner-circle').textContent = winnerString;
    };
    const hideWinnerArea = () => document.getElementById('winner-area').style.display = 'none';
    const showRestartGameButton = () => document.getElementById('restart-game').style.display = 'flex';
    const hideRestartGameButton = () => document.getElementById('restart-game').style.display = 'none';
    const showComputerPlayerOptions = () => document.getElementById('computer-players').style.display = 'flex';
    const hideComputerPlayerOptions = () => document.getElementById('computer-players').style.display = 'none';
    const startingGUI = (() => {
        document.getElementById('restart-game').style.display = 'none'
        document.getElementById('change-player-one').textContent = '\u2190';
        document.getElementById('goes-first-label').textContent = '(click arrow to change who goes first)';
        addHighlightPlayer('X');
    })();
    const showNewName = (player, name) => {
        if (player === 'X') {
            document.getElementById('x-name').value = name;
        } else {
            document.getElementById('o-name').value = name;
        }
    }
    return {addHighlightAll, removeHighlightAll, removeHighlightPlayer, changePlayerArrow, changeNextMoveText, addHighlightPlayer, showWinnerArea, showRestartGameButton, hideNextMoveText, hideWinnerArea, hideRestartGameButton, hideComputerPlayerOptions, showComputerPlayerOptions, showNextMoveText, showNewName};
})();

const game = (() => {    
    let playersMove = 'X';
    let playerX = player('Player Name', 'X');
    let playerO = player('Player Name', 'O');
    let winnerString = '';
    let winner = '';
    let computerPiece = '';

    const setComputer = piece => {
        computerPiece = piece;
        computersMove();
    }

    const computersMove = () => {
        if (getComputerPiece() === currentPlayer() && computerPiece === 'X') {
            computerPlayer.playGame();
        }
        else if (getComputerPiece() === currentPlayer() && computerPiece === 'O') {
            computerPlayer.playGameMinimax();
        }
    }

    const getComputerPiece = () => computerPiece;
    
    const hasStarted = () => {
        let started = false
        const gameState = board.getCurrentState();
        gameState.forEach(object => {
            if (object !== '') {
                started = true;
                eventListeners.removeChangeStartingPlayerClickListener();
                changeGUI.hideComputerPlayerOptions();
            };
        });
        return started;
    };

    const updateNextPlayer = () => playersMove = (playersMove === 'X') ? 'O' : 'X';
    const currentPlayer = () => playersMove;
    const nextPlayer = () => {
        changeGUI.removeHighlightPlayer(currentPlayer());
        updateNextPlayer();
        changeGUI.addHighlightPlayer(currentPlayer());
        changeGUI.changePlayerArrow();
        changeGUI.changeNextMoveText();
    };
        
    const changeStartingPlayer = e => {
        if (!game.hasStarted()){
            nextPlayer();
            computersMove();
        };
    };

    const isFinished = currentBoard => {
        let coordinate1;
        let coordinate2;
        let coordinate3;
        let isFinishedResult = false;
        let isFinishedTest = (coordinateOne, coordinateTwo, coordinateThree) => {
            if (coordinateOne !== '' && coordinateOne === coordinateTwo && coordinateTwo === coordinateThree){
                if (coordinateOne ==='X') {
                    isFinishedResult = 'X';
                    winnerString = `${game.playerX.getName()} is the winner!`;
                    playerX.addWin();
                } else if (coordinateOne === 'O') {
                    isFinishedResult = 'O';
                    winnerString = `${game.playerO.getName()} is the winner!`;
                    playerO.addWin();
                }
            }
        }
        //Three in a row test
        for (let i=0; i<7; i+=3){
            coordinate1 = currentBoard[i];
            coordinate2 = currentBoard[i+1];
            coordinate3 = currentBoard[i+2];
            isFinishedTest(coordinate1, coordinate2, coordinate3)
        }

        //Three in a column test
        for (let i=0; i<3; i++) {
            coordinate1 = currentBoard[i];
            coordinate2 = currentBoard[i+3];
            coordinate3 = currentBoard[i+6];
            isFinishedTest(coordinate1, coordinate2, coordinate3)
        }

        //Three in a diagonal test (top left)
        coordinate1 = currentBoard[0];
        coordinate2 = currentBoard[4];
        coordinate3 = currentBoard[8];
        isFinishedTest(coordinate1, coordinate2, coordinate3)

        //Three in a diagonal test (top right)
        coordinate1 = currentBoard[2];
        coordinate2 = currentBoard[4];
        coordinate3 = currentBoard[6];
        isFinishedTest(coordinate1, coordinate2, coordinate3)

        //No more moves left test
        let openCoordinate = false;
        currentBoard.forEach(object => {
            if (object === '') {
                openCoordinate = true;
            }
        })
        if (!openCoordinate && !isFinishedResult) {
            isFinishedResult = 'T';
            winnerString = 'Tie game';
        }

        return isFinishedResult;
    }

    const finished = () => {
        const isFinished=true;
        changeGUI.showWinnerArea(winnerString);
        changeGUI.showRestartGameButton();
        changeGUI.removeHighlightPlayer('X');
        changeGUI.removeHighlightPlayer('O');
        changeGUI.changeNextMoveText(isFinished);
        changeGUI.changePlayerArrow(isFinished);
        eventListeners.removeMouseoverHighlight();
        eventListeners.removeAddPieceClickListener();
    }

    const restart = () => {
        board.resetBoard();
        changeGUI.hideWinnerArea();
        changeGUI.hideRestartGameButton();
        changeGUI.changePlayerArrow();
        changeGUI.addHighlightPlayer(game.currentPlayer());
        changeGUI.changeNextMoveText();
        eventListeners.changeStartingPlayerNewGame();
        if (game.getComputerPiece() === game.currentPlayer()) {
            computerPlayer.playGame();
        }
    }
    
    return {currentPlayer, changeStartingPlayer, nextPlayer, playerX, playerO, hasStarted, isFinished, finished, restart, setComputer, getComputerPiece, computersMove};
})();

const board = (() => {
    //Tic Tac Toe board is divided into coordinates as follows
    //
    //C0│C1│C2
    //──┼──┼──
    //C3│C4│C5
    //──┼──┼──
    //C6│C7│C8
    //
    //currentState stores game piece locations for each coordinate (index === coordinates 0 to 8)
    const newGame = ['','','','','','','','',''];
    let currentGame = ['','','','','','','','',''];
    const getNewGame = () => {
        for (let i=0; i<newGame.length; i++)
        {
            currentGame[i] = newGame[i];
        }
        return currentGame;
    }
    currentGame = getNewGame();
    const getCurrentState = () => currentGame;
       
    const newGameBoard = [
        ["\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0"], 
        ["\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0"],
        ["\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0"],
        ["\u2500", "\u2500", "\u2500", "\u253C", "\u2500", "\u2500", "\u2500", "\u253C", "\u2500", "\u2500", "\u2500"],
        ["\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0"],
        ["\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0"],
        ["\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0"],
        ["\u2500", "\u2500", "\u2500", "\u253C", "\u2500", "\u2500", "\u2500", "\u253C", "\u2500", "\u2500", "\u2500"],
        ["\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0"],
        ["\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0"],
        ["\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0", "\u2502", "\u00A0", "\u00A0", "\u00A0"],
    ];
    let currentRenderState = [];
    const getNewGameBoard = () => {
        for (let i=0; i<newGameBoard.length; i++) {
            currentRenderState[i] = newGameBoard[i].slice();
        }
        return currentRenderState;
    };
    currentRenderState = getNewGameBoard();
    const getCurrentRenderState = () => currentRenderState;

    const resetBoard = () => {
        currentRenderState = getNewGameBoard();
        currentState = getNewGame();
        render();
    };

    const copy = (original, newCopy) => {
        for (let i=0; i< original.length; i++) {
            newCopy[i] = original[i]
        }
        return newCopy;
    }

    //Where to place pieces on game board by coordinate (index === coordinates 0 to 8)
    const addPieceCoordinates = [
        [0,0], [0,4], [0,8],
        [4,0], [4,4], [4,8],
        [8,0], [8,4], [8,8],
    ];

    const xPiece = [
        ["\u005C", "\u00A0", "\u002F"],
        ["\u00A0", "\u002F", "\u00A0"],
        ["\u002F", "\u00A0", "\u005C"],
    ];

    const oPiece = [
        ["\u250C", "\u2500", "\u2510"],
        ["\u2502", "\u00A0", "\u2502"],
        ["\u2514", "\u2500", "\u2518"],
    ];

    const blankPiece = [
        ["\u00A0", "\u00A0", "\u00A0"],
        ["\u00A0", "\u00A0", "\u00A0"],
        ["\u00A0", "\u00A0", "\u00A0"],
    ];

    const renderLocation = document.getElementById('board');

    const clearRender = () => {
        while (renderLocation.firstChild) {
            renderLocation.removeChild(renderLocation.lastChild);
        }
    };

    const addPiece = e => {
        let coordinate;
            if (typeof e === 'object'){
                coordinate = e.target.classList.item(1).split('')[1];//item[1] because this is the coordinate. [0] contains class 'placement-position'. split to remove the C (eg. coordinate C0)
            } else {
                coordinate = e;
            }
        const piece = (game.currentPlayer() === 'X') ? xPiece : oPiece;
        const rowIndex = addPieceCoordinates[coordinate][0];
        const columnIndex = addPieceCoordinates[coordinate][1];
        currentGame[coordinate] = game.currentPlayer();
        //adds piece to array that holds the template for upcoming render
        for (let i = 0; i < 3; i++) { //i<3 and j<3 because each piece is 3x3
            for (let j = 0; j < 3; j++) {
                currentRenderState[rowIndex+i][columnIndex+j] = piece[i][j];
            }
        }
        game.hasStarted();
        game.nextPlayer();
        render();
        if (game.isFinished(board.getCurrentState())) {
            game.finished();
        }
        else if (game.getComputerPiece() === game.currentPlayer()) {
            game.computersMove();
        }
    };

    //Game board for render is stored in board.currentRenderState as an 11x11 two dimmensional array.
    //Note that currentRenderState is not the actual game. Actual game is in gameHistoryLog.
    //Render uses i to cycle through the game board row and j to cycle through columns.
    const render = () => {
        clearRender();
        for (let i = 1; i < 12; i++) {
            for (let j = 1; j < 12; j++) {
                const span = document.createElement('SPAN');
                const rowIndex = i-1;
                const columnIndex = j-1;
                
                //Checks to see if current pixel is an open space or game board outline.
                if (i%4 === 0 || j%4 === 0) {
                    span.classList.add('board-outline');
                } else {
                    const getCoordinate = (() => {
                        //Tic Tac Toe board is divided into coordinates as follows
                        //
                        //C0│C1│C2
                        //──┼──┼──
                        //C3│C4│C5
                        //──┼──┼──
                        //C6│C7│C8
                        //
                        //getCoordinate returns the coordinate number for this pixel
                        const rowVal = (Math.floor(i/4) * 3);
                        const columnVal = Math.floor(j/4);
                        const coordinate = rowVal+columnVal;
                        return coordinate;
                    })();
                    span.classList.add('placement-option');
                    span.classList.add(`C${getCoordinate}`);

                    if (currentGame[getCoordinate] !== 'X' && currentGame[getCoordinate] !== 'O') {
                        span.addEventListener('mouseover', changeGUI.addHighlightAll);
                        span.addEventListener('mouseout', changeGUI.removeHighlightAll);
                        span.addEventListener('click', board.addPiece);
                    }
                };
                span.textContent = currentRenderState[rowIndex][columnIndex];
                renderLocation.appendChild(span);
            };
            const br = document.createElement('BR');
            renderLocation.appendChild(br);
        };
    };

    return {resetBoard, copy, render, getCurrentRenderState, getCurrentState, addPiece};
})();

const computerPlayer = (() => {
    const xAI = () => {
        const name = "Computer Easy";
        game.playerX.updateName(name);
        changeGUI.showNewName('X', game.playerX.getName());
        game.setComputer('X');
    };
    
    const oAI = () => {
        const name = "Computer Hard";
        game.playerO.updateName(name);
        changeGUI.showNewName('O', game.playerO.getName());
        game.setComputer('O');
    };

    const playGame = () => {
        const currentBoard = board.getCurrentState();
        let coordinate = Math.floor(Math.random() *9);
        while (currentBoard[coordinate] !== '') {//empty spaces are false so if the coordinate is true that means the computer is trying to take a spot already taken and needs to try again.
            coordinate = Math.floor(Math.random() *9);
        }
        board.addPiece(coordinate);
    };
    
    const playGameMinimax = () => {
        const myPiece = game.getComputerPiece();
        let currentBoard = board.getCurrentState();
        let coordinate;
        let bestScore = -Infinity;
        for (let i=0; i<currentBoard.length; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = myPiece;
                console.log(currentBoard)
                let score = miniMax(0, false, currentBoard, myPiece)
                currentBoard[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    coordinate = i;
                }
            }
        }
        console.log(coordinate);
        board.addPiece(coordinate);
    }

    let scores = {
        X:-10,
        O:10,
        T:0
    };

    const miniMax = (depth, isMaximizing, currentBoard, myPiece) => {        
        let theirPiece = () => (myPiece === 'X') ? 'O' : 'X';
        let result = game.isFinished(currentBoard);
        if (result) {
            //console.log(result + ': ' + scores[result]);
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < currentBoard.length; i++) {
                if (currentBoard[i] === '') {
                    currentBoard[i] = myPiece;
                    let score = miniMax(depth + 1, false, currentBoard, myPiece);
                    currentBoard[i] = '';
                    if (score > bestScore) {
                        bestScore = score;
                    }
                }
            }
            return bestScore;
        }
        else {
            let bestScore = Infinity;
            for (let i = 0; i < currentBoard.length; i++) {
                if (currentBoard[i] === '') {
                    currentBoard[i] = theirPiece();
                    let score = miniMax(depth + 1, true, currentBoard, myPiece);
                    currentBoard[i] = '';
                    if (score < bestScore) {
                        bestScore = score;
                    }
                }
            }
            return bestScore;
        }
    }
    return {xAI, oAI, playGame, playGameMinimax};
})();

const eventListeners = (() => {
    const changeStartingPlayer = (() => {
        document.getElementById('change-player-one').addEventListener('click', game.changeStartingPlayer);
    })();

    const changeStartingPlayerNewGame = () => {
        document.getElementById('change-player-one').addEventListener('click', game.changeStartingPlayer);
    };
    
    const updateNamePlayerX = (() => {
        document.getElementById('x-name').addEventListener('focusout', e => game.playerX.updateName(e.target.value));
    })();
    
    const updateNamePlayerO = (() => {
        document.getElementById('o-name').addEventListener('focusout', e => game.playerO.updateName(e.target.value));
    })(); 

    const setAIlistenerX = (() => {
        document.getElementById('x-computer').addEventListener('click', computerPlayer.xAI);
    })();

    const setAIlistenerO = (() => {
        document.getElementById('o-computer').addEventListener('click', computerPlayer.oAI);
    })();

    const gameRestart = (() => {
        document.getElementById('play-again').addEventListener('click', game.restart);
    })();

    const removeMouseoverHighlight = () => {
        document.querySelectorAll('.placement-option').forEach(object => object.removeEventListener('mouseover', changeGUI.addHighlightAll));
    };

    const removeAddPieceClickListener = () => {
        document.querySelectorAll('.placement-option').forEach(object => object.removeEventListener('click', e => board.addPiece(e.target.classList.item(1).split('')[1])));
    }

    const removeChangeStartingPlayerClickListener = () => {
        document.getElementById('change-player-one').removeEventListener('click', game.changeStartingPlayer);
    }
    return {changeStartingPlayerNewGame, removeMouseoverHighlight, removeAddPieceClickListener, removeChangeStartingPlayerClickListener};
})();

//Renders initial board.
board.render();

//Render new game board if board is unpopulated
/*const checkBoard = (board) => {
    board = (!board) ? createBoard() : board;
    return board;
};*/

//Display game board on browser
/*const displayBoard = (board) => {
    board = checkBoard(board);
    const clearRender = (() => {
        while (boardLocation.firstChild) {
            boardLocation.removeChild(boardLocation.lastChild);
        }
    })();
    
    const updateBoard = e => {
        const coordinate = e.target.classList.item(1).split("");
        const coordinateIndex = coordinate[1];
        const rowCoordinate = coordinates[coordinateIndex][0];
        const columnCoordinate = coordinates[coordinateIndex][1];
        const pieceDisplay = x();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[rowCoordinate+i][columnCoordinate+j] = pieceDisplay[i][j];
            };
        };
        displayBoard(gameBoard);
    };

    //Needs board to render board
    const renderBoard = () => {
        for (let i = 1; i < 12; i++) {
            for (let j = 1; j < 12; j++) {
                const span = document.createElement('SPAN');
                const rowIndex = i-1;
                const columnIndex = j-1;
                if (i%4 === 0 || j%4 === 0) {
                    span.classList.add('board-outline');
                } else {
                    //Labels and groups together each playable tile. Label is identical to the index of array called coordinates used in piece placement function.
                    const coordinate = (() => {
                        const rowVal = (Math.floor(i/4) * 3);
                        const columnVal = Math.floor(j/4);
                        const coordinateVal = rowVal+columnVal;
                        return 'C'+coordinateVal;
                    })();
                    span.classList.add('placement-option');
                    span.classList.add(coordinate);
                    if (board[rowIndex][columnIndex] === '\u00A0') {
                        span.addEventListener('mouseover', changeGUI.addHighlightAll);
                        span.addEventListener('mouseout', changeGUI.removeHighlightAll);
                        span.addEventListener('click', updateBoard);
                    };
                };
                span.textContent = board[rowIndex][columnIndex];
                boardLocation.appendChild(span);
            };
            const br = document.createElement('BR');
            boardLocation.appendChild(br);
        };
    };
    renderBoard();*/

    /*
    const displayRow = (row) => {
        const br = document.createElement('BR');
        row.forEach(displayColumn);
        boardLocation.appendChild(br);
    };
    
    const displayColumn = (column) => {
        const textNode = document.createTextNode(column);
        boardLocation.appendChild(textNode);
    };
    clearBoard();
    board.forEach(displayRow);
    return board;
}*/

//Place X or O on game board
/*const updateBoard = (board, coordinate, piece) => {
    board = checkBoard(board);
    const rowCoordinate = coordinate[0];
    const columnCoordinate = coordinate[1];
    const pieceDisplay = (piece==='X') ? x() : o();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[rowCoordinate+i][columnCoordinate+j] = pieceDisplay[i][j];
        }
    }
    return board;
}*/

    /*const startingAIgraphics = (() => {
        const aiGraphic = '\u1F4BB';
        const textNodeX = document.createTextNode(aiGraphic);
        const textNodeO = document.createTextNode(aiGraphic);
        const placementLocation = document.getElementById('form-input');
        const xLocation = document.getElementById('x-name');
        const oLocation = document.getElementById('o-name');
        placementLocation.appendChild(textNodeO);
    })();*/

    //const addHighlightSingleton = e => e.target.style.backgroundColor = 'lightgrey';
    //const removeHighlightSingleton = e => e.target.style.backgroundColor = 'transparent'; 

    //gameBoard = displayBoard(gameBoard);
    //gameBoard = updateBoard(gameBoard, [0,0], 'X');
    //gameBoard = updateBoard(gameBoard, [0,4], 'O');
    //gameBoard = updateBoard(gameBoard, [4,4], 'X');
    //gameBoard = updateBoard(gameBoard, [8,4], 'O');
    //gameBoard = displayBoard(gameBoard);

        /*let previewRender = false;
    //const isPreviewRender = () => previewRender;

    const renderPreviewRender = e => {
        const coordinate = e.target.classList.item(1).split('')[1]; //item[1] because this is the coordinate. [0] contains class 'placement-position'. split to remove the C (eg. coordinate C0)
        const piece = (game.currentPlayer() === 'X') ? xPiece : oPiece;
        const rowIndex = addPieceCoordinates[coordinate][0];
        const columnIndex = addPieceCoordinates[coordinate][1];
        for (let i = 0; i < 3; i++) { //i<3 and j<3 because each piece is 3x3
            for (let j = 0; j < 3; j++) {
                currentRenderState[rowIndex+i][columnIndex+j] = piece[i][j];
            }
        }
        previewRender = true;
        render();
    }

    const renderRemovePreviewRender = e => {
        const coordinate = e.target.classList.item(1).split('')[1]; //item[1] because this is the coordinate. [0] contains class 'placement-position'. split to remove the C (eg. coordinate C0)
        const piece = blankPiece;
        const rowIndex = addPieceCoordinates[coordinate][0];
        const columnIndex = addPieceCoordinates[coordinate][1];
        for (let i = 0; i < 3; i++) { //i<3 and j<3 because each piece is 3x3
            for (let j = 0; j < 3; j++) {
                currentRenderState[rowIndex+i][columnIndex+j] = piece[i][j];
            }
        }
        console.log('hello');
        previewRender = false;
        render();
    }*/

        /*const addMouseOverOutClickEventListener = () => {
        const coordinateClass = ['CO', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'];
        const coordinateIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        const currentState = board.getCurrentState();
        const isPreviewRender = board.isPreviewRender();
        
        coordinateIndex.forEach(index => {
            if (board.getCurrentState[index] !== 'X' && board.getCurrentState[index] !== 'O') {
                if (!isPreviewRender) {document.querySelectorAll('.'+coordinateClass[index]).addEventListener('mouseover', changeGUI.addHighlightAll());}
                if (isPreviewRender) {document.querySelectorAll('.'+coordinateClass[index]).addEventListener('mouseout', changeGUI.removeHighlightAll());}
                document.querySelectorAll('.'+coordinateClass[index]).addEventListener('click', board.addPiece());
            }
        });  
    }
    return {addMouseOverOutClickEventListener};*/

            //changeStartingPlayer.addEventListener('mouseover', changeGUI.addHighlightSingleton);
        //changeStartingPlayer.addEventListener('mouseout', changeGUI.removeHighlightSingleton);

//}