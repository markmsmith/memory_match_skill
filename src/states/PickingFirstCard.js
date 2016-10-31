import State from '../State.js';
import * as Intents from '../intents';
import { getCardSelectionFromPickCardIntent } from '../intentParsers';
import { MATCHED } from '../cardUtils';
import PickingSecondCard from './PickingSecondCard';
import ConfirmingRestart from './ConfirmingRestart';

const REPROMPT_TEXT = 'You can make a guess like, row 1, column 1, or say exit to stop playing.';

/**
 * Represents when the user has been prompted to select the first card of the pair.
 */
export class PickingFirstCard extends State {

    static enter(session, response, speechText) {
        speechText = speechText || '';
        session.attributes.stateName = this.name;
        speechText += ` There are ${session.attributes.cardsRemaining} cards remaining. What's your next guess?`;
        response.askPlain(speechText, REPROMPT_TEXT);
    }

    buildIntentHandlers(){
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
        const selection = getCardSelectionFromPickCardIntent(intentObj, session);
        const firstCard = selection.card;
        if (firstCard == null) {
            var cards = session.attributes.cards;

            var speechText = "Sorry, that's not a valid card position. "+
                `You can say a row between 1 and ${cards.length} and a column between 1 and ${cards[0].length}, `+
                'or you can say, exit, to stop playing.';
            response.askPlain(speechText, REPROMPT_TEXT);
        } else if (firstCard == MATCHED) {
            response.askPlain('Sorry, you already matched that card.  Try again.', REPROMPT_TEXT);
        } else {
            session.attributes.firstSelection = selection;
            PickingSecondCard.enter(session, response);
            return;
        }
    }

    onStartOver(intentObj, session, response) {
        ConfirmingRestart.enter(session, response);
    }

    onHelp(intentObj, session, response) {
        var cards = session.attributes.cards;
        const speechText = `The goal of the game is to find all the matching pairs.  To find a pair, you say the row `+
            `and column of the first card, memorize the shape, then say the row and column of a different card that `+
            `you think has the matching shape.`+
            `You can say a row between 1 and ${cards.length} and a column between 1 and ${cards[0].length}, `+
            'or you can say, exit, to stop playing.';

        response.askPlain(speechText, REPROMPT_TEXT);
    }
}

export default PickingFirstCard;
