import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../export-form.js';

describe('<export-form>', () => {
  async function basicFixture() {
    return await fixture(`<export-form></export-form>`);
  }

  describe('constructor()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets default destination', async () => {
      assert.equal(element.destination, 'file');
    });

    it('sets default fileName', async () => {
      const name = element.generateFileName();
      assert.equal(element.fileName, name);
    });
  });

  describe('_dispatchExport()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches arc-data-export event', () => {
      const spy = sinon.spy();
      element.addEventListener('arc-data-export', spy);
      element._dispatchExport();
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const e = element._dispatchExport();
      assert.typeOf(e, 'customevent');
      assert.equal(e.type, 'arc-data-export');
    });

    it('Event bubbles', () => {
      const e = element._dispatchExport();
      assert.isTrue(e.bubbles);
    });

    it('Event has data', () => {
      const data = {
        saved: true
      };
      const e = element._dispatchExport(data);
      assert.deepEqual(e.detail.data, data);
    });

    it('Generates file name when missing', () => {
      const data = {
        saved: true
      };
      element.fileName = undefined;
      const e = element._dispatchExport(data);
      assert.typeOf(e.detail.options.file, 'string');
    });
  });

  describe('startExport()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function handler(e) {
      e.preventDefault();
      e.detail.result = Promise.resolve({ test: true });
    }

    function errorHandler(e) {
      e.preventDefault();
      e.detail.result = Promise.reject(new Error('test-error'));
    }

    afterEach(() => {
      window.removeEventListener('arc-data-export', handler);
      window.removeEventListener('arc-data-export', errorHandler);
    });

    it('Rejects when export event not handled', () => {
      let rejected = false;
      return element
        .startExport()
        .catch(() => {
          rejected = true;
        })
        .then(() => {
          assert.isTrue(rejected);
        });
    });

    it('Returns a promise', () => {
      window.addEventListener('arc-data-export', handler);
      const result = element.startExport();
      assert.typeOf(result.then, 'function');
      return result;
    });

    it('Sets loading state', () => {
      window.addEventListener('arc-data-export', handler);
      const result = element.startExport();
      assert.isTrue(element.loading);
      return result;
    });

    it('Promise results to data returned by the export processor', () => {
      window.addEventListener('arc-data-export', handler);
      return element.startExport().then((data) => {
        assert.deepEqual(data, { test: true });
      });
    });

    it('Resets exportComplete flag', () => {
      window.addEventListener('arc-data-export', handler);
      return element.startExport().then(() => {
        assert.isFalse(element.loading);
      });
    });

    it('Opens exportError on error', () => {
      window.addEventListener('arc-data-export', errorHandler);
      return element
        .startExport()
        .then(() => {
          throw new Error('Should not resolve.');
        })
        .catch((cause) => {
          assert.typeOf(cause.message, 'string');
          assert.equal(cause.message, 'test-error');
          const toast = element.shadowRoot.querySelector('#exportError');
          assert.isTrue(toast.opened);
          assert.equal(toast.text, 'test-error');
        });
    });

    it('Resets exportComplete flag on error', () => {
      window.addEventListener('arc-data-export', errorHandler);
      return element.startExport().catch(() => {
        assert.isFalse(element.loading);
      });
    });
  });

  describe('Export flow', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches event with data', (done) => {
      element.addEventListener('arc-data-export', (e) => {
        assert.isTrue(e.bubbles, 'Event bubbles');
        assert.typeOf(e.detail.options.file, 'string');
        assert.equal(e.detail.options.provider, 'file');
        assert.typeOf(e.detail.data, 'object');
        e.detail.result = Promise.resolve();
        done();
      });
      const node = element.shadowRoot.querySelector('.action-button');
      node.click();
    });

    it('Event contains selected data', () => {
      let event;
      element.addEventListener('arc-data-export', (e) => {
        event = e;
        e.detail.result = Promise.resolve();
      });
      const node = element.shadowRoot.querySelector('.action-button');
      node.click();

      const types = event.detail.data;
      assert.isTrue(types.saved);
      assert.isTrue(types.history);
      assert.isTrue(types.cookies);
      assert.isTrue(types.auth);
      assert.isTrue(types['url-history']);
      assert.isTrue(types.websocket);
      assert.isTrue(types.variables);
    });

    it('Exports to drive', async () => {
      element.destination = 'drive';
      await nextFrame();
      let event;
      element.addEventListener('arc-data-export', (e) => {
        event = e;
        e.detail.result = Promise.resolve();
      });
      const node = element.shadowRoot.querySelector('.action-button');
      node.click();
      assert.equal(event.detail.options.provider, 'drive');
    });

    it('Sets loading flag', async () => {
      element.addEventListener('arc-data-export', (e) => {
        e.detail.result = new Promise((resolve) => {
          setTimeout(() => resolve(), 1);
        });
      });
      const node = element.shadowRoot.querySelector('.action-button');
      node.click();
      assert.isTrue(element.loading);
      await aTimeout(2);
    });

    it('Re-sets loading flag', (done) => {
      element.addEventListener('arc-data-export', (e) => {
        e.detail.result = new Promise((resolve) => {
          setTimeout(() => resolve(), 1);
          setTimeout(() => {
            assert.isFalse(element.loading);
            done();
          }, 2);
        });
      });
      const node = element.shadowRoot.querySelector('.action-button');
      node.click();
    });

    it('Selects all items', () => {
      const nodes = element.shadowRoot.querySelectorAll('form anypoint-checkbox');
      nodes[0].checked = false;
      nodes[2].checked = false;
      element.selectAll();
      for (let i = 0, len = nodes.length; i < len; i++) {
        assert.isTrue(nodes[i].checked);
      }
    });
  });

  describe('generateFileName()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('has name with date', () => {
      const result = element.generateFileName();
      assert.match(result, /arc-data-export-[0-9]+-[0-9]+-[0-9]+.json/);
    });
  });

  describe('_fileNameHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('changes destination', () => {
      const node = element.shadowRoot.querySelector('anypoint-input');
      node.dispatchEvent(
        new CustomEvent('value-changed', {
          detail: {
            value: 'TEST'
          }
        })
      );
      assert.equal(element.fileName, 'TEST');
    });
  });

  describe('onloadingchnaged', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onloadingchnaged);
      const f = () => {};
      element.onloadingchnaged = f;
      assert.isTrue(element.onloadingchnaged === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onloadingchnaged = f;
      element._loading = true;
      element.onloadingchnaged = null;
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
      element.onloadingchnaged = f1;
      element.onloadingchnaged = f2;
      element._loading = true;
      element.onloadingchnaged = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onarcdataexport', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

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
      element._dispatchExport();
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
      element._dispatchExport();
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
