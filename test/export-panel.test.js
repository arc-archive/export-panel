import { fixture, assert, aTimeout } from '@open-wc/testing';
import '../export-panel.js';

describe('<export-panel>', () => {
  async function basicFixture() {
    return await fixture(`<export-panel></export-panel>`);
  }

  describe('constructor()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets default destination', () => {
      assert.equal(element.destination, 'file');
    });

    it('sets default fileName', async () => {
      await aTimeout();
      const panel = element.shadowRoot.querySelector('export-form');
      const name = panel.generateFileName();
      assert.equal(element.fileName, name);
    });
  });

  describe('onarcdataexport', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function fire(element) {
      const e = new CustomEvent('arc-data-export');
      element.dispatchEvent(e);
    }

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onarcdataexport);
      const f = () => {};
      element.onarcdataexport = f;
      assert.isTrue(element.onarcdataexport === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onarcdataexport = f;
      fire(element);
      element.onarcdataexport = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onarcdataexport = f1;
      element.onarcdataexport = f2;
      fire(element);
      element.onarcdataexport = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('a11y', () => {
    it('passes a11y tests', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element, {
        ignoredRules: ['button-name', 'tabindex']
      });
    });
  });
});
