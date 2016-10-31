import State from '../State.js';
import * as Intents from '../intents';
import StartingGame from './StartingGame';

const repromptText = "<speak>Would you like to play again? You can answer 'yes' to start a new game or 'no' to quit." +
                     '</speak>';

/**
 * Represents when all the pairs have been matched and the user has the option of starting a new game.
 */
export class GameOver extends State {

    static enter(session, response, speechText) {
        session.attributes.stateName = this.name;

        speechText = speechText || '';
        const numMoves = session.attributes.moveCount;
        speechText += ` You won in just ${numMoves} moves!. <break time="1s" />` +
            `You can start a new game by saying, 'new game', or quit by saying, 'exit'.`;
        const cardTitle = 'Memory Match';
        const cardContent = 'You Won!\n' +
            `Number of moves: ${numMoves}`;
        response.askWithCardSSML(`<speak>${speechText}</speak>`, repromptText, cardTitle, cardContent);
    }

    buildIntentHandlers() {
        return {
            [Intents.START_OVER_INTENT]: this.onYes,
            [Intents.START_GAME_INTENT]: this.onYes,
            [Intents.YES_INTENT]: this.onYes,
            [Intents.NO_INTENT]: this.onStop,
            [Intents.CANCEL_INTENT]: this.onStop,
            [Intents.HELP_INTENT]: this.onHelp

            // TODO Handle PickCard and restart game with first selection made
        };
    }

    onYes(intentObj, session, response){
        StartingGame.enter(session, response);
    }

    onHelp(intentObj, session, response){
        response.askPlain("The game you were playing is finished, you can start a new game by saying, 'new game', or "+
            "quit by saying, 'exit'.");
    }

    /*
    onPickCard(intentObj, session, response){
        // must have made a guess when we're done, so start a new game
        const speechText = 'Sorry, the current game is over. Let me start a new one.';
    }
    */
}

export default GameOver;
