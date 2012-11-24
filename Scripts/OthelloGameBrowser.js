/*
    The script written below is triggered by calling the "InitiateOthelloCanvas" with the following parameters:

    othelloCanvas, // the canvas on which to draw the Othello game 
    context, // the graphical context of the canvas
    othelloCanvasControl, // an element containing the buttons the user can click to browse the moves of the game
    othelloTranscript // the transcript of the game

    What happens next is basicly that the program converts the transcript into an array of x and y indexes.
    Then it tries to calculate the state of the game board for each move represented in the array.
    If no discs can be flipped as a result of a move in the array, the program assumes that the player who's 
    turn it is passed. Then it checks if there were any other playable moves that the player could have made. 
    If there was, the program concludes that the transcript is invalid. The script also considers a transcript
    invalid if it contains a move to a square that already contains a disc. When all of the moves have been
    converted into state arrays of the game or two passes are recorded following one another, the 
    "paintOthelloCanvas" method is called and the initial state of the game is drawn.

    Upon completion the "InitiateOthelloCanvas" function returns the "changeGame" function which can be called
    with a transcript as it's parameter in order to switch to another game. 

    Whenever the user clicks on any of the buttons in the "othelloCanvasControl" the current game state index
    is updated and then the "paintOthelloCanvas" method is called again.

    Feel free to use and manipulate this code as you see fit, it can certainly be optimized in many ways and 
    might benefit from being gzipped and minified. 
            
    Hope you find it useful
            
    /Christian Gårdebrink cgardebrink@gmail.com 
*/

