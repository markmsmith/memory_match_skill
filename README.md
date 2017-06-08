# memory_match_skill
An Alexa skill that let's you play a memory match game, where you match pairs of cards.

## Development
This project uses [Yarn](https://github.com/yarnpkg/yarn) for it's package management, but you can use npm if you prefer.
To make your own version of this skill do the following:
 * Setup a new skill in the [Alexa Skills](https://developer.amazon.com/edw/home.html#/skills/list) part of the Amazon Developer Dashboard, grabbing the ID from the top of the page.  It should look something like `amzn1.ask.skill.a123abcd-1234-42ab-cafe-123beef12345`
 * Fork this project and clone the repository.
 * Edit the `APP_ID` constant in [src/index.js](https://github.com/markmsmith/memory_match_skill/blob/master/src/index.js#L24) to match your skill's ID.
 * In the terminal, cd where you cloned your fork of the project and execute `yarn install` (or `npm install`) to pull down all the development dependencies
 * Run `yarn run package` (or `npm run package`) to transpile the sources with babel, run the tests and build the memory_match.zip file in the newly created `dist` directory.
 * Setup a new AWS Lambda function, you can find a tutorial [here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function).  Instead of entering the example code, upload the memory_match.zip.
 * At the bottom of the 'Code' tab, add an environment variable with the key `APP_ID` and the value `amzn1.ask.skill.YOUR_ID_HERE`, where the value should be the skill ID you grabbed from the dashboard in the first step.
 * Finish setting up your Alexa Skill by configuring the IntentSchema and SampleUtterances, copying the values from the respective files under `speechAssets`.
 * Now modify the project to make it your own.
 
