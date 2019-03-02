[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/export-panel.svg)](https://www.npmjs.com/package/@advanced-rest-client/export-panel)

[![Build Status](https://travis-ci.org/advanced-rest-client/export-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/export-panel)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/export-panel)

## &lt;export-panel&gt;

Data export panel for Advanced REST Client.

The panel works with `@advanced-rest-client/arc-data-export` element to prepare the data.

```html
<export-panel></export-panel>
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/export-panel
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/export-panel/export-panel.js';
    </script>
  </head>
  <body>
    <export-panel></export-panel>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@advanced-rest-client/export-panel/export-panel.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <export-panel></export-panel>
    `;
  }

  _authChanged(e) {
    console.log(e.detail);
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/export-panel
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
