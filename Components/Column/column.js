function setStyle(element, styles) {
    Object.assign(element.style, styles);
};

function setStyleAll(selector, styles) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => Object.assign(el.style, styles));
};

class Column extends HTMLElement {
    constructor(id, title, store) {
        super();
        const template = document.getElementById('column-template').content;
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.cloneNode(true));

        this.setAttribute('data-id', id);
        this.title = title || 'New Column';
        this.store = store;

        this.destroy = this.destroy.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.editTitle = this.editTitle.bind(this);
        this.done = this.done.bind(this);
    }

    setTitle(title) {
        this.colTitle.textContent = title;
        let columnStoreData = this.store.columns.find(obj => obj.id === parseInt(this.dataset.id));
        columnStoreData.title = title;
    }

    editTitle(){
        this.colTitle.setAttribute('contenteditable', 'true');
        this.colTitle.classList.toggle('edit-title');
        this.colTitle.focus();
    }

    done() {
        this.colTitle.setAttribute('contenteditable', 'false');
        this.colTitle.classList.toggle('edit-title');
    }
    connectedCallback() {
        this.colTitle = document.createElement('span');
        this.colTitle.setAttribute('slot', 'column-title');
        this.colTitle.textContent = this.title;
        this.colTitle.addEventListener('click', this.editTitle);
        this.colTitle.addEventListener('input', () => {console.log(this.textContent)});
        this.appendChild(this.colTitle);

        const columnCardList = this.shadowRoot.querySelector('.column-card-list');
        columnCardList.appendChild(new ProtoCard(this));
    }

    disconnectedCallback() {

    }

    attributeChangedCallback() {

    }

    add(card) {
        const columnCardList = this.shadowRoot.querySelector('.column-card-list');
        columnCardList.insertBefore(card, columnCardList.children[columnCardList.children.length - 1]);
    }

    destroy() {
        this.parentNode.removeChild(this);
    }
}

class ProtoColumn extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById('proto-column-template').content;
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.cloneNode(true));

        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.makeNewColumn = this.makeNewColumn.bind(this);
    }

    connectedCallback() {
        let shadowRoot = this.shadowRoot;
        this.input = shadowRoot.querySelector('.proto-column-input');
        this.btnSubmit = shadowRoot.querySelector('.proto-column-btn-submit');
        this.btnCancel = shadowRoot.querySelector('.proto-column-btn-cancel');
        this.placeholder = shadowRoot.querySelector('.proto-column-placeholder');

        

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
        MAIN.insertBefore(new Column(__data.columns.length, title, __data), this);
        this.cancel();
    }
}


customElements.define('column-element', Column);
customElements.define('proto-column-element', ProtoColumn);