let columnIds = 1;

/**
 * Creates a new column using the column-template on html page.
 * @class
 * @classdesc A Column with a title that contains Cards. Depends on the Card class. Emits data through the update method. The cardUpdateFunc method is passed through to new cards and isn't to be used elsewhere in the class to keep some semblance of purity.
 */
class Column extends HTMLElement {
    constructor(id, title, updateFunc, cardUpdateFunc) {
        super();
        columnIds++;
        const template = document.getElementById('column-template').content;
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.cloneNode(true));

        this.id = id;
        this.title = title || 'New Column';
        this.updateFunc = updateFunc;
        this.cardUpdateFunc = cardUpdateFunc;

        this.dragEnter = this.dragEnter.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.dragLeave = this.dragLeave.bind(this);
        this.drop = this.drop.bind(this);

        this.destroy = this.destroy.bind(this);
        this.update = this.update.bind(this);
    }

    getAllCards() {
        let result = this.shadowRoot.querySelectorAll('card-element');
        return result;
    }

    update(event = null, create = false, del = false) {
        this.updateFunc({
            id: this.id,
            title: this.colTitle.textContent
        }, create, del);
    }
    connectedCallback() {
        this.colTitle = document.createElement('div');
        this.colTitle.setAttribute('slot', 'column-title');
        this.colTitle.textContent = this.title;
        this.colTitle.addEventListener('input', this.update);
        this.appendChild(this.colTitle);

        const columnCardList = this.shadowRoot.querySelector('.column-card-list');
        columnCardList.appendChild(new ProtoCard(this, this.cardUpdateFunc));

        this.btnDelete = this.shadowRoot.querySelector('.column-delete-icon');
        this.btnDelete.addEventListener('click', this.destroy);

        this.addEventListener('dragenter', this.dragEnter);
        this.addEventListener('dragover', this.dragOver);
        this.addEventListener('dragleave', this.dragLeave);
        this.addEventListener('drop', this.drop);

        // Update the data store with a create event
        this.update(null, true, false);
    }

    disconnectedCallback() {
        this.btnDelete.removeEventListener('click', this.destroy);
        console.log(`Column ${this.id} disconnected`);
    }

    attributeChangedCallback() {
        // To be called in future if any attribute changes, e.g. id
    }

    dragEnter(e) {
        e.preventDefault();
        let column = null, tagName = e.target.tagName;
        if (tagName === 'COLUMN-ELEMENT') {
            column = e.target;
        } else if (tagName === 'DIV') {
            column = e.target.parentNode;
        };
    }

    dragOver(e) {
        
    }

    dragLeave(e) {
        e.preventDefault();
        let column = null, tagName = e.target.tagName;
        if (tagName === 'COLUMN-ELEMENT') {
            column = e.target;
        } else if (tagName === 'DIV') {
            column = e.target.parentNode;
        };
    }

    drop(e) {
        if (!__dragEnded) {
            let column = null, tagName = e.target.tagName;
            if (tagName === 'COLUMN-ELEMENT') {
                column = e.target;
            } else if (tagName === 'DIV') {
                column = e.target.parentNode;
            }
            column.add(__draggedCard);
        }
    }

    add(card, alreadyInit = false) {
        // Append the new card before the new card form
        // Update the new card's columnId field
        const columnCardList = this.shadowRoot.querySelector('.column-card-list');
        columnCardList.insertBefore(card, columnCardList.children[columnCardList.children.length - 1]);
        if (alreadyInit === false) {
            card.update();
        }
    }

    destroy() {
        // Call the destroy method on each card to remove all event listeners to safeguard against memory leaks
        // Then remove all event listeners on the column
        let cards = this.getAllCards();
        cards.forEach(card => card.destroy());
        this.colTitle.removeEventListener('input', this.update);
        this.btnDelete.removeEventListener('click', this.destroy);
        this.update(null, false, true);
        this.parentNode.removeChild(this);
    }
}

class ProtoColumn extends HTMLElement {
    constructor(columnUpdateFunc, cardUpdateFunc) {
        super();
        const template = document.getElementById('proto-column-template').content;
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.cloneNode(true));

        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.makeNewColumn = this.makeNewColumn.bind(this);
        this.columnUpdateFunc = columnUpdateFunc;
        this.cardUpdateFunc = cardUpdateFunc;
    }

    connectedCallback() {
        let shadowRoot = this.shadowRoot;
        this.input = shadowRoot.querySelector('.proto-column-input');
        this.btnSubmit = shadowRoot.querySelector('.proto-column-btn-submit');
        this.btnCancel = shadowRoot.querySelector('.proto-column-btn-cancel');
        this.placeholder = shadowRoot.querySelector('.proto-column-placeholder');
        this.form = shadowRoot.querySelector('.proto-column-form');
        this.form.addEventListener('submit', this.makeNewColumn);
        this.placeholder.addEventListener('click', this.edit);
        this.btnSubmit.addEventListener('click', this.makeNewColumn);
        this.btnCancel.addEventListener('click', this.cancel);
    }
    edit() {
        this.input.style.display = 'block';
        this.btnSubmit.style.display = 'inline-block';
        this.btnCancel.style.display = 'inline-block';
        this.placeholder.style.display = 'none';
        this.input.focus();
    }
    cancel() {
        this.btnSubmit.style.display = 'none';
        this.btnCancel.style.display = 'none';
        this.input.style.display = 'none';
        this.input.value = '';
        this.placeholder.style.display = 'block';
    }
    makeNewColumn(e) {
        e.preventDefault();
        const title = this.input.value;
        MAIN.insertBefore(new Column(columnIds, title, this.columnUpdateFunc, this.cardUpdateFunc), this);
        this.cancel();
    }
}


customElements.define('column-element', Column);
customElements.define('proto-column-element', ProtoColumn);