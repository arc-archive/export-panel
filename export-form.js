/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html, css } from 'lit-element';
import { archive, driveColor } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@polymer/iron-form/iron-form.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-icon-item.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-input/anypoint-masked-input.js';
import '@polymer/paper-toast/paper-toast.js';
/**
 * Export data form with export flow logic.
 *
 * Provides the UI and and logic to export data from the data store to `destination`
 * export method provider. It uses events API to communicate with other elements.
 *
 * Required elements to be present in the DOM:
 *
 * -   `arc-data-export` - getting data from the datastore
 * -   element that handles `file-data-save` event
 * -   element that handles `google-drive-data-save` event

 * ### Example
 *
 * ```html
 * <arc-data-export app-version="12.0.0" electron-cookies></arc-data-export>
 * <google-drive-upload></google-drive-upload>
 * <file-save></file-save>
 *
 * <export-panel></export-panel>
 * ```
 *
 * ### Styling
 *
 * `<export-panel>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--warning-primary-color` | Error toast background color | `#FF7043`
 * `--warning-contrast-color` | Error toast color | `#fff`
 * `--context-menu-item-color` | Color of the dropdown menu items | ``
 * `--context-menu-item-background-color` | Background olor of the dropdown menu items | ``
 * `--context-menu-item-color-hover` | Color of the dropdown menu items when hovering | ``
 * `--context-menu-item-background-color-hover` | Background olor of the dropdown menu items when hovering | ``
 * `--export-form-action-button-color` | Color of the export button | `#fff`
 * `--export-form-action-button-background-color` | Background color of the export button | `--primary-color`
 *
 * @customElement
 * @memberof UiElements
 * @demo demo/index.html
 */
