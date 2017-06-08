import MemoryMatchSkill from './MemoryMatchSkill';

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
const APP_ID = process.env.APP_ID;

// Create the handler that responds to the Alexa Request.
export function handler(event, context, callback) {
    // Create an instance of the memory match Skill.
    var skill = new MemoryMatchSkill(APP_ID);
    skill.execute(event, context, callback);
}

export default handler;
