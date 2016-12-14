import * as assert from 'assert';
import { div, hasCssSelector } from '../../src';

describe('hasCssSelector', () => {
  describe('given a class selector .foo and VNode with class foo', () => {
    it('returns true', () => {
      assert.ok(hasCssSelector('.foo', div('.foo')));
    });
  });

  describe('given a class selector .bar and VNode with class foo', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('.bar', div('.foo')));
    });
  });

  describe('given a class selector xbar and VNode with class bar', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('xbar', div('.bar')));
    });
  });

  describe('given a class selector .foo.bar and VNode with classes foo and bar', () => {
    it('returns true', () => {
      assert.ok(hasCssSelector('.foo.bar', div('.foo.bar')));
    });
  });

  describe('given a class selector .foo.bar and VNode with classes bar and foo', () => {
    it('returns true', () => {
      assert.ok(hasCssSelector('.foo.bar', div('.bar.foo')));
    });
  });

  describe('given a class selector .foo.bar.baz and VNode with classes bar foo and baz', () => {
    it('returns true', () => {
      assert.ok(hasCssSelector('.foo.bar.baz', div('.baz.bar.foo')));
    });
  });

  describe('given a class selector .foo and VNode with no classes', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('.foo', div()));
    });
  });

  describe('given an id selector #foo and VNode with id foo', () => {
    it('returns true', () => {
      assert.ok(hasCssSelector('#foo', div('#foo')));
    });
  });

  describe('given an id selector #bar and VNode with id foo', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('#bar', div('#foo')));
    });
  });

  describe('given an id selector #foo#bar and VNode with id foo', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('#foo#bar', div('#foo')));
    });
  });

  describe('given a cssSelector .foo#bar and VNode with class foo and id bar', () => {
    it('returns true', () => {
      assert.ok(hasCssSelector('.foo#bar', div('.foo#bar')));
    });
  });

  describe('given a cssSelector .foo#bar and VNode with class foo', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('.foo#bar', div('.foo')));
    });
  });

  describe('given a cssSelector #bar.foo and VNode with class foo', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('#bar.foo', div('.foo')));
    });
  });

  describe('given a cssSelector .foo .bar and VNode with classes foo and bar', () => {
    it('throws error', () => {
      assert.throws(() => {
        hasCssSelector('.foo .bar', div('.foo.bar'));
      }, /CSS selectors can not contain spaces/);
    });
  });

  describe('given a cssSelector .foo#bar.baz and VNode with classes foo and baz and id bar', () => {
    it('returns true', () => {
      assert.ok(hasCssSelector('.foo#bar.baz', div('.foo#bar.baz')));
    });
  });

  describe('given cssSelector .foo#bar.baz and VNode with class foo and id bar', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('.foo#bar.baz', div('.foo#bar')));
    });
  });

  describe('given cssSelector .foo#bar.baz and VNode with class baz and id bar', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('.foo#bar.baz', div('.baz#bar')));
    });
  });

  describe('given a cssSelector div and VNode with tagName div', () => {
    it('returns true', () => {
      assert.ok(hasCssSelector('div', div()));
    });
  });

  describe('given a cssSelector div.foo and VNode with tagName div and class foo', () => {
    it('returns true', () => {
      assert.ok(hasCssSelector('div.foo', div('.foo')));
    });
  });

  describe('given a cssSelector h2.foo and VNode with tagName div and class foo', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('h2.foo', div('.foo')));
    });
  });

  describe('given a cssSelector div.foo and VNode with tagName div', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('div.foo', div()));
    });
  });

  describe('given a cssSelector div.foo and VNode with tagName div and id foo', () => {
    it('returns false', () => {
      assert.ok(!hasCssSelector('div.foo', div('#foo')));
    });
  });

  describe('given a cssSelector div#foo.bar and VNode with tagName div and id foo and class bar', () => {
    it('returns true', () => {
      assert.ok(hasCssSelector('div#foo.bar', div('#foo.bar')));
    });
  });
});
