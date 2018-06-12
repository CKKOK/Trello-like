class Search extends HTMLElement {
    constructor(searchFunc) {
        super();
        
        const shadowRoot = this.attachShadow({mode: 'open'});
        const searchBar = document.createElement('input');
        shadowRoot.appendChild(searchBar);

        const searchBtn = document.createElement('input');
        shadowRoot.appendChild(searchBtn);

        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);

        this.searchFunc = searchFunc;
        this.input = searchBar;

        searchBar.addEventListener('change', this.changeHandler);
        searchBtn.addEventListener('click', this.submitHandler);
    }

    changeHandler(event) {
        searchFunc(this.input.value);
    }

    submitHandler(event) {
        event.preventDefault();
        searchFunc(this.input.value);
    }
}

customElements.define('search-element', Search);