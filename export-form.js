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
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import '../../@polymer/paper-toast/paper-toast.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/iron-form/iron-form.js';
import '../../@polymer/paper-checkbox/paper-checkbox.js';
import '../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../@polymer/paper-listbox/paper-listbox.js';
import '../../@polymer/paper-item/paper-icon-item.js';
import '../../@polymer/iron-icon/iron-icon.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@polymer/paper-spinner/paper-spinner.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
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
 * @polymer
 * @memberof UiElements
 * @demo demo/index.html
 */
class ExportForm extends PolymerElement {
  static get template() {
    return html`
    <style>
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
      background-color: var(--warning-primary-color, #FF7043);
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

    .action-button:not([disabled]) {
      background-color: var(--export-form-action-button-background-color, var(--primary-color));
      color: var(--export-form-action-button-color, #fff);
    }

    .action-button {
      margin-right: 8px;
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
    </style>
    <section class="inline-config">
      <paper-dropdown-menu label="Export location" class="destination-dropdown">
        <paper-listbox slot="dropdown-content" selected="{{destination}}" class="list" attr-for-selected="data-value">
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

      <paper-input label="File name" value="{{fileName}}"></paper-input>
    </section>
    <h3>Data to export</h3>
    <iron-form id="form">
      <form enctype="application/json">
        <paper-checkbox name="saved" checked="">Projects and saved request list</paper-checkbox>
        <paper-checkbox name="history" checked="">Requests history</paper-checkbox>
        <paper-checkbox name="cookies" checked="">Cookies</paper-checkbox>
        <paper-checkbox name="auth" checked="">Saved passwords</paper-checkbox>
        <paper-checkbox name="url-history" checked="">URL history</paper-checkbox>
        <paper-checkbox name="websocket" checked="">Web sockets history</paper-checkbox>
        <paper-checkbox name="variables" checked="">Variables data</paper-checkbox>
        <paper-checkbox name="host-rules" checked="">Host rules</paper-checkbox>
      </form>
    </iron-form>
    <div class="actions">
      <paper-button class="action-button" disabled="[[loading]]" raised="" on-click="_prepare">Export</paper-button>
      <paper-spinner active="[[loading]]"></paper-spinner>
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
      destination: {type: String, value: 'file'},
      /**
       * When `true` the component began export flow.
       */
      loading: {type: Boolean, readOnly: true},
      /**
       * When set this value will be used for export file name.
       */
      fileName: {
        type: String,
        value: function() {
          return this._getExportFileName();
        }
      }
    };
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
  startExport() {
    const data = this.$.form.serializeForm();
    Object.keys(data).forEach((key) => {
      data[key] = true;
    });
    const e = this._dispatchExport(data);
    if (!e.detail.result) {
      throw new Error('Export event not handled');
    }
    this._setLoading(true);
    return e.detail.result
    .then((result) => {
      this.$.exportComplete.opened = true;
      this._setLoading(false);
      return result;
    })
    .catch((cause) => {
      this.$.exportError.text = cause.message;
      this.$.exportError.opened = true;
      this._setLoading(false);
      throw cause;
    });
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
      file: this.fileName || this._getExportFileName()
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
  _getExportFileName() {
    const date = new Date();
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `arc-data-export-${day}-${month}-${year}.json`;
  }

  /**
   * @event arc-data-export
   * @param {Object} options
   * @param {Object} providerOptions
   * @param {Array<Object>} data
   */
}
window.customElements.define('export-form', ExportForm);
