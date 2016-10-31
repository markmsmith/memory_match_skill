export const SHAPES = ['circle', 'square', 'triangle', 'star'];
export const COLORS = ['red', 'green', 'blue', 'black', 'pink'];

// Used to represent a card that's already been matched and is no longer available
export const MATCHED = 'X';

function createPairs(numPairs){
    var pairs = [];
    for(var i=0; i < numPairs; i++){
        var colorIndex = Math.floor(Math.random() * COLORS.length);
        var shapeIndex = Math.floor(Math.random() * SHAPES.length);
        var coloredShape = COLORS[colorIndex] + ' ' + SHAPES[shapeIndex];
        pairs.push(coloredShape);
        pairs.push(coloredShape);
    }
    return pairs;
}

function createLayout(pairs, numRows, numCols){
    var cards = [];
    var shapeIndex;
    var shape;
    for(var row=0; row < numRows; row++){
        var rowVals = [];
        for(var col=0; col < numCols; col++){
            // randomly choose a card for this position
            shapeIndex = Math.floor(Math.random() * pairs.length);
            // remove it so we can't choose it again
            shape = pairs.splice(shapeIndex, 1)[0];
            rowVals[col] = shape;
        }
        cards[row] = rowVals;
    }

    return cards;
}

export function createCards(numPairs, numRows, numCols){
    // create random collection of colored shape pairs
    var pairs = createPairs(numPairs);

    // put the pairs into random card positions
    return createLayout(pairs, numRows, numCols);
}

export function getCard(row, col, cards){
    if(row >= 0 && row < cards.length && col >= 0 && col < cards[row].length){
        return cards[row][col];
    }
    return null;
}

export default createCards;
