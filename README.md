# A Trello-like Application

A quick view of this application can be seen at [http://ckkok.github.io/Trello-like](http://ckkok.github.io/Trello-like).

### Installation
- Clone/download this repository. Ensure that the `Components` folder is installed in the root directory.
	- If the components are to be used elsewhere, please import the templates from `index.html` along with them as dependencies.
- Install the `json-server` package globally via the command `npm i -g json-server`. You may need sudo rights on Mac/Linux depending on your setup.
- Start the server with the command `json-server ./materials/db.json --static ./` and open http://localhost:3000 in your browser.


### Features

- Create a new column with the `Add a column...` link
- Edit a column's title by directly clicking on it
- Delete columns
- Create a new card in a column with the `Add a card...` link at the bottom of the column.
- Edit a card's title or description by directly clicking on its text
- Expand a card to see its full contents
- Delete cards
- Search for cards via keywords
- Drag and drop a card from one column to another via its drag handle
- Export and download your data for offline storage
- Documentation according to JSDocs standards
- Runs best on Chrome. Safari and Edge are supported via polyfills. Other browsers tested on: iOS Safari, Android Chrome, and Samsung Internet.

## Known issues
- Touch support is not complete although the view responds to different window sizes. In particular, dragging a card via touch will not work well, if at all.
- Unit tests were specified (using Jasmine) but not written.
- Firefox users may experience font size issues, but enabling experimental mode should resolve that as it will enable Web Components support.

## For further work (Check latest branch)
- Complete unit tests
- Implement touch support
- Map front-end data update requests to server calls