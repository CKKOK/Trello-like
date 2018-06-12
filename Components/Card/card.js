function setStyle(element, styles) {
    Object.assign(element.style, styles);
};

function setStyleAll(selector, styles) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => Object.assign(el.style, styles));
};

class Card extends HTMLElement {
    constructor(id, title, description, store) {
        super();
        const template = document.getElementById('card-template').content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));
        
        this.setAttribute('data-id', id);
        this.setAttribute('draggable', true);

        this.title = title;
        this.description = description;
        this.store = store;

        this.setEditMode = this.setEditMode.bind(this);
        this.exitEditMode = this.exitEditMode.bind(this);
        this.destroy = this.destroy.bind(this);
    
    }

    toggleHeight(){
        this.classList.toggle('expanded');
    }
    setEditMode(){
        this.btnEdit.style.display = 'none';
        this.btnSubmit.style.display = 'block';
        this.btnCancel.style.display = 'block';
    }

    exitEditMode(){
        this.btnEdit.style.display = 'block';
        this.btnSubmit.style.display = 'none';
        this.btnCancel.style.display = 'none';
    }
    setTitle(title) {
        this.cardTitle.textContent = title;
        let cardStoreData = this.store.cards.find(obj => obj.id === this.dataset.id);
        cardStoreData.title = title;
    }

    setDescription(description) {
        this.cardDescription.textContent = description;
        let cardStoreData = this.store.cards.find(obj => obj.id === this.id);
        cardStoreData.description = description;
    }

    destroy() {
        this.parentNode.removeChild(this);
    }
    connectedCallback() {
        if (!this.cardTitle) {
            this.cardTitle = document.createElement('span');
            this.cardTitle.setAttribute('slot', 'card-title');
            this.cardTitle.textContent = this.title;
            this.appendChild(this.cardTitle);
    
            this.cardDescription = document.createElement('span');
            this.cardDescription.setAttribute('slot', 'card-description');
            this.cardDescription.textContent = this.description;
            this.appendChild(this.cardDescription);
    
            this.btnEdit = this.shadowRoot.querySelector('.btn-edit');
            this.btnSubmit = this.shadowRoot.querySelector('.btn-submit');
            this.btnCancel = this.shadowRoot.querySelector('.btn-cancel');

            this.shadowRoot.querySelector('.card-content').addEventListener('click', this.toggleHeight);
        }
    }

    disconnectedCallback() {

    }

    attributeChangedCallback() {

    }
}

class ProtoCard extends HTMLElement {
    constructor(container) {
        super();
        this.container = container;
        const template = document.getElementById('proto-card-template').content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));

        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.makeNewCard = this.makeNewCard.bind(this);

        
    }

    connectedCallback() {
        let shadowRoot = this.shadowRoot;
        this.input = shadowRoot.querySelector('.proto-card-input');
        this.btnSubmit = shadowRoot.querySelector('.proto-card-btn-submit');
        this.btnCancel = shadowRoot.querySelector('.proto-card-btn-cancel');
        this.placeholder = shadowRoot.querySelector('.proto-card-placeholder');

        this.btnGroup = shadowRoot.querySelector('.btn-group');
        this.placeholder.addEventListener('click', this.edit);
        this.btnSubmit.addEventListener('click', this.makeNewCard);
        this.btnCancel.addEventListener('click', this.cancel);
    }

    edit(){
        this.placeholder.style.display = 'none';
        this.input.style.display = 'block';
        this.btnGroup.style.display = 'block';
    }

    makeNewCard(){
        this.container.add(new Card(0, 'New card', this.input.value, null));
        this.input.value = '';
        this.cancel();
    }

    cancel(){
        this.placeholder.style.display = 'block';
        this.input.style.display = 'none';
        this.btnGroup.style.display = 'none';
    }

}

customElements.define('card-element', Card);
customElements.define('proto-card-element', ProtoCard);