class ExportForm extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        font-size: var(--arc-font-body1-font-size);
        font-weight: var(--arc-font-body1-font-weight);
        line-height: var(--arc-font-body1-line-height);
      }

      h3 {
        font-size: var(--arc-font-subhead-font-size);
        font-weight: var(--arc-font-subhead-font-weight);
        line-height: var(--arc-font-subhead-line-height);
        font-size: 14px;
      }

      .error-toast {
        background-color: var(--warning-primary-color, #ff7043);
        color: var(--warning-contrast-color, #fff);
      }

      anypoint-listbox iron-icon {
        color: var(--context-menu-item-color);
      }

      anypoint-checkbox {
        margin: 12px 0px;
        display: block;
      }

      .prepare-info {
        font-size: 15px;
        margin-top: 24px;
      }

      .actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 24px;
      }

      .action-button {
        margin-right: 8px;
        background-color: var(--action-button-background-color);
        background-image: var(--action-button-background-image);
        color: var(--action-button-color);
        transition: var(--action-button-transition);
      }

      .action-button:not([disabled]):hover {
        background-color: var(--action-button-hover-background-color);
        color: var(--action-button-hover-color);
      }

      .action-button[disabled] {
        background-color: var(--action-button-disabled-background-color);
        color: var(--action-button-disabled-color);
      }

      .inline-config {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
      }

      .destination-dropdown {
        margin-right: 8px;
      }

      .icon {
        width: 24px;
        height: 24px;
      }
    `;
  }

  _destinationTemplate() {
    const { destination, compatibility, outlined } = this;
    return html`<anypoint-dropdown-menu
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      class="destination-dropdown"
      aria-label="Select export location"
      aria-expanded="false"
      @opened-changed="${this._dropdownOpenedHandler}"
    >
      <label slot="label">Export location</label>
      <anypoint-listbox
        slot="dropdown-content"
        .selected="${destination}"
        @selected-changed="${this._destinationHandler}"
        class="list"
        ?compatibility="${compatibility}"
        attrforselected="data-value"
      >
        <anypoint-icon-item
          class="menu-item"
          data-action="export-all-file"
          data-value="file"
          ?compatibility="${compatibility}">
          <span class="icon" slot="item-icon">${archive}</span>
          Export to file
        </anypoint-icon-item>
        <anypoint-icon-item
          class="menu-item"
          data-action="export-all-drive"
          data-value="drive"
          ?compatibility="${compatibility}">
          <span class="icon" slot="item-icon">${driveColor}</span>
          Export to Google Drive
        </anypoint-icon-item>
        <slot name="destination"></slot>
      </anypoint-listbox>
    </anypoint-dropdown-menu>`;
  }

  _fileInputTemplate() {
    const { fileName, compatibility, outlined } = this;
    return html`<anypoint-input
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      .value="${fileName}"
      name="fileName"
      @value-changed="${this._inputHandler}">
      <label slot="label">Export location</label>
    </anypoint-input>`;
  }

  _exportItemsTemplate() {
    return html`
    <anypoint-checkbox name="saved" checked>Projects and saved request list</anypoint-checkbox>
    <anypoint-checkbox name="history" checked>Requests history</anypoint-checkbox>
    <anypoint-checkbox name="cookies" checked>Cookies</anypoint-checkbox>
    <anypoint-checkbox name="auth" checked>Saved passwords</anypoint-checkbox>
    <anypoint-checkbox name="url-history" checked>URL history</anypoint-checkbox>
    <anypoint-checkbox name="websocket" checked>Web sockets history</anypoint-checkbox>
    <anypoint-checkbox name="variables" checked>Variables data</anypoint-checkbox>
    <anypoint-checkbox name="host-rules" checked>Host rules</anypoint-checkbox>
    <anypoint-checkbox name="client-certificates" checked>Client certificates</anypoint-checkbox>
    `;
  }

  render() {
    const { _loading, compatibility } = this;
    return html`
      <section class="inline-config">
        ${this._destinationTemplate()}
        ${this._fileInputTemplate()}
      </section>

      <iron-form>
        <form enctype="application/json">
          <h3>Data to export</h3>
          ${this._exportItemsTemplate()}
        </form>
      </iron-form>
      ${this._encryptionTemplate()}

      <div class="actions">
        <anypoint-button
          @click="${this._prepare}"
          emphasis="high"
          ?compatibility="${compatibility}"
          ?disabled="${_loading}"
          class="action-button"
          data-action="export"
        >Export</anypoint-button>
        ${_loading ? html`Exporting data...` : ''}
      </div>

      <p class="prepare-info">Depending on the data size it may take a minute</p>
      <paper-toast id="exportError" class="error-toast"></paper-toast>
      <paper-toast id="exportComplete" text="Export complete"></paper-toast>
    `;
  }

  _encryptionTemplate() {
    if (!this.withEncrypt) {
      return '';
    }
    const {
      encryptFile,
      compatibility
    } = this;
    return html`
    <h3>Export options</h3>
    <anypoint-checkbox
      .checked="${encryptFile}"
      name="encryptFile"
      @checked-changed="${this._checkedChanged}"
      ?compatibility="${compatibility}"
      title="Encrypts the file with password so it is not store in plain text."
    >
      Encrypt file
    </anypoint-checkbox>
    ${this._encyptionPasswordTemplate()}`;
  }

  _encyptionPasswordTemplate() {
    if (!this.encryptFile) {
      return;
    }
    const {
      passphrase
    } = this;
    return html`<anypoint-masked-input
      name="passphrase"
      .value="${passphrase}"
      @value-changed="${this._inputHandler}"
    >
      <label slot="label">Encryption passphrase</label>
    </anypoint-masked-input>`;
  }

  static get properties() {
    return {
      /**
       * Export destination name.
       * By default it can be `file` or `drive`.
       */
      destination: { type: String },
      /**
       * When `true` the component began export flow.
       */
      _loading: { type: Boolean },
      /**
       * When set this value will be used for export file name.
       */
      fileName: { type: String },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean },
      /**
       * Enables outlined theme for inputs
       */
      outlined: { type: Boolean },
      /**
       * When set the encrypt file option is enabled.
       */
      encryptFile: { type: Boolean },
      /**
       * Encryption passphrase
       */
      passphrase: { type: String },
      /**
       * When set it renders encryption options.
       */
      withEncrypt: { type: Boolean },
    };
  }

  get loading() {
    return this._loading;
  }

  get _loading() {
    return this.__loading;
  }

  set _loading(value) {
    const old = this.__loading;
    if (old === value) {
      return;
    }
    this.__loading = value;
    this.requestUpdate('_loading', value);
    this.dispatchEvent(
      new CustomEvent('loading-changed', {
        detail: {
          value
        }
      })
    );
  }
  /**
   * @return {Function} Previously registered handler for `loading-changed` event
   */
  get onloadingchnaged() {
    return this['_onloading-changed'];
  }
  /**
   * Registers a callback function for `loading-changed` event
   * @param {Function} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onloadingchnaged(value) {
    this._registerCallback('loading-changed', value);
  }
  /**
   * @return {Function} Previously registered handler for `arc-data-export` event
   */
  get onarcdataexport() {
    return this['_onarc-data-export'];
  }
  /**
   * Registers a callback function for `arc-data-export` event
   * @param {Function} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onarcdataexport(value) {
    this._registerCallback('arc-data-export', value);
  }

  constructor() {
    super();
    this.destination = 'file';
    this.fileName = this.generateFileName();
  }
  /**
   * Registers an event handler for given type
   * @param {String} eventType Event type (name)
   * @param {Function} value The handler to register
   */
  _registerCallback(eventType, value) {
    const key = `_on${eventType}`;
    if (this[key]) {
      this.removeEventListener(eventType, this[key]);
    }
    if (typeof value !== 'function') {
      this[key] = null;
      return;
    }
    this[key] = value;
    this.addEventListener(eventType, value);
  }
  /**
   * Handler for click event. Calls `startExport()` function.
   */
  _prepare() {
    this.startExport();
  }
  /**
   * Selects all items on the list.
   */
  selectAll() {
    const nodes = this.shadowRoot.querySelectorAll('form anypoint-checkbox');
    for (let i = 0, len = nodes.length; i < len; i++) {
      if (!nodes[i].checked) {
        nodes[i].checked = true;
      }
    }
  }
  /**
   * Uses currend form data to start export flow.
   * This function is to expose public API to export data.
   *
   * @return {Promise} A promise resolved when export finishes
   */
  async startExport() {
    const form = this.shadowRoot.querySelector('iron-form');
    const data = form.serializeForm();
    Object.keys(data).forEach((key) => {
      data[key] = true;
    });
    const e = this._dispatchExport(data);
    if (!e.detail.result) {
      throw new Error('Export event not handled');
    }
    this._loading = true;
    try {
      const result = await e.detail.result;
      this.shadowRoot.querySelector('#exportComplete').opened = true;
      this._loading = false;
      return result;
    } catch (cause) {
      const toast = this.shadowRoot.querySelector('#exportError');
      toast.text = cause.message;
      toast.opened = true;
      this._loading = false;
      throw cause;
    }
  }
  /**
   * Dispatches `export-data` custom event.
   * The event is handled by `arc-data-export` element.
   *
   * @param {Object} data List of deta stores to use in export.
   * @return {CustomEvent}
   */
  _dispatchExport(data) {
    const options = {
      provider: this.destination,
      file: this.fileName || this.generateFileName()
    };
    if (this.encryptFile) {
      options.encrypt = true;
      options.passphrase = this.passphrase || '';
    }
    const e = new CustomEvent('arc-data-export', {
      bubbles: true,
      composed: true,
      detail: {
        options,
        data
      }
    });
    this.dispatchEvent(e);
    return e;
  }
  /**
   * Generates default export name value.
   * @return {String}
   */
  generateFileName() {
    const date = new Date();
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `arc-data-export-${day}-${month}-${year}.json`;
  }

  _destinationHandler(e) {
    this.destination = e.detail.value;
  }

  _dropdownOpenedHandler(e) {
    e.target.setAttribute('aria-expanded', String(e.detail.value));
  }

  _checkedChanged(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _inputHandler(e) {
    const { name, value } = e.target;
    this[name] = value;
  }
  /**
   * @event arc-data-export
   * @param {Object} options
   * @param {Object} providerOptions
   * @param {Array<Object>} data
   */
}
window.customElements.define('export-form', ExportForm);
