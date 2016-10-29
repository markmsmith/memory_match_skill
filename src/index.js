/**
 * Plays a memory match game, where players say a row and column to turn over a card, then try to
 * say the row and column to find the matching card.  The game ends when all cards are matched and
 * the number of turns used is reported back.
 * *
 * Examples:
 * Dialog model:
 *  User: "Alexa, start memory match."
 *  Alexa: "You have a 4 by 3 grid of cards face down.  You have to find the matching pairs by saying
*            which row and column of card to turn over.  For example row 4, column 3."
 *  User: "Row 1 column 1"
 *  Alexa: "red star"
 *  User: "Row 1 column 2"
 *  Alexa: "blue circle, no match."
 *  (This repeats until all the pairs are matched)
 *  Alexa: "Well done, it took you X moves to find all the pairs.  Would you like to play again?"
 */

/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.ask.skill.a224d45d-3af6-42ab-a6d5-6f6d029d7932';


var SHAPES = ['circle', 'square', 'triangle', 'star'];
var COLORS = ['red', 'green', 'blue', 'black', 'pink'];
var STAGES = {
    'START': 0,
    'FIRST_CARD': 1,
    'SECOND_CARD': 2,
    'DONE': 3
};
var MATCHED = "X";

var NUM_ROWS = 4;
var NUM_COLS = 3;
var NUM_CARDS = NUM_ROWS * NUM_COLS;

// sanity check
if(NUM_CARDS % 2 != 0){
    throw new Error("Odd number of cards, "+ NUM_CARDS +", can't make pairs!");
}

var NUM_PAIRS = NUM_CARDS / 2;

var AlexaSkill = require('./AlexaSkill');

var MemoryMatchSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

MemoryMatchSkill.prototype = Object.create(AlexaSkill.prototype);
MemoryMatchSkill.prototype.constructor = MemoryMatchSkill;

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
MemoryMatchSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("MemoryMatchSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);

    handleStartGameIntent(session, response);
};

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
MemoryMatchSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    //Any session cleanup logic would go here.
};

var startGameText = "Let's play a game of memory. " +
                    "You have a set of face down cards laid out in "+NUM_ROWS+" rows and "+NUM_COLS+" columns. "+
                    "You tell me which card to flip over by saying something like, row 4, column 3, "+
                    "or just, 4, 3. "+
                    "You win when you match all "+NUM_PAIRS+" pairs. "+
                    "You can stop at any time by saying, exit. "+
                    "You can start a new game by saying, new game.";

