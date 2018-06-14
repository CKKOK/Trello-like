let columnIds = 0;

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

        this.destroy = this.destroy.bind(this);
        this.update = this.update.bind(this);
    }

    getAllCards() {
        let result = this.shadowRoot.querySelectorAll('card-element');
        return result;
    }

    update() {
        this.updateFunc({
            id: this.id,
            title: this.colTitle.textContent
        })
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
    }

    disconnectedCallback() {

    }

    attributeChangedCallback() {

    }

    add(card) {
        // Append the new card before the new card form
        // Update the new card's columnId field
        const columnCardList = this.shadowRoot.querySelector('.column-card-list');
        columnCardList.insertBefore(card, columnCardList.children[columnCardList.children.length - 1]);
    }

    destroy() {
        // Call the destroy method on each card to remove all event listeners to safeguard against memory leaks
        // Then remove all event listeners on the column
        let cards = this.getAllCards();
        cards.forEach(card => card.destroy());
        this.parentNode.removeChild(this);
    }
}

class ProtoColumn extends HTMLElement {
    constructor(updateFunc) {
        super();
        const template = document.getElementById('proto-column-template').content;
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.cloneNode(true));

        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.makeNewColumn = this.makeNewColumn.bind(this);
        this.updateFunc = updateFunc;
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
        MAIN.insertBefore(new Column(__data.columns.length, title, this.updateFunc), this);
        this.cancel();
    }
}


customElements.define('column-element', Column);
customElements.define('proto-column-element', ProtoColumn);