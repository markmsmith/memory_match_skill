import State from '../State.js';
import PickingFirstCard from './PickingFirstCard';
import { createCards } from '../cardUtils';

const NUM_ROWS = 4;
const NUM_COLS = 3;
const NUM_CARDS = NUM_ROWS * NUM_COLS;

// sanity check
if (NUM_CARDS % 2 != 0) {
    throw new Error(`Odd number of cards, ${NUM_CARDS}, can't make pairs!`);
}

const NUM_PAIRS = NUM_CARDS / 2;

const START_GAME_TEXT = "Let's play a game of memory. " +
                        `You have a set of face down cards laid out in ${NUM_ROWS} rows and ${NUM_COLS} columns. `+
                        'You tell me which card to flip over by saying something like, row 4, column 3, '+
                        'or just, 4, 3. '+
                        `You win when you match all ${NUM_PAIRS} pairs. ` +
                        'You can stop at any time by saying, exit. ' +
                        'You can start a new game by saying, new game.';
const SHORT_START_GAME = "Ok, new game ready.  What's your first card?";

/**
 * Represents when the game is just starting.
 * Immediately transitions to PickingFirstCard, so the session's stateName never references this state.
 */
export class StartingGame extends State {

    static enter(session, response, speechText='') {
        // just give them the short intro if this isn't their first game this session
        speechText += session.new ? START_GAME_TEXT : SHORT_START_GAME;

        // Reprompt speech will be triggered if the user doesn't respond.
        var repromptText = 'You can start guessing by saying, row 1, column 1, or exit to stop playing.';

        // put the pairs into random card positions
        var cards = createCards(NUM_PAIRS, NUM_ROWS, NUM_COLS);

        session.attributes = {

            // the PickingFirstCard state will handle any replies we get back
            stateName: PickingFirstCard.name,

            // record the set of cards we generated
            cards: cards,

            // initalize the move counter
            moveCount: 0,

            // reset how the count of unmatched cards remaining
            cardsRemaining: NUM_CARDS,
        };

        // only show a card the first time
        if (session.new) {
            response.askWithCardPlain(speechText, repromptText, 'Memory Match', speechText);
        } else {
            response.askPlain(speechText, repromptText);
        }
    }
}

export default StartingGame;
