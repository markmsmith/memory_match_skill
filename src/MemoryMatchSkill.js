import AlexaSkill from './AlexaSkill';
import ALL_STATES from './states';
import { START_GAME_INTENT } from './intents';

const StartingGame = ALL_STATES.StartingGame;

const SKILL_PROBLEM_MESSAGE = "I'm sorry, there was a problem with this skill, please try again later.";
const RETRY_MESSAGE = "Sorry, I didn't understand, please try again.";

/**
 * Implements the Alexa Skill for the Memory Match game using a state machine.
 * Each server response will include in the session attributes the property 'stateName', which will give the name of the
 * State instance that will handle any reply (Intent) from the user.  In this way, we only worry about intents that make
 * sense for the current state.
 *
 * The possible states, the intents they can handle, and where they navigate to are as follows:
 * State                Valid Intents (navigates to)
 * =====                ============================
 * StartingGame         None (navigates into PickingFirstCard)
 *
 * PickingFirstCard     PickCard (PickSecondCard)
 *                      StartOver (ConfirmingRestart)
 *                      StartGame (ConfirmingRestart)
 *                      Stop (exit)
 *                      Cancel (exit)
 *                      Help
 *
 * PickingSecondCard    PickCard
 *                      StartOver (ConfirmingRestart)
 *                      StartGame (ConfirmingRestart)
 *                      Stop (exit)
 *                      Cancel (exit)
 *                      Help
 *
 * ConfirmingRestart    Yes (StartingGame)
 *                      No (go to previous state)
 *                      Cancel (go to previous state)
 *                      Stop (exit)
 *                      Help
 *
 * GameOver             Yes (StartingGame)
 *                      No (exit)
 *                      Stop (exit)
 *                      Cancel (exit)
 *                      StartGame (StartingGame)
 *                      StartOver (StartingGame)
 *                      PickCard (explain game is finished, then StartingGame)
 *                      Help
 */
export default class MemoryMatchSkill extends AlexaSkill {
    constructor(appId) {
        super(appId);

        // override the default event handlers
        this.eventHandlers.onLaunch = this.onLaunch;
        this.eventHandlers.onIntent = this.onIntent;
    }

    onLaunch(launchRequest, session, response) {
        // StartingGame is a psuedo state, since we don't need to construct it and it has no intents
        StartingGame.enter(session, response);
    }

    onIntent(intentRequest, session, response) {
        const intentObj = intentRequest.intent;
        const intentName = intentObj.name;

        // get the state that matches that requested by the session
        var state = this.getState(session);

        if (!state) {
            // if we don't find it, maybe we launched with a start game request
            if (intentName === START_GAME_INTENT) {
                StartingGame.enter(session, response);
                return;
            } else {
                console.error('Valid state not set for intent:\n' +
                            `${JSON.stringify(intentRequest)}\n` +
                            'With session:\n'+
                            JSON.stringify(session));
                response.tell(SKILL_PROBLEM_MESSAGE);
                return;
            }
        }

        try {
            var handled = state.handleIntent(intentName, intentObj, session, response);
        }
        catch (e) {
            console.error(`Problem while trying to handle intent: ${JSON.stringify(intentObj)}\n with session:\n` +
                          `${JSON.stringify(session)}\nGot Error: ${e.toString()}`);
            console.error(e.stack);
            response.tell(SKILL_PROBLEM_MESSAGE);
            return;
        }

        // probably called an intent that isn't valid in the current state
        if (!handled) {
            response.ask(RETRY_MESSAGE, RETRY_MESSAGE);
        }
    }

    getState(session) {
        // check if we know about the requested state
        if (session.attributes && session.attributes.stateName && ALL_STATES[session.attributes.stateName]) {
            // construct it
            return new ALL_STATES[session.attributes.stateName]();
        }

        // no matching state found
        return null;
    }
}
