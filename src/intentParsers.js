import { getCard } from './cardUtils';

export function getCardSelectionFromPickCardIntent(pickCardIntent, session){
    // decrease both positions, since users work with 1-indexed positions
    const row = parseInt(pickCardIntent.slots.Row.value, 10) - 1;
    const col = parseInt(pickCardIntent.slots.Col.value, 10) - 1;
    const card = getCard(row, col, session.attributes.cards);
    return { row, col, card };
}
