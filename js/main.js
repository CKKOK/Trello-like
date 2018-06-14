

/**
 * @constant {DOMElement} MAIN - main section of the page
 * @constant {DOMElement} HEADER - header section, where the title and the search bar lives
 * @constant {DOMElement} BTN_EXPORT - export data button, downloads the data in .json format when clicked
 * @constant {Object} __data - single data store containing the state of the columns and cards 
 */
const MAIN = document.querySelector('main');
const HEADER = document.querySelector('header');
const BTN_EXPORT = document.querySelector('.btn-export');
const __data = {};
// const __COLUMNS = {};
// const __CARDS = {};

// Modify card ::DONE
// Delete card::DONE
// Add column::DONE
// Modify column::DONE
// Delete column::DONE
// Search for cards
// Drag and drop card from one column to another
// Click on a card to expand it::DONE

HEADER.appendChild(new Search(onSearch));
BTN_EXPORT.addEventListener('click', save);

/**
 * @function columnUpdateFunc - Updates the state of a column in our data store
 * @param {Object} state - state of the column
 * @param {string} state.id - column id
 * @param {string} state.title - column title
 * @param {boolean} create - whether a column is being initialized
 * @param {boolean} del - whether a column is being deleted
 */
function columnUpdateFunc(state, create = false, del = false) {
    if (!state.id || !state.title) {
        throw new Error('Missing id or title from update');
    } else {
        let col = __data.columns.find(obj => obj.id === parseInt(state.id));
        col.title = state.title;
    };
};

/**
 * @function cardUpdateFunc - Updates the state of a card in our data store
 * @param {Object} state - state of the card
 * @param {string} state.id
 * @param {string} state.title
 * @param {string} state.description
 * @param {string} state.columnId - id of the column that the card belongs to
 * @param {boolean=} create - whether a card is being initialized
 * @param {boolean=} del - whether a card is being deleted
 */
function cardUpdateFunc(state, create = false, del = false) {
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
    var blobObj = new Blob([JSON.stringify(__data, null, 4)]);
    var filename = 'CardsData';
    // IE support...
    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blobObj, filename + '.json');
    } else {
        var a = document.createElement('a');
        var url = URL.createObjectURL(blobObj);
        a.href = url;
        a.download = filename + '.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}


/**
 * @function onSearch - Search for a string within all the cards' titles and descriptions
 * @param {string} searchString - string to be searched for
 */
function cancelSearch() {
    const columnsAll = Array.from(document.querySelectorAll('column-element'));
    const cardsAll = columnsAll.reduce((arr, col) => {
        return arr.concat(Array.from(col.getAllCards()))
    }, []);
    cardsAll.forEach(card => {
        card.show();
    })
}

function onSearch(searchString) {
    if (searchString === '') {
        cancelSearch();
        return;
    };
    const columnsAll = Array.from(document.querySelectorAll('column-element'));
    const cardsAll = columnsAll.reduce((arr, col) => {
        return arr.concat(Array.from(col.getAllCards()))
    }, []);
    cardsAll.forEach(card => {
        card.has(searchString, true) ? card.show() : card.hide();
    });

}

function init() {

    const columns = {};

    __data.columns.forEach(col => {
        const column = new Column(col.id, col.title, columnUpdateFunc, cardUpdateFunc);
        columns[col.id] = column;
        MAIN.appendChild(column);
    });

    __data.cards.forEach(cd => {
        const card = new Card(cd.id, cd.title, cd.description, cardUpdateFunc);
        columns[cd.columnId].add(card);
    });

    MAIN.appendChild(new ProtoColumn(columnUpdateFunc));
}


fetch('./materials/db.json')
    .then(response => response.json())
    .then(data => {
        Object.assign(__data, data);
        init();
    });
