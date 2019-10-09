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
import './export-form.js';
/**
 * Data export panel for Advanced REST Client.
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
 * `--arc-font-body1-font-size` | ARC theme property | ``
 * `--arc-font-body1-font-weight` | ARC theme property | ``
 * `--arc-font-body1-line-height` | ARC theme property | ``
 * `--arc-font-subhead-font-size` | ARC theme property | ``
 * `--arc-font-subhead-font-weight` | ARC theme property | ``
 * `--arc-font-subhead-line-height` | ARC theme property | ``
 * `--arc-settings-panel-header-color` | Color of the header | `currentcolor`
 *
 * @customElement
 * @memberof UiElements
 * @demo demo/index.html
 */
class ExportPanel extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 4px;
        font-size: var(--arc-font-body1-font-size);
        font-weight: var(--arc-font-body1-font-weight);
        line-height: var(--arc-font-body1-line-height);
      }

      h2 {
        font-size: var(--arc-font-subhead-font-size);
        font-weight: var(--arc-font-subhead-font-weight);
        line-height: var(--arc-font-subhead-line-height);
        color: var(--arc-settings-panel-header-color, currentcolor);
      }
    `;
  }

  render() {
    const {
      destination,
      fileName,
      compatibility,
      outlined,
      withEncrypt,
      encryptFile,
      passphrase
    } = this;
    return html`
      <h2>Export data</h2>
      <section class="card">
        <export-form
          .destination="${destination}"
          .fileName="${fileName}"
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
          ?passphrase="${passphrase}"
          ?encryptFile="${encryptFile}"
          ?withEncrypt="${withEncrypt}"
        >
          <slot name="destination" slot="destination"></slot>
        </export-form>
      </section>
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
       * When set it renders encryption options.
       */
      withEncrypt: { type: Boolean },
      /**
       * When set the encrypt file option is enabled.
       */
      encryptFile: { type: Boolean },
      /**
       * Encryption passphrase
       */
      passphrase: { type: String },
    };
  }

  constructor() {
    super();
    this.destination = 'file';
  }

  firstUpdated() {
    // When this element is initialized it overrides properties from ther form
    // so it has to reset it's default values.
    // Destination is reset in the constructor but file name is dynamic.
    // The `setTimeout` is because for some reson the change is not reflected if done
    // without it.
    if (this.fileName === undefined) {
      setTimeout(() => {
        const panel = this.shadowRoot.querySelector('export-form');
        this.fileName = panel.generateFileName();
      });
    }
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
    const eventType = 'arc-data-export';
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
   * @event arc-data-export
   * @param {Object} options
   * @param {Object} providerOptions
   * @param {Array<Object>} data
   */
}
window.customElements.define('export-panel', ExportPanel);
