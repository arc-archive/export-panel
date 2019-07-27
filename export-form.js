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
import '@polymer/paper-toast/paper-toast.js';
import '@advanced-rest-client/arc-icons/arc-icons.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
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

      paper-listbox iron-icon {
        color: var(--context-menu-item-color);
      }

      paper-listbox paper-icon-item,
      .list ::slotted(paper-icon-item),
      .list ::slotted(.menu-item) {
        color: var(--context-menu-item-color);
        background-color: var(--context-menu-item-background-color);
        cursor: pointer;
      }

      paper-listbox paper-icon-item:hover,
      .list ::slotted(paper-icon-item):hover,
      .list ::slotted(.menu-item):hover {
        color: var(--context-menu-item-color-hover);
        background-color: var(--context-menu-item-background-color-hover);
      }

      paper-listbox paper-icon-item:hover iron-icon {
        color: var(--context-menu-item-color-hover);
      }

      paper-checkbox {
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
    `;
  }

  render() {
    const { destination, fileName, _loading } = this;
    return html`
      <section class="inline-config">
        <paper-dropdown-menu
          label="Export location"
          class="destination-dropdown"
          aria-label="Select export location"
          aria-expanded="false"
          @opened-changed="${this._dropdownOpenedHandler}"
        >
          <paper-listbox
            slot="dropdown-content"
            .selected="${destination}"
            @selected-changed="${this._destinationHandler}"
            class="list"
            attr-for-selected="data-value"
          >
            <paper-icon-item class="menu-item" data-action="export-all-file" data-value="file">
              <iron-icon icon="arc:archive" slot="item-icon"></iron-icon>
              Export to file
            </paper-icon-item>
            <paper-icon-item class="menu-item" data-action="export-all-drive" data-value="drive">
              <iron-icon icon="arc:drive-color" slot="item-icon"></iron-icon>
              Export to Google Drive
            </paper-icon-item>
            <slot name="destination"></slot>
          </paper-listbox>
        </paper-dropdown-menu>

        <paper-input label="File name" .value="${fileName}" @value-changed="${this._fileNameHandler}"></paper-input>
      </section>

      <h3>Data to export</h3>
      <iron-form>
        <form enctype="application/json">
          <paper-checkbox name="saved" checked>Projects and saved request list</paper-checkbox>
          <paper-checkbox name="history" checked>Requests history</paper-checkbox>
          <paper-checkbox name="cookies" checked>Cookies</paper-checkbox>
          <paper-checkbox name="auth" checked>Saved passwords</paper-checkbox>
          <paper-checkbox name="url-history" checked>URL history</paper-checkbox>
          <paper-checkbox name="websocket" checked>Web sockets history</paper-checkbox>
          <paper-checkbox name="variables" checked>Variables data</paper-checkbox>
          <paper-checkbox name="host-rules" checked>Host rules</paper-checkbox>
        </form>
      </iron-form>

      <div class="actions">
        <paper-button class="action-button" ?disabled="${_loading}" raised @click="${this._prepare}"
          >Export</paper-button
        >
        <paper-spinner ?active="${_loading}"></paper-spinner>
      </div>

      <p class="prepare-info">Depending on the data size it may take a minute</p>
      <paper-toast id="exportError" class="error-toast"></paper-toast>
      <paper-toast id="exportComplete" text="Export complete"></paper-toast>
    `;
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
      fileName: { type: String }
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
    const nodes = this.shadowRoot.querySelectorAll('form paper-checkbox');
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
      /* global Promise */
      return Promise.reject(new Error('Export event not handled'));
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

  _fileNameHandler(e) {
    this.fileName = e.detail.value;
  }

  _dropdownOpenedHandler(e) {
    e.target.setAttribute('aria-expanded', String(e.detail.value));
  }
  /**
   * @event arc-data-export
   * @param {Object} options
   * @param {Object} providerOptions
   * @param {Array<Object>} data
   */
}
window.customElements.define('export-form', ExportForm);
