class Search extends HTMLElement {
    constructor(searchFunc) {
        super();
        const template = document.getElementById('search-template').content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));

        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);

        this.searchFunc = searchFunc;
        
    }

    connectedCallback() {
        const form = this.shadowRoot.querySelector('form');
        const searchBar = this.shadowRoot.querySelector('.search-input');
        const searchBtn = this.shadowRoot.querySelector('.btn-search');
        this.input = searchBar;
        searchBar.addEventListener('input', this.changeHandler);
        form.addEventListener('submit', this.submitHandler);
        searchBtn.addEventListener('click', this.submitHandler);
    }

    changeHandler(event) {
        this.searchFunc(this.input.value);
    }

    submitHandler(event) {
        event.preventDefault();
        this.searchFunc(this.input.value);
    }
}

customElements.define('search-element', Search);