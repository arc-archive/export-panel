[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/export-panel.svg)](https://www.npmjs.com/package/@advanced-rest-client/export-panel)

[![Build Status](https://travis-ci.org/advanced-rest-client/export-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/export-panel)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@advanced-rest-client/export-panel)

## export-panel

Data export panel for Advanced REST Client.

The panel works with `@advanced-rest-client/arc-data-export` element to prepare the data. See it's documentation for proper file events handling.

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

### In a LitElement template

```js
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/export-panel/export-panel.js';

class SampleElement extends LitElement {
  render() {
    return html`<export-panel></export-panel>`;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/export-panel
cd export-panel
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```
