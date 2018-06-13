const COLUMN_CLASS = 'column';
const CARD_CLASS = 'card';

const MAIN = document.querySelector('main');

let __data = null;
const __COLUMNS = {};
const __CARDS = {};

// Modify card
// Delete card
// Add column
// Modify column
// Delete column
// Search for cards
// Drag and drop card from one column to another
// Click on a card to expand it

function getCardsOfColumn(n) {
    return __data["cards"].filter(card => {
        return parseInt(card['columnId']) === n;
    })
}

function columnUpdateFunc(state) {
    // We expect the state object to have the signature {id, title}
    if (!state.id || !state.title) {
        throw new Error('Missing id or title from update');
    } else {
        let col = __data.columns.find(obj => obj.id === parseInt(state.id));
        col.title = state.title;
    };
};

function cardUpdateFunc(state) {
    // We expect the state object to have the signature {id, title, description, columnId}
    if (!state.id || !state.title || !state.description || !state.columnId) {
        throw new Error('Missing id, title, description, or columnId from update');
    } else {
        let card = __data.cards.find(obj => obj.id === parseInt(state.id));
        card.title = state.title;
        card.description = state.description;
        card.columnId = state.columnId;
    };
}

function save() {

}

function init() {
    __data.columns.forEach(col => {
        const column = new Column(col.id, col.title, __data);
        __COLUMNS[col.id] = column;
        MAIN.appendChild(column);
    });

    __data.cards.forEach(cd => {
        const card = new Card(cd.id, cd.title, cd.description, __data);
        __CARDS[cd.id] = card;
        __COLUMNS[cd.columnId].add(card);
    });

    MAIN.appendChild(new ProtoColumn());
}

function onSearch(searchString) {

}

window.onload = function() {
    fetch('./materials/db.json')
        .then(response => response.json())
        .then(data => {__data = data; init()});
    
}