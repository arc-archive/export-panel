import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@polymer/paper-toast/paper-toast.js';
import '@advanced-rest-client/arc-data-export/arc-data-export.js';
import '@advanced-rest-client/arc-icons/arc-icons.js';
import '@anypoint-web-components/anypoint-item/anypoint-icon-item.js';
import { add } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '../export-panel.js';

class DemoPage extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'outlined',
      'customDestination'
    ]);
    this._componentName = 'export-panel';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];

    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);

    window.addEventListener('file-data-save', this._fileExportHandler);
    window.addEventListener('google-drive-data-save', this._driveExportHandler);
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    switch (state) {
      case 0:
        this.outlined = false;
        this.compatibility = false;
        break;
      case 1:
        this.outlined = true;
        this.compatibility = false;
        break;
      case 2:
        this.outlined = false;
        this.compatibility = true;
        break;

    }
  }

  _fileExportHandler(e) {
    e.preventDefault();
    e.detail.result = new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
    document.getElementById('fileToast').opened = true;
    console.log(e.detail);
  }

  _driveExportHandler(e) {
    e.preventDefault();
    e.detail.result = new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
    document.getElementById('driveToast').opened = true;
    console.log(e.detail);
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      customDestination
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the export panel element with various
          configuration options.
        </p>

        <arc-interactive-demo
          .states="${demoStates}"
          @state-chanegd="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >

          <export-panel
            ?compatibility="${compatibility}"
            ?outlined="${outlined}"
            slot="content">
            ${customDestination ? html`
            <anypoint-icon-item data-value="my-destination" slot="destination">
              <span slot="item-icon">${add}</span>
              Export to my destination
            </anypoint-icon-item>` : ''}
          </export-panel>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="customDestination"
            @change="${this._toggleMainOption}"
          >
            Custom destination
          </anypoint-checkbox>
        </arc-interactive-demo>

        <paper-toast text="Drive export requested" id="driveToast"></paper-toast>
        <paper-toast text="File export requested" id="fileToast"></paper-toast>
      </section>
    `;
  }

  _introductionTemplate() {
    return html`
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          Advanced REST Client data export panel.
          Contains the UI that allows the user to pick data to export
        </p>
      </section>
    `;
  }

  _usageTemplate() {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>The export panel comes with 2 predefied styles:</p>
        <ul>
          <li><b>Material</b> - Normal state</li>
          <li>
            <b>Compatibility</b> - To provide compatibility with Anypoint design
          </li>
        </ul>

        <p>
          Export panel works with <code>arc-data-export</code> to generate
          export data. Different versions of ARC can have multiple implementation
          of this module. The communication between the components is by using
          custom evenets.
        </p>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <arc-data-export appversion="demo-app"></arc-data-export>

      <h2>The export panel</h2>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
      ${this._usageTemplate()}
    `;
  }
}

const instance = new DemoPage();
instance.render();
window._demo = instance;