MemoryMatchSkill.prototype.intentHandlers = {
    "StartGameIntent": function (intent, session, response) {
        handleStartGameIntent(session, response);
    },

    "PickCardIntent": function (intent, session, response) {
        handlePickCardIntent(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "";

        switch (session.attributes.stage) {
            case STAGES.FIRST_CARD:
            case STAGES.SECOND_CARD:
                speechText = "Which card shall I flip over next?  You can say 4, 3 for the card in the fourth row and "+
                "the 3rd column. "+
                "You can also stop playing by saying, exit";
                break;
            case STAGES.DONE:
                speechText = "You can start a new game by saying, new game, or if you're finishing playing you can "+
                "say, exit.";
                break;
            case STAGES.START:
            default:
                speechText = startGameText;
        }

        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        // For the repromptText, play the speechOutput again
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

function createPairs(){
    var pairs = [];
    for(var i=0; i < NUM_PAIRS; i++){
        var colorIndex = Math.floor(Math.random() * COLORS.length);
        var shapeIndex = Math.floor(Math.random() * SHAPES.length);
        var coloredShape = COLORS[colorIndex] + " " + SHAPES[shapeIndex];
        pairs.push(coloredShape);
        pairs.push(coloredShape);
    }
    return pairs;
}

function createCards(pairs){
    var cards = [];
    var shapeIndex;
    var shape;
    for(var row=0; row < NUM_ROWS; row++){
        var rowVals = [];
        for(var col=0; col < NUM_COLS; col++){
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

/**
 * Sets up a new game and tells the user how to play if it's the first game this session.
 */
function handleStartGameIntent(session, response) {
    var speechText = session.new ? startGameText : "Ok, new game ready.  What's your first card?";

    //Reprompt speech will be triggered if the user doesn't respond.
    var repromptText = "You can start guessing by saying, row 1, column 1, or exit to stop playing.";

    // create random collection of colored shape pairs
    var pairs = createPairs();

    // put the pairs into random card positions
    var cards = createCards(pairs);

    //The stage variable tracks the phase of the dialogue.
    //When this function completes, it will be on STAGES.FIRST_CARD.
    session.attributes.stage = STAGES.FIRST_CARD;
    session.attributes.cards = cards;
    session.attributes.moveCount = 0;
    session.attributes.cardsRemaining = NUM_CARDS;
    session.attributes.firstPick = null;

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, "Memory Match", speechText);
}

function getCard(row, col, cards){
    if(row >= 0 && row < NUM_ROWS && col >= 0 && col < NUM_COLS){
        return cards[row][col];
    }
    return null;
}

function debugMsg(message, response){
    var speechOutput = {
        speech: message,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: message,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    response.askWithCard(speechOutput, repromptOutput, "Memory Match", message);
}

/**
 * Responds to the user picking a card.
 */
function handlePickCardIntent(intent, session, response) {
    var speechText = "";
    var repromptText = "";
    var currentStage = session.attributes.stage;

    // decrease both positions, since users work with 1-indexed positions
    var row = parseInt(intent.slots.Row.value, 10) - 1;
    var col = parseInt(intent.slots.Col.value, 10) - 1;

    var cards = session.attributes.cards;
    if (currentStage) {
        if (currentStage === STAGES.FIRST_CARD) {
            var firstCard = getCard(row, col, cards);
            if (firstCard == null) {
                speechText = "Sorry, that's not a valid card position. "+
                    "You can say a row between 1 and "+ NUM_ROWS +" and a column between 1 and "+ NUM_COLS +", "+
                    "or you can say, exit, to stop playing.";
            } else if (firstCard == MATCHED){
                speechText = "Sorry, you already matched that card.  Try again."
            } else {
                speechText = firstCard + ". Now choose a second card to match it."
                session.attributes.firstPick = {
                    card: firstCard,
                    row: row,
                    col: col
                };
                session.attributes.stage = STAGES.SECOND_CARD;
            }

            session.attributes.moveCount++;
            repromptText = "You make a guess like, row 1, column 1, or say exit to stop playing.";

        } else if (currentStage === STAGES.SECOND_CARD) {
            var firstPick = session.attributes.firstPick;
            var secondCard = getCard(row, col, cards);
                session.attributes.moveCount++;

            if (secondCard == null) {
                speechText = "Sorry, that's not a valid card position. "+
                    "You can say a row between 1 and "+ NUM_ROWS +" and a column between 1 and "+ NUM_COLS +", "+
                    "or you can say, exit, to stop playing.";
            } else if (secondCard == MATCHED){
                speechText = "Sorry, you already matched that card, please try again."
            } else if (row == firstPick.row && col == firstPick.col) {
                speechText = "Sorry, you can't match a card with itself, please try again."
            } else {
                speechText = secondCard + ". ";
                if(secondCard == firstPick.card){
                    speechText += "That's a match! ";
                    cards[row][col] = MATCHED;
                    cards[firstPick.row][firstPick.col] = MATCHED;
                    session.attributes.cardsRemaining -= 2;
                } else {
                    speechText += "No match. ";
                }

                if (session.attributes.cardsRemaining == 0) {
                    speechText += "You won in just "+ session.attributes.moveCount +" moves!. <break time=\"1s\" />"+
                        "You can start a new game by saying, new game, or finish by saying, exit."
                    session.attributes.stage = STAGES.DONE;
                }
                else {
                    speechText += "There are "+ session.attributes.cardsRemaining +" cards remaining. "+
                        "What's your next guess?";
                    session.attributes.stage = STAGES.FIRST_CARD;
                }
            }

            repromptText = "You can make a guess like row 1, column 1, or say exit to stop playing.";

        } else {
            // must have made a guess when we're done, so start a new game
            speechText = "Sorry, the current game is over. Let me start a new one.";
            return handleStartGameIntent(session, response);
        }
    } else {
        //If the session attributes are not found, the game must restart.
        speechText = "Sorry, the current game is over. Let me start a new one.";
        return handleStartGameIntent(session, response);
    }

    var speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: '<speak>' + repromptText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
    };
    response.ask(speechOutput, repromptOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the memory match  Skill.
    var skill = new MemoryMatchSkill();
    skill.execute(event, context);
};
