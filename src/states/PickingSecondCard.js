import State from '../State.js';
import * as Intents from '../intents';
import { getCardSelectionFromPickCardIntent } from '../intentParsers';
import { MATCHED } from '../cardUtils';
import PickingFirstCard from './PickingFirstCard';
import GameOver from './GameOver';
import ConfirmingRestart from './ConfirmingRestart';

const REPROMPT_TEXT = 'You can make a guess like, row 1, column 1, or say exit to stop playing.';

/**
 * Represents when the user has been prompted to select the second card of the pair.
 */
export class PickingSecondCard extends State {

    static enter(session, response, speechText=''){
        session.attributes.stateName = this.name;
        speechText += `${session.attributes.firstSelection.card}. Now choose a second card to match it.`;
        response.askPlain(speechText, REPROMPT_TEXT);
    }

    buildIntentHandlers() {
        return {
            [Intents.PICK_CARD_INTENT]: this.onPickCard,
            [Intents.START_OVER_INTENT]: this.onStartOver,
            [Intents.START_GAME_INTENT]: this.onStartOver,
            [Intents.CANCEL_INTENT]: this.onStop,
            [Intents.HELP_INTENT]: this.onHelp
        };
    }

    onPickCard(intentObj, session, response) {
        session.attributes.moveCount++;
        var cards = session.attributes.cards;
        const firstSelection = session.attributes.firstSelection;
        const secondSelection = getCardSelectionFromPickCardIntent(intentObj, session);
        const secondCard = secondSelection.card;

        if (secondCard == null) {
            let speechText = "Sorry, that's not a valid card position. "+
                `You can say a row between 1 and ${cards.length} and a column between 1 and ${cards[0].length}, `+
                'or you can say, exit, to stop playing.';
            response.askPlain(speechText, REPROMPT_TEXT);
        } else if (secondCard == MATCHED) {
            response.askPlain('Sorry, you already matched that card, please try again.', REPROMPT_TEXT);
        } else if (secondSelection.row == firstSelection.row && secondSelection.col == firstSelection.col) {
            response.askPlain("Sorry, you can't match a card with itself, please try again.", REPROMPT_TEXT);
        } else {
            let speechText = `${secondCard}.`;
            if(secondCard == firstSelection.card){
                speechText += " That's a match!";
                cards[firstSelection.row][firstSelection.col] = MATCHED;
                cards[secondSelection.row][secondSelection.col] = MATCHED;
                session.attributes.cardsRemaining -= 2;
            } else {
                speechText += ' No match.';
            }

            if (session.attributes.cardsRemaining == 0) {
                GameOver.enter(session, response, speechText);
                return;
            } else {
                PickingFirstCard.enter(session, response, speechText);
                return;
            }
        }
    }

    onStartOver(intentObj, session, response){
        ConfirmingRestart.enter(session, response);
    }

    onHelp(intentObj, session, response){
        var cards = session.attributes.cards;
        const speechText = `The goal of the game is to find all the matching pairs.  To find a pair, you say the row `+
            `and column of the first card, memorize the shape, then say the row and column of a different card that `+
            `you think has the matching shape.`+
            `In this step you're trying to find a match with your previous selection, `+
            `${session.attributes.firstSelection.card}.`+
            `You can say a row between 1 and ${cards.length} and a column between 1 and ${cards[0].length}, `+
            'or you can say, exit, to stop playing.';

        response.askPlain(speechText, REPROMPT_TEXT);
    }
}

export default PickingSecondCard;