function InitiateOthelloCanvas(othelloCanvas, context, othelloCanvasControl, othelloTranscript) {    
    var currentMoveIndex = 0;
    var canvasWidth = othelloCanvas.width;

    var borderWidth = othelloCanvas.width / 16;
    var squareWidth = (othelloCanvas.width - 2 * borderWidth) / 8;

    var moveNumberInfo = othelloCanvasControl.closest('.othelloGameViewer').find('.currentMoveInfo .moveNumber > span');
    var currentResult = othelloCanvasControl.closest('.othelloGameViewer').find('.currentMoveInfo .result');
    var colorToMove  = othelloCanvasControl.closest('.othelloGameViewer').find('.currentMoveInfo .playerToMove');

    var othelloGameStates = getGameStates(othelloTranscript);

    paintOthelloCanvas();

    othelloCanvasControl.find('li').mousedown(function () {
        if (!$(this).hasClass('mouseDown')) {
            $(this).addClass('mouseDown');
        }

        return false;
    });

    othelloCanvasControl.find('li').mouseup(function () {
        if ($(this).hasClass('mouseDown')) {
            $(this).removeClass('mouseDown');
        }

        return false;
    });

    othelloCanvasControl.find('li').mouseout(function () {
        if ($(this).hasClass('mouseDown')) {
            $(this).removeClass('mouseDown');
        }

        return false;
    });

    othelloCanvasControl.find('a.fastBack').click('click', function () {
        if (othelloGameStates.length > 0) {
            currentMoveIndex = 0;
            paintOthelloCanvas();
        }

        return false;
    });

    othelloCanvasControl.find('a.back').click('click', function () {
        if (currentMoveIndex - 1 > 0) {
            currentMoveIndex--;
            paintOthelloCanvas();
        }

        return false;
    });

    othelloCanvasControl.find('a.forward').click('click', function () {
        if (currentMoveIndex + 1 < othelloGameStates.length) {
            currentMoveIndex++;
            paintOthelloCanvas();
        }

        return false;
    });

    othelloCanvasControl.find('a.fastForward').click('click', function () {
        if (othelloGameStates.length - 1 > 0) {
            currentMoveIndex = othelloGameStates.length - 1;
            paintOthelloCanvas();
        }

        return false;
    });

    return changeGame;

    function changeGame(transcript) {
        othelloGameStates = getGameStates(transcript);
        currentMoveIndex = 0;

        paintOthelloCanvas();
    }

    function paintOthelloCanvas() {
        paintBackGround();
        paintOthelloBorder();
        writeGridlabels();
        paintBackGrid();
        paintCircleMarkers();

        if (othelloGameStates.length <= 0) {
            context.fillStyle = '#ff0000';
            context.font = (Math.floor(canvasWidth / 10).toString() + 'px Arial');
            context.textBaseline = 'middle';
            context.textAlign = 'center';
            context.fillText('Invalid Transcript', canvasWidth / 2, canvasWidth / 2);

            return;
        }

        paintDiscs();

        if (currentMoveIndex > 0) {
            moveNumberInfo.html(
                currentMoveIndex + ': ' +
                (
                    othelloGameStates[currentMoveIndex].PlayerPassed ?
                    'Pass' :
                    (
                        getLetterFromIndex(
                                othelloGameStates[currentMoveIndex].CurrentMove.Xindex
                        ) +
                        (othelloGameStates[currentMoveIndex].CurrentMove.Yindex + 1)
                    )
                )
            );
        }
        else {
            moveNumberInfo.html('');
        }

        currentResult.html(
            othelloGameStates[currentMoveIndex].BlackDiscPositions.length +
            ' - ' +
            othelloGameStates[currentMoveIndex].WhiteDiscPositions.length
        );

        if (othelloGameStates[currentMoveIndex].IsBlackToMove) {
            colorToMove.removeClass('white');

            if(!colorToMove.hasClass('black')) {
                colorToMove.addClass('black');   
            }
        }
        else {
            colorToMove.removeClass('black');

            if (!colorToMove.hasClass('white')) {
                colorToMove.addClass('white');
            }
        }
    }
    
    function getLetterFromIndex(index) {
        var letter = '';
        
        switch(index) {
            case 0:
                letter = 'A';
                break;
            case 1:
                letter = 'B';
                break;
            case 2:
                letter = 'C';
                break;
            case 3:
                letter = 'D';
                break;
            case 4:
                letter = 'E';
                break;
            case 5:
                letter = 'F';
                break;
            case 6:
                letter = 'G';
                break;
            case 7:
                letter = 'H';
                break;
        }

        return letter;
    }

    function paintDiscs() {
        var i;

        context.fillStyle = "#1d1e1e";

        for (i = 0; i < othelloGameStates[currentMoveIndex].BlackDiscPositions.length; i++) {
            paintDisc(othelloGameStates[currentMoveIndex].BlackDiscPositions[i].Xindex, othelloGameStates[currentMoveIndex].BlackDiscPositions[i].Yindex);
        }

        context.fillStyle = "#fcfcf9";

        for (i = 0; i < othelloGameStates[currentMoveIndex].WhiteDiscPositions.length; i++) {
            paintDisc(othelloGameStates[currentMoveIndex].WhiteDiscPositions[i].Xindex, othelloGameStates[currentMoveIndex].WhiteDiscPositions[i].Yindex);
        }

        if (othelloGameStates[currentMoveIndex].PlayerPassed || currentMoveIndex < 1) {
            return;
        }

        if (othelloGameStates[currentMoveIndex].IsBlackToMove)
        {
            context.fillStyle = "#1d1e1e";
        }
        else {
            context.fillStyle = "#fcfcf9";
        }

        paintCurrentDiscMarker(
            othelloGameStates[currentMoveIndex].CurrentMove.Xindex,
            othelloGameStates[currentMoveIndex].CurrentMove.Yindex
        );
    }

    function paintCurrentDiscMarker(xIndex, yIndex) {
        context.beginPath();
        context.arc(
                    (squareWidth / 2) + borderWidth + (squareWidth * xIndex),
                    (squareWidth / 2) + borderWidth + (squareWidth * yIndex),
                    ((squareWidth / 2) * 0.2),
                    0,
                    (Math.PI * 2),
                    true
                );
        context.fill();
    }

    function paintDisc(xIndex, yIndex) {
        context.beginPath();
        context.arc(
                    (squareWidth / 2) + borderWidth + (squareWidth * xIndex),
                    (squareWidth / 2) + borderWidth + (squareWidth * yIndex),
                    ((squareWidth / 2) * 0.8),
                    0,
                    (Math.PI * 2),
                    true
                );
        context.fill();
    }

    function paintCircleMarkers() {
        context.fillStyle = "#2d974f";

        context.beginPath();
        context.arc(
                    (squareWidth * 2 + borderWidth),
                    (squareWidth * 2 + borderWidth),
                    (squareWidth / 8),
                    0,
                    (Math.PI * 2),
                    true
                );
        context.fill();

        context.beginPath();
        context.arc(
                    (squareWidth * 6 + borderWidth),
                    (squareWidth * 2 + borderWidth),
                    (squareWidth / 8),
                    0,
                    (Math.PI * 2),
                    true
                );
        context.fill();

        context.beginPath();
        context.arc(
                    (squareWidth * 6 + borderWidth),
                    (squareWidth * 6 + borderWidth),
                    (squareWidth / 8),
                    0,
                    (Math.PI * 2),
                    true
                );
        context.fill();

        context.beginPath();
        context.arc(
                    (squareWidth * 2 + borderWidth),
                    (squareWidth * 6 + borderWidth),
                    (squareWidth / 8),
                    0,
                    (Math.PI * 2),
                    true
                );
        context.fill();
    }

    function paintBackGrid() {
        context.lineWidth = squareWidth / 30;
        context.strokeStyle = "#2d974f";

        for (var i = borderWidth; i < canvasWidth; i += squareWidth) {
            context.beginPath();
            context.moveTo(i, borderWidth);
            context.lineTo(i, (canvasWidth - borderWidth));
            context.closePath();
            context.stroke();

            context.beginPath();
            context.moveTo(borderWidth, i);
            context.lineTo((canvasWidth - borderWidth), i);
            context.closePath();
            context.stroke();
        }
    }

    function paintBackGround() {
        context.fillStyle = '#000000';
        context.beginPath();
        context.rect(0, 0, canvasWidth, canvasWidth);
        context.closePath();
        context.fill();

        context.fillStyle = '#35a45a';
        context.beginPath();
        context.rect(borderWidth, borderWidth, (canvasWidth - 2 * borderWidth), (canvasWidth - 2 * borderWidth));
        context.closePath();
        context.fill();
    }

    function writeGridlabels() {
        context.fillStyle = '#ffffff';
        context.font = (Math.floor(borderWidth / 2).toString() + 'px Arial');
        context.textBaseline = 'middle';
        context.textAlign = 'center';

        var columnHeaderChars = 'ABCDEFGH';

        for (var i = 0; i < columnHeaderChars.length; i++) {
            context.fillText(columnHeaderChars[i], borderWidth + squareWidth / 2 + i * squareWidth, borderWidth / 2);
            context.fillText((i + 1), borderWidth / 2, borderWidth + squareWidth / 2 + i * squareWidth);
        }
    }

    function paintOthelloBorder() {
        var topBorderLinearGradient = context.createLinearGradient(0, 0, 0, borderWidth);

        topBorderLinearGradient.addColorStop(0, '#000000');
        topBorderLinearGradient.addColorStop(1, '#343434');

        context.fillStyle = topBorderLinearGradient;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(borderWidth, borderWidth);
        context.lineTo((canvasWidth - borderWidth), borderWidth);
        context.lineTo(canvasWidth, 0);
        context.closePath();
        context.fill();

        var rightBorderLinearGradient = context.createLinearGradient((canvasWidth - borderWidth), 0, canvasWidth, 0);

        rightBorderLinearGradient.addColorStop(0, '#343434');
        rightBorderLinearGradient.addColorStop(1, '#000000');

        context.fillStyle = rightBorderLinearGradient;

        context.beginPath();
        context.moveTo(canvasWidth, 0);
        context.lineTo(canvasWidth, canvasWidth);
        context.lineTo((canvasWidth - borderWidth), (canvasWidth - borderWidth));
        context.lineTo((canvasWidth - borderWidth), borderWidth);
        context.closePath();
        context.fill();

        var bottomBorderLinearGradient = context.createLinearGradient(0, (canvasWidth - borderWidth), 0, canvasWidth);

        bottomBorderLinearGradient.addColorStop(0, '#343434');
        bottomBorderLinearGradient.addColorStop(1, '#000000');

        context.fillStyle = bottomBorderLinearGradient;

        context.beginPath();
        context.moveTo(canvasWidth, canvasWidth);
        context.lineTo((canvasWidth - borderWidth), (canvasWidth - borderWidth));
        context.lineTo(borderWidth, (canvasWidth - borderWidth));
        context.lineTo(0, canvasWidth);
        context.closePath();
        context.fill();

        var leftBorderLinearGradient = context.createLinearGradient(0, 0, borderWidth, 0);

        leftBorderLinearGradient.addColorStop(0, '#000000');
        leftBorderLinearGradient.addColorStop(1, '#343434');

        context.fillStyle = leftBorderLinearGradient;

        context.beginPath();
        context.moveTo(0, canvasWidth);
        context.lineTo(borderWidth, (canvasWidth - borderWidth));
        context.lineTo(borderWidth, borderWidth);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();
    }

    function getGameStates(transcript) {
        var squareState = { "Empty": 0, "BlackDisc": 1, "WhiteDisc": 2 };

        var gameStates = new Array();

        var currentSquareStateMatrix = getInitialSquareStateMatrix(transcript);

        var isBlackMove = true;

        gameStates.push(
            getGameState(
                new discPosition(0,0),
                true,
                currentSquareStateMatrix
            )
        );

        var discPositionsArray = getDiscPositionsFromTranscript();

        for (var i = 0; i < discPositionsArray.length; i++) {
            var playerPassed = false;

            if(currentSquareStateMatrix[discPositionsArray[i].Xindex][discPositionsArray[i].Yindex] != squareState.Empty) {
                return new Array();
            }

            updateSquareStateMatrixByMove(
                discPositionsArray[i]
            );

            gameStates.push(
                getGameState(
                    discPositionsArray[i],
                    !isBlackMove,
                    currentSquareStateMatrix
                )
            );

            if (playerPassed)
            {
                if (
                    hasPlayableMoves()
                )
                {
                    return new Array();
                }

                isBlackMove = !isBlackMove;

                updateSquareStateMatrixByMove(
                    discPositionsArray[i]
                );

                if (playerPassed) {
                    if(gameStates.length > 0)
                    {
                        gameStates.pop();
                    }

                    break;
                }

                gameStates.push(
                    getGameState(
                        discPositionsArray[i],
                        !isBlackMove,
                        currentSquareStateMatrix
                    )
                );
            }   

            isBlackMove = !isBlackMove;
        }

        return gameStates;

        function hasPlayableMoves() {
            for(var x = 0; x < currentSquareStateMatrix.length; x++)
            {
                for (var y = 0; y < currentSquareStateMatrix.length; y++)
                {
                    if (currentSquareStateMatrix[x][y] != squareState.Empty)
                    {
                        continue;
                    }

                    if(
                        isPossibleMove(
                            new discPosition(x, y)
                        )
                    ) {
                        return true;
                    }
                }
            }

            return false;
        }

        function isPossibleMove(
            movePosition
        ) 
        {
            var directionArray = [-1, 0, 1];

            for (var xDirection = 0; xDirection < directionArray.length; xDirection++)
            {
                for (var yDirection = 0; yDirection < directionArray.length; yDirection++)
                {
                    if (directionArray[xDirection] == 0 && directionArray[yDirection] == 0)
                    {
                        continue;
                    }

                    var xIndex = movePosition.Xindex + directionArray[xDirection];
                    var yIndex = movePosition.Yindex + directionArray[yDirection];

                    var spannedDiscsCounter = 0;

                    while (
                        xIndex >= 0 &&
                        xIndex < currentSquareStateMatrix.length &&
                        yIndex >= 0 &&
                        yIndex < currentSquareStateMatrix.length
                    )
                    {
                        if (currentSquareStateMatrix[xIndex][yIndex] == squareState.Empty)
                        {
                            break;
                        }

                        if (
                            currentSquareStateMatrix[xIndex][yIndex] == squareState.BlackDisc && isBlackMove ||
                            currentSquareStateMatrix[xIndex][yIndex] == squareState.WhiteDisc && !isBlackMove
                        )
                        {
                            if (spannedDiscsCounter > 0)
                            {
                                return true;
                            }

                            break;
                        }

                        xIndex += directionArray[xDirection];
                        yIndex += directionArray[yDirection];
                        spannedDiscsCounter++;
                    }
                }
            }

            return false;
        }

        function updateSquareStateMatrixByMove(
            movePosition
        ) {
            var hasFlipped = false;

            var directionArray = [-1, 0, 1];

            if (isBlackMove)
            {
                currentSquareStateMatrix[movePosition.Xindex][movePosition.Yindex] = squareState.BlackDisc;
            }
            else
            {
                currentSquareStateMatrix[movePosition.Xindex][movePosition.Yindex] = squareState.WhiteDisc;
            }

            for(var xDirection = 0; xDirection < directionArray.length; xDirection++)
            {
                for (var yDirection = 0; yDirection < directionArray.length; yDirection++)
                {
                    if (directionArray[xDirection] == 0 && directionArray[yDirection] == 0)
                    {
                        continue;
                    }

                    var xIndex = movePosition.Xindex + directionArray[xDirection];
                    var yIndex = movePosition.Yindex + directionArray[yDirection];

                    var spannedDiscsCounter = 0;

                    while(
                        xIndex >= 0 &&
                        xIndex < currentSquareStateMatrix.length &&
                        yIndex >= 0 &&
                        yIndex < currentSquareStateMatrix.length
                    )
                    {
                        if (currentSquareStateMatrix[xIndex][yIndex] == squareState.Empty)
                        {
                            break;
                        }

                        if (
                            currentSquareStateMatrix[xIndex][yIndex] == squareState.BlackDisc && isBlackMove ||
                            currentSquareStateMatrix[xIndex][yIndex] == squareState.WhiteDisc && !isBlackMove
                        )
                        {
                            while (spannedDiscsCounter > 0)
                            {
                                hasFlipped = true;

                                xIndex -= directionArray[xDirection];
                                yIndex -= directionArray[yDirection];

                                currentSquareStateMatrix[xIndex][yIndex] = 
                                    isBlackMove
                                        ? squareState.BlackDisc
                                        : squareState.WhiteDisc;

                                spannedDiscsCounter--;
                            }

                            break;
                        }

                        xIndex += directionArray[xDirection];
                        yIndex += directionArray[yDirection];
                        spannedDiscsCounter++;
                    }
                }
            }

            playerPassed = !hasFlipped;

            if (playerPassed)
            {
                currentSquareStateMatrix[movePosition.Xindex][movePosition.Yindex] = squareState.Empty;
            }
        }

        function getInitialSquareStateMatrix() {
            var squareStateMatrix = new Array(8);

            for (var x = 0; x < squareStateMatrix.length; x++) {
                squareStateMatrix[x] = new Array(8);

                for (var y = 0; y < squareStateMatrix.length; y++) {
                    if (x == 3) {
                        if (y == 3) {
                            squareStateMatrix[x][y] = squareState.WhiteDisc;
                            continue;
                        }

                        if (y == 4) {
                            squareStateMatrix[x][y] = squareState.BlackDisc;
                            continue;
                        }
                    }

                    if (x == 4) {
                        if (y == 3) {
                            squareStateMatrix[x][y] = squareState.BlackDisc;
                            continue;
                        }

                        if (y == 4) {
                            squareStateMatrix[x][y] = squareState.WhiteDisc;
                            continue;
                        }
                    }

                    squareStateMatrix[x][y] = squareState.Empty;
                }
            }

            return squareStateMatrix;
        }

        function getGameState(
            currentMove,
            isBlackToMove,
            squareStateMatrix
        ) {
            var blackDiscPositions = new Array();
            var whiteDiscPositions = new Array();

            for (var x = 0; x < squareStateMatrix.length; x++) {
                for (var y = 0; y < squareStateMatrix.length; y++) {
                    if (squareStateMatrix[x][y] == squareState.BlackDisc) {
                        blackDiscPositions.push(new discPosition(x, y));
                        continue;
                    }

                    if (squareStateMatrix[x][y] == squareState.WhiteDisc) {
                        whiteDiscPositions.push(new discPosition(x, y));
                    }
                }
            }

            return new gameState(
                currentMove,
                isBlackToMove,
                blackDiscPositions,
                whiteDiscPositions
            );
        }

        function discPosition(
            xIndex,
            yIndex
        ) {
            this.Xindex = xIndex;
            this.Yindex = yIndex;
        }

        function gameState(
            currentMove,
            isBlackToMove,
            blackDiscPositions,
            whiteDiscPositions
        ) {
            this.CurrentMove = currentMove;
            this.IsBlackToMove = isBlackToMove;
            this.PlayerPassed = playerPassed;
            this.BlackDiscPositions = blackDiscPositions;
            this.WhiteDiscPositions = whiteDiscPositions;
        }

        function getDiscPositionsFromTranscript() {
            transcript = transcript.replace(/ /g, '').toLowerCase();

            var discPositions = new Array();
            var xIndex = 0;

            for (var n = 0; n < transcript.length; n++) {
                switch (transcript[n]) {
                    case 'a':
                        xIndex = 0;
                        break;
                    case 'b':
                        xIndex = 1;
                        break;
                    case 'c':
                        xIndex = 2;
                        break;
                    case 'd':
                        xIndex = 3;
                        break;
                    case 'e':
                        xIndex = 4;
                        break;
                    case 'f':
                        xIndex = 5;
                        break;
                    case 'g':
                        xIndex = 6;
                        break;
                    case 'h':
                        xIndex = 7;
                        break;
                    case '1':
                        discPositions.push(new discPosition(xIndex, 0));
                        break;
                    case '2':
                        discPositions.push(new discPosition(xIndex, 1));
                        break;
                    case '3':
                        discPositions.push(new discPosition(xIndex, 2));
                        break;
                    case '4':
                        discPositions.push(new discPosition(xIndex, 3));
                        break;
                    case '5':
                        discPositions.push(new discPosition(xIndex, 4));
                        break;
                    case '6':
                        discPositions.push(new discPosition(xIndex, 5));
                        break;
                    case '7':
                        discPositions.push(new discPosition(xIndex, 6));
                        break;
                    case '8':
                        discPositions.push(new discPosition(xIndex, 7));
                        break;
                }
            }

            return discPositions;
        }
    }
}