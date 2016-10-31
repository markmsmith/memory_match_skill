import * as Intents from './intents';

/**
 * Represents the current state of the game and which intents can be handled while in this state.
 */
export class State {

    constructor(intentHandlers) {
        // get the name from the class name
        this.name = this.constructor.name;

        // setup the handlers, if any
        this.intentHandlers = this.buildIntentHandlers() || {};

        // add the global stop/exit handler last so it can't be overwritten
        this.intentHandlers[Intents.STOP_INTENT] = this.onStop;
    }

    /**
     * Template method to return the map (object) of Intent (eg Intents.PICK_CARD_INTENT) -> handling function pairs.
     * The handling function should have the signature (intentObj, session, response)
     */
    buildIntentHandlers(){
        return {};
    }

    /**
     * Attempts to handle the given intent with the state's handlers and update the session, returning true if
     * succesfull or null if no matching handler found.
     */
    handleIntent(intentName, intentObj, session, response) {
        var handler = this.intentHandlers[intentName];
        if (handler) {
            handler.call(this, intentObj, session, response);
            return true;
        }

        // no suitable handler found
        return false;
    }

    onStop(intentObj, session, response) {
        response.tell('Goodbye.');
    }

    // For debugging
    logIntent(intentName, intentObj, session, response) {
        /* eslint no-console: ["ignore"] */
        console.log(`Handling intent ${intentName}:\n`+
                    `intentObj: ${JSON.stringify(intentObj)}\n`+
                    `session: ${JSON.stringify(session)}`);
    }
}

export default State;
