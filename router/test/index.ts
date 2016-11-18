import * as assert from 'assert';
import { Awesome } from '../src';

describe('Awesome', function () {
  it('isAwesome', function () {
    const awesome = new Awesome();

    assert.ok(awesome.isAwesome());
  });
});
