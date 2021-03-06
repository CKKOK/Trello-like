let cardId = 1;

// For keeping track of the element currently being dragged. This also implies that we only support a single drag element now. This should be an array for multi-touch drag events.
let __draggedCard = null;
let __dragEnded = true;

/**
 * Creates a new column using the column-template on html page.
 * @class 
 * @classdesc A Card that contains a title and description. Draggable using a handle. Collapsed by default, but expandable using a handle. Also deletable. Emits data through the update method.
 */
class Card extends HTMLElement {
    constructor(id, title, description, updateFunc) {
        super();
        cardId++;
        const template = document.getElementById('card-template').content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));
        
        this.id = id;
        this.title = title;
        this.description = description;
        this.updateFunc = updateFunc;

        this.destroy = this.destroy.bind(this);
        this.update = this.update.bind(this);
        this.dragStart = this.dragStart.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        // this.dragOver = this.dragOver.bind(this);
        // this.dragEnter = this.dragEnter.bind(this);
        // this.dragLeave = this.dragLeave.bind(this);
        // this.drop = this.drop.bind(this);
        
    }
    
    update(event = null, create = false, del = false) {
        this.updateFunc({
            id: this.id,
            title: this.cardTitle.textContent,
            description: this.cardDescription.textContent,
            columnId: this.getRootNode().host.id
        }, create, del);
    }

    toggleHeight(e){
        this.classList.toggle('expanded');
        if (this.classList.contains('expanded')) {
            e.target.innerHTML = '&#x21E7;';
        } else {
            e.target.innerHTML = '&#x21E9;';
        }
    }

    toggleDraggable(e){
        const card = this.getRootNode().querySelector('.card');
        if (card.getAttribute('draggable') == 'true') {
            card.setAttribute('draggable', "false");
        } else {
            card.setAttribute('draggable', "true");
        }
    };
    // Returns true if either the title or description contains the given text
    has(text, ignoreCase = false) {
        const title = ignoreCase ? this.cardTitle.textContent.toLowerCase() : this.cardTitle.textContent;
        const content = ignoreCase ? this.cardDescription.textContent.toLowerCase() : this.cardDescription.textContent;
        const searchString = ignoreCase ? text.toLowerCase() : text;
        return (title.includes(searchString) || content.includes(searchString));
    }

    hide() {
        this.shadowRoot.querySelector('.card').classList.add('hidden');
    }

    show() {
        this.shadowRoot.querySelector('.card').classList.remove('hidden');
    }

    dragStart(e) {
        __draggedCard = e.target.getRootNode().host;
        __dragEnded = false;
        e.dataTransfer.setData('text/plain', this.id);
    }

    dragEnd(e) {
        __draggedCard = null;
    }

    dragOver(e) {
        const targetId = e.target.getRootNode().host.id;
        const hostId = __draggedCard.id;
        if (targetId != hostId) {
            e.preventDefault();
        };
    }

    dragEnter(e) {
        const targetId = e.target.getRootNode().host.id;
        const hostId = __draggedCard.id;
        if (targetId != hostId) {
            e.preventDefault();
        };
    }

    dragLeave(e) {
        // No styling required in this implementation yet, for future work in changing the style of a card when it leaves a droppable zone
    }

    drop(e) {
        // In case the user drops the card on a card, get the column that the card is in.
        e.preventDefault();
        if (!__dragEnded) {
            const column = e.target.getRootNode().host.getRootNode().host || e.target.getRootNode().host;
            column.add(__draggedCard);
            __dragEnded = true;
        };
    }

    getDescription() {
        return this.cardDescription.textContent;
    }

    getId() {
        return this.id;
    }

    destroy() {
        this.cardTitle.removeEventListener('input', this.update);
        this.cardDescription.removeEventListener('input', this.update);
        this.btnDrag.removeEventListener('mouseenter', this.toggleDraggable);
        this.btnDrag.removeEventListener('mouseleave', this.toggleDraggable);
        this.btnExpand.removeEventListener('click', this.toggleHeight);
        this.btnDelete.removeEventListener('click', this.destroy);

        const card = this.shadowRoot.querySelector('.card');
        card.removeEventListener('dragstart', this.dragStart);
        card.removeEventListener('dragend', this.dragEnd);
        card.removeEventListener('dragover', this.dragOver);
        card.removeEventListener('dragenter', this.dragEnter);
        card.removeEventListener('dragleave', this.dragLeave);
        card.removeEventListener('drop', this.drop);
        this.update(null, false, true);
        this.parentNode.removeChild(this);
    }
    connectedCallback() {
        if (!this.cardTitle) {
            this.cardTitle = document.createElement('div');
            this.cardTitle.setAttribute('slot', 'card-title');
            this.cardTitle.setAttribute('contenteditable', 'true');
            this.cardTitle.textContent = this.title;
            this.cardTitle.addEventListener('input', this.update);
            this.appendChild(this.cardTitle);
    
            this.cardDescription = document.createElement('div');
            this.cardDescription.setAttribute('slot', 'card-description');
            this.cardDescription.setAttribute('contenteditable', 'true');
            this.cardDescription.textContent = this.description;
            this.cardDescription.addEventListener('input', this.update);
            this.appendChild(this.cardDescription);

            this.btnDrag = this.shadowRoot.querySelector('.card-drag-icon');
            this.btnExpand = this.shadowRoot.querySelector('.card-expand-icon');
            this.btnDelete = this.shadowRoot.querySelector('.card-delete-icon');

            const card = this.shadowRoot.querySelector('.card');
            const cardContent = this.shadowRoot.querySelector('.card-content');
            this.toggleHeight = this.toggleHeight.bind(cardContent);
            this.btnDrag.addEventListener('mouseenter', this.toggleDraggable);
            this.btnDrag.addEventListener('mouseleave', this.toggleDraggable);
            this.btnExpand.addEventListener('click', this.toggleHeight);
            this.btnDelete.addEventListener('click', this.destroy);
            this.toggleDraggable = this.toggleDraggable.bind(this);

            card.addEventListener('dragstart', this.dragStart);
            card.addEventListener('dragend', this.dragEnd);
            card.addEventListener('dragover', this.dragOver);
            card.addEventListener('dragenter', this.dragEnter);
            card.addEventListener('dragleave', this.dragLeave);
            card.addEventListener('drop', this.drop);

            // Update the data store with a create event
            this.update(null, true, false);
        }
    }

    disconnectedCallback() {
        // Actions to be done
    }

    attributeChangedCallback() {
        // To be called in case of any changes in attributes in future.
    }
}

class ProtoCard extends HTMLElement {
    constructor(container, updateFunc) {
        super();
        
        const template = document.getElementById('proto-card-template').content;
        this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));

        this.container = container;

        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.makeNewCard = this.makeNewCard.bind(this);
        this.updateFunc = updateFunc;
        
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
        this.input.focus();
    }

    makeNewCard(){
        this.container.add(new Card(cardId, `Card ${cardId}`, this.input.value, this.updateFunc), false);
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