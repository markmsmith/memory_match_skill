import StartingGame from './StartingGame';
import PickingFirstCard from './PickingFirstCard';
import PickingSecondCard from './PickingSecondCard';
import GameOver from './GameOver';
import ConfirmingRestart from './ConfirmingRestart';

// Need to do this to re-export the states so that consumers don't need to reference the individual files but instead
// can bulk import
const ALL_STATES = {
    StartingGame,
    PickingFirstCard,
    PickingSecondCard,
    GameOver,
    ConfirmingRestart
};
export default ALL_STATES;
