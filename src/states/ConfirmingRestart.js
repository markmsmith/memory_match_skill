import State from '../State.js';
import * as Intents from '../intents';
import ALL_STATES from './index';

/**
 * Represents when the user has asked to start over when a game is in progress.
 */
export class ConfirmingRestart extends State {

    static enter(session, response){
        session.attributes.previousStateName = session.attributes.stateName;
        session.attributes.stateName = this.name;

        const speechText = 'Are you sure you wish to abandon the current game and start a new one?';
        const repromptText = "Are you sure you want to restart?  You can answer 'yes' to start a new game, " +
            "'no' or 'cancel' to continue playing, or 'exit' to quit playing.";
        response.askPlain(speechText, repromptText);
    }

    buildIntentHandlers() {
        return {
            [Intents.START_OVER_INTENT]: this.onYes,
            [Intents.START_GAME_INTENT]: this.onYes,
            [Intents.YES_INTENT]: this.onYes,
            [Intents.NO_INTENT]: this.onCancel,
            [Intents.CANCEL_INTENT]: this.onCancel,
            [Intents.HELP_INTENT]: this.onHelp
            // TODO Handle pick card resuming and using selection
        };
    }

    onYes(intentObj, session, response){
        ALL_STATES.StartingGame.enter(session, response);
    }

    onCancel(intentObj, session, response){
        const nextState = session.attributes.previousStateName;
        session.attributes.previousStateName = null;
        ALL_STATES[nextState].enter(session, response);
    }

    onHelp(intentObj, session, response){
        response.askPlain("You can abandon the current game and start a new one by saying 'yes' or 'new game', " +
            "you can continue the game in progress by saying 'no' or 'cancel', or you exit entirely by saying 'exit'.");
    }
}

export default ConfirmingRestart;
