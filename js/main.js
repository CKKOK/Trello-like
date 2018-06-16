// Detect whether we are in testing mode
const ENV_TEST = typeof(jasmine) === 'undefined' ? false : true;

/**
 * @constant {DOMElement} MAIN - main section of the page
 * @constant {DOMElement} HEADER - header section, where the title and the search bar lives
 * @constant {DOMElement} BTN_EXPORT - export data button, downloads the data in .json format when clicked
 * @constant {string} DATA_SOURCE - location of cards/columns data to initialize the view with
 * @constant {Object} __data - single data store containing the state of the columns and cards 
 */
const MAIN = document.querySelector('main');
const HEADER = document.querySelector('header');
const BTN_EXPORT = document.querySelector('.btn-export');
const DATA_SOURCE = './materials/db.json';
const __data = {
    columns: [],
    cards: []
};

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
        if (!create && !del) {
            let col = __data.columns.find(obj => parseInt(obj.id) === parseInt(state.id));
            col.title = state.title;
        } else if (create === true) {
            __data.columns.push(state);
        } else if (del === true) {
            let length = __data.columns.length;
            for (let i = 0; i < length; i++) {
                if (__data.columns[i].id == parseInt(state.id)) {
                    __data.columns.splice(i, 1);
                    break;
                };
            };
        }
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
        if (create == false && del == false) {
            let card = __data.cards.find(obj => obj.id === state.id);
            card.title = state.title;
            card.description = state.description;
            card.columnId = state.columnId;
        } else if (create === true) {
            __data.cards.push(state);
        } else if (del === true) {
            let length = __data.cards.length;
            for (let i = 0; i < length; i++) {
                if (__data.cards[i].id == parseInt(state.id)) {
                    __data.cards.splice(i, 1);
                    break;
                };
            };
        };
    };
};

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
    };
};


/**
 * @function onSearch - Search for a string within all the cards' titles and descriptions
 * @function cancelSearch - returns all cards in all columns to their shown state, called when the search input is empty
 * @param {string} searchString - string to be searched for
 */
function cancelSearch() {
    const columnsAll = Array.from(document.querySelectorAll('column-element'));
    const cardsAll = columnsAll.reduce((arr, col) => {
        return arr.concat(Array.from(col.getAllCards()))
    }, []);
    cardsAll.forEach(card => {
        card.show();
    });
};

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

};

/**
 * @function init - Reads the data and creates the columns and cards stored in it
 * @param {Object} data - initial data on cards and columns
 */
function init(data) {

    const columns = {};

    data.columns.forEach(col => {
        const column = new Column(col.id, col.title, columnUpdateFunc, cardUpdateFunc);
        columns[col.id] = column;
        MAIN.appendChild(column);
    });

    data.cards.forEach(cd => {
        const card = new Card(cd.id, cd.title, cd.description, cardUpdateFunc);
        columns[cd.columnId].add(card, true);
    });

    MAIN.appendChild(new ProtoColumn(columnUpdateFunc, cardUpdateFunc));
};

function getData() {
    fetch(DATA_SOURCE)
    .then(response => response.json())
    .then(data => {
        init(data);
    });
}

if (!ENV_TEST) {

    HEADER.appendChild(new Search(onSearch));
    BTN_EXPORT.addEventListener('click', save);

    // AJAX call to fetch the boilerplate database, then clone its contents into the __data object, then calls the init function. When connecting to a backend database, amend the DATA_SOURCE constant itself.
    getData();
}