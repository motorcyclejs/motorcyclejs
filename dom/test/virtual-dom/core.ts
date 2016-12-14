import * as assert from 'assert';
import { shuffle } from '../helpers/shuffle';
import { h, init, VNode, ClassModule, PropsModule } from '../../src/index';

let patch = init([
  ClassModule,
  PropsModule,
]);

function prop(name: string) {
  return function (obj: any): any {
    return obj[name];
  };
}

function map(fn: (x: any) => any, list: any[] | ArrayLike<any>): any[] {
  let ret: any[] = [];
  for (let i = 0; i < list.length; ++i) {
    ret[i] = fn(list[i]);
  }
  return ret;
}

function getChild(vnode: VNode, index: number): VNode {
  return vnode
    && vnode.children
    && (vnode.children as Array<any>).length >= index + 1
    && vnode.children[index] as VNode
    || h('fuckedup', {}, []);
}

let inner = prop('innerHTML');

describe('snabbdom', function () {
  let elm: HTMLElement, vnode0: HTMLElement;
  beforeEach(function () {
    elm = document.createElement('div');
    vnode0 = elm;
  });
  describe('hyperscript', function () {
    it('can create vnode with proper tag', function () {
      assert.equal(h('div').tagName, 'div');
      assert.equal(h('a').tagName, 'a');
    });
    it('can create vnode with children', function () {
      let vnode = h('div', [h('span#hello'), h('b.world')]);
      assert.equal(vnode.tagName, 'div');
      assert.equal(getChild(vnode, 0).tagName as string, 'span');
      assert.equal(getChild(vnode, 0).id as string, 'hello');
      assert.equal(getChild(vnode, 1).tagName as string, 'b');
      assert.equal(getChild(vnode, 1).className as string, 'world');
    });
    it('can create vnode with text content', function () {
      let vnode = h('a', ['I am a string']);
      assert.equal(getChild(vnode, 0).text, 'I am a string');
    });
    it('can create vnode with text content in string', function () {
      let vnode = h('a', 'I am a string');
      assert.equal(vnode.text, 'I am a string');
    });
    it('can create vnode with props and text content in string', function () {
      let vnode = h('a', {}, 'I am a string');
      assert.equal(vnode.text, 'I am a string');
    });
  });
  describe('created element', function () {
    it('has tag', function () {
      elm = patch(vnode0, h('div')).elm as HTMLElement;
      assert.equal(elm.tagName, 'DIV');
    });
    it('has different tag and id', function () {
      let elm = document.createElement('div');
      vnode0.appendChild(elm);
      let vnode1 = h('span#id');
      elm = patch(elm, vnode1).elm as HTMLDivElement;
      assert.equal(elm.tagName, 'SPAN');
      assert.equal(elm.id, 'id');
    });
    it('has id', function () {
      elm = patch(vnode0, h('div', [h('div#unique')])).elm as HTMLElement;
      assert.equal((elm.firstChild as HTMLElement).id, 'unique');
    });
    it('has correct namespace', function () {
      let SVGNamespace = 'http://www.w3.org/2000/svg';
      let XHTMLNamespace = 'http://www.w3.org/1999/xhtml';

      elm = patch(vnode0, h('div', [h('div', { ns: SVGNamespace })])).elm as HTMLElement;
      assert.equal((elm.firstChild as HTMLElement).namespaceURI, SVGNamespace);

      elm = patch(vnode0, h('svg', [
        h('foreignObject', [
          h('div', ['I am HTML embedded in SVG']),
        ]),
      ])).elm as HTMLElement;

      assert.equal(elm.namespaceURI, SVGNamespace);
      assert.equal((elm.firstChild as HTMLElement).namespaceURI, SVGNamespace);
      assert.equal(((elm.firstChild as HTMLElement).firstChild as HTMLElement).namespaceURI, XHTMLNamespace);
    });
    it('is recieves classes in selector', function () {
      elm = patch(vnode0, h('div', [h('i.am.a.class')])).elm as HTMLElement;
      assert((elm.firstChild as HTMLElement).classList.contains('am'));
      assert((elm.firstChild as HTMLElement).classList.contains('a'));
      assert((elm.firstChild as HTMLElement).classList.contains('class'));
    });
    it('is recieves classes in class property', function () {
      elm = patch(vnode0, h('i', { class: { am: true, a: true, class: true, not: false } })).elm as HTMLElement;
      assert(elm.classList.contains('am'));
      assert(elm.classList.contains('a'));
      assert(elm.classList.contains('class'));
      assert(!elm.classList.contains('not'));
    });
    it('handles classes from both selector and property', function () {
      elm = patch(vnode0, h('div', [h('i.has', { class: { classes: true } })])).elm as HTMLElement;
      assert((elm.firstChild as HTMLElement).classList.contains('has'));
      assert((elm.firstChild as HTMLElement).classList.contains('classes'));
    });
    it('can create elements with text content', function () {
      elm = patch(vnode0, h('div', ['I am a string'])).elm as HTMLElement;
      assert.equal(elm.innerHTML, 'I am a string');
    });
    it('can create elements with span and text content', function () {
      elm = patch(vnode0, h('a', [h('span'), 'I am a string'])).elm as HTMLElement;
      assert.equal((elm.childNodes[0] as HTMLElement).tagName, 'SPAN');
      assert.equal((elm.childNodes[1] as HTMLElement).textContent, 'I am a string');
    });
    it('can create elements with props', function () {
      let elm = patch(vnode0, h('img', { props: { src: 'http://localhost/' } })).elm as HTMLImageElement;
      assert.equal(elm.src, 'http://localhost/');
    });
    it.skip('can create an element created inside an iframe', function (done) {
      // Only run if srcdoc is supported.
      let frame: any = document.createElement('iframe');
      if (typeof frame.srcdoc !== 'undefined') {
        frame.srcdoc = '<div>Thing 1</div>';
        frame.onload = function () {
          patch(frame.contentDocument.body.querySelector('div'), h('div', 'Thing 2'));
          assert.equal(frame.contentDocument.body.querySelector('div').textContent, 'Thing 2');
          frame.remove();
          done();
        };
        document.body.appendChild(frame);
      } else {
        done();
      }
    });
  });
  describe('patching an element', function () {
    it('changes the elements classes', function () {
      let vnode1 = h('i', { class: { i: true, am: true, horse: true } });
      let vnode2 = h('i', { class: { i: true, am: true, horse: false } });
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm as HTMLElement;
      assert(elm.classList.contains('i'));
      assert(elm.classList.contains('am'));
      assert(!elm.classList.contains('horse'));
    });
    it('changes classes in selector', function () {
      let vnode1 = h('i', { class: { i: true, am: true, horse: true } });
      let vnode2 = h('i', { class: { i: true, am: true, horse: false } });
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm as HTMLElement;
      assert(elm.classList.contains('i'));
      assert(elm.classList.contains('am'));
      assert(!elm.classList.contains('horse'));
    });
    it('removes missing classes', function () {
      let vnode1 = h('i', { class: { i: true, am: true, horse: true } });
      let vnode2 = h('i', { class: { i: true, am: true } });
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm as HTMLElement;
      assert(elm.classList.contains('i'));
      assert(elm.classList.contains('am'));
      assert(!elm.classList.contains('horse'));
    });
    it('changes an elements props', function () {
      let vnode1 = h('a', { props: { src: 'http://other/' } });
      let vnode2 = h('a', { props: { src: 'http://localhost/' } });
      patch(vnode0, vnode1);
      elm = patch(vnode1, vnode2).elm as HTMLAnchorElement;
      assert.equal((elm as any).src, 'http://localhost/');
    });
    it('removes an elements props', function () {
      let vnode1 = h('a', { props: { src: 'http://other/' } });
      let vnode2 = h('a');
      patch(vnode0, vnode1);
      patch(vnode1, vnode2);
      assert.equal((elm as any).src, undefined);
    });
    describe('updating children with keys', function () {
      function spanNum(n: string | number) {
        if (typeof n === 'string') {
          return h('span', {}, n);
        } else {
          return h('span', { key: n }, n.toString());
        }
      }
      describe('addition of elements', function () {
        it('appends elements', function () {
          let vnode1 = h('span', [1].map(spanNum));
          let vnode2 = h('span', [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 1);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.equal(elm.children.length, 3);
          assert.equal(elm.children[1].innerHTML, '2');
          assert.equal(elm.children[2].innerHTML, '3');
        });
        it('prepends elements', function () {
          let vnode1 = h('span', [4, 5].map(spanNum));
          let vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 2);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
        });
        it('add elements in the middle', function () {
          let vnode1 = h('span', [1, 2, 4, 5].map(spanNum));
          let vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 4);
          assert.equal(elm.children.length, 4);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
        });
        it('add elements at begin and end', function () {
          let vnode1 = h('span', [2, 3, 4].map(spanNum));
          let vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 3);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3', '4', '5']);
        });
        it('adds children to parent with no children', function () {
          let vnode1 = h('span', { key: 'span' });
          let vnode2 = h('span', { key: 'span' }, [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 0);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
        });
        it('removes all children from parent', function () {
          let vnode1 = h('span', { key: 'span' }, [1, 2, 3].map(spanNum));
          let vnode2 = h('span', { key: 'span' });
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.deepEqual(map(inner, elm.children), ['1', '2', '3']);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.equal(elm.children.length, 0);
        });
      });
      describe('removal of elements', function () {
        it('removes elements from the beginning', function () {
          let vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          let vnode2 = h('span', [3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 5);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.deepEqual(map(inner, elm.children), ['3', '4', '5']);
        });
        it('removes elements from the end', function () {
          let vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          let vnode2 = h('span', [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 5);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.equal(elm.children.length, 3);
          assert.equal(elm.children[0].innerHTML, '1');
          assert.equal(elm.children[1].innerHTML, '2');
          assert.equal(elm.children[2].innerHTML, '3');
        });
        it('removes elements from the middle', function () {
          let vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          let vnode2 = h('span', [1, 2, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 5);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.equal(elm.children.length, 4);
          assert.deepEqual(elm.children[0].innerHTML, '1');
          assert.equal(elm.children[0].innerHTML, '1');
          assert.equal(elm.children[1].innerHTML, '2');
          assert.equal(elm.children[2].innerHTML, '4');
          assert.equal(elm.children[3].innerHTML, '5');
        });
      });
      describe('element reordering', function () {
        it('moves element forward', function () {
          let vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          let vnode2 = h('span', [2, 3, 1, 4].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 4);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.equal(elm.children.length, 4);
          assert.equal(elm.children[0].innerHTML, '2');
          assert.equal(elm.children[1].innerHTML, '3');
          assert.equal(elm.children[2].innerHTML, '1');
          assert.equal(elm.children[3].innerHTML, '4');
        });
        it('moves element to end', function () {
          let vnode1 = h('span', [1, 2, 3].map(spanNum));
          let vnode2 = h('span', [2, 3, 1].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 3);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.equal(elm.children.length, 3);
          assert.equal(elm.children[0].innerHTML, '2');
          assert.equal(elm.children[1].innerHTML, '3');
          assert.equal(elm.children[2].innerHTML, '1');
        });
        it('moves element backwards', function () {
          let vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          let vnode2 = h('span', [1, 4, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 4);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.equal(elm.children.length, 4);
          assert.equal(elm.children[0].innerHTML, '1');
          assert.equal(elm.children[1].innerHTML, '4');
          assert.equal(elm.children[2].innerHTML, '2');
          assert.equal(elm.children[3].innerHTML, '3');
        });
        it('swaps first and last', function () {
          let vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          let vnode2 = h('span', [4, 2, 3, 1].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 4);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.equal(elm.children.length, 4);
          assert.equal(elm.children[0].innerHTML, '4');
          assert.equal(elm.children[1].innerHTML, '2');
          assert.equal(elm.children[2].innerHTML, '3');
          assert.equal(elm.children[3].innerHTML, '1');
        });
      });
      describe('combinations of additions, removals and reorderings', function () {
        it('move to left and replace', function () {
          let vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          let vnode2 = h('span', [4, 1, 2, 3, 6].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 5);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.equal(elm.children.length, 5);
          assert.equal(elm.children[0].innerHTML, '4');
          assert.equal(elm.children[1].innerHTML, '1');
          assert.equal(elm.children[2].innerHTML, '2');
          assert.equal(elm.children[3].innerHTML, '3');
          assert.equal(elm.children[4].innerHTML, '6');
        });
        it('moves to left and leaves hole', function () {
          let vnode1 = h('span', [1, 4, 5].map(spanNum));
          let vnode2 = h('span', [4, 6].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 3);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.deepEqual(map(inner, elm.children), ['4', '6']);
        });
        it('handles moved and set to undefined element ending at the end', function () {
          let vnode1 = h('span', [2, 4, 5].map(spanNum));
          let vnode2 = h('span', [4, 5, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.children.length, 3);
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.equal(elm.children.length, 3);
          assert.equal(elm.children[0].innerHTML, '4');
          assert.equal(elm.children[1].innerHTML, '5');
          assert.equal(elm.children[2].innerHTML, '3');
        });
        it('moves a key in non-keyed nodes with a size up', function () {
          let vnode1 = h('span', [1, 'a', 'b', 'c'].map(spanNum));
          let vnode2 = h('span', ['d', 'a', 'b', 'c', 1, 'e'].map(spanNum));
          elm = patch(vnode0, vnode1).elm as HTMLElement;
          assert.equal(elm.childNodes.length, 4);
          assert.equal(elm.textContent, '1abc');
          elm = patch(vnode1, vnode2).elm as HTMLElement;
          assert.equal(elm.childNodes.length, 6);
          assert.equal(elm.textContent, 'dabc1e');
        });
      });
      it('reverses elements', function () {
        let vnode1 = h('span', [1, 2, 3, 4, 5, 6, 7, 8].map(spanNum));
        let vnode2 = h('span', [8, 7, 6, 5, 4, 3, 2, 1].map(spanNum));
        elm = patch(vnode0, vnode1).elm as HTMLElement;
        assert.equal(elm.children.length, 8);
        elm = patch(vnode1, vnode2).elm as HTMLElement;
        assert.deepEqual(map(inner, elm.children), ['8', '7', '6', '5', '4', '3', '2', '1']);
      });
      it('something', function () {
        let vnode1 = h('span', [0, 1, 2, 3, 4, 5].map(spanNum));
        let vnode2 = h('span', [4, 3, 2, 1, 5, 0].map(spanNum));
        elm = patch(vnode0, vnode1).elm as HTMLElement;
        assert.equal(elm.children.length, 6);
        elm = patch(vnode1, vnode2).elm as HTMLElement;
        assert.deepEqual(map(inner, elm.children), ['4', '3', '2', '1', '5', '0']);
      });
      it('handles random shuffles', function () {
        let n: any, i: any, arr: any[] = [], opacities: any[] = [], elms = 14, samples = 5;
        function spanNumWithOpacity(n: any, o: any) {
          return h('span', { key: n, style: { opacity: o } }, n.toString());
        }
        for (n = 0; n < elms; ++n) { arr[n] = n; }
        for (n = 0; n < samples; ++n) {
          let vnode1 = h('span', arr.map(function (n) {
            return spanNumWithOpacity(n, '1');
          }));
          let shufArr: any[] = shuffle(arr.slice(0));
          let elm = document.createElement('div');
          elm = patch(elm, vnode1).elm as HTMLDivElement;
          for (i = 0; i < elms; ++i) {
            assert.equal(elm.children[i].innerHTML, i.toString());
            opacities[i] = Math.random().toFixed(5).toString();
          }
          let vnode2 = h('span', arr.map(function (n) {
            return spanNumWithOpacity(shufArr[n], opacities[n]);
          }));
          elm = patch(vnode1, vnode2).elm as HTMLDivElement;
          for (i = 0; i < elms; ++i) {
            assert.equal(elm.children[i].innerHTML, shufArr[i].toString());
            assert.equal(opacities[i].indexOf((elm.children[i] as HTMLElement).style.opacity), 0);
          }
        }
      });
    });
    describe('updating children without keys', function () {
      it('appends elements', function () {
        let vnode1 = h('div', [h('span', 'Hello')]);
        let vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm as HTMLElement;
        assert.deepEqual(map(inner, elm.children), ['Hello']);
        elm = patch(vnode1, vnode2).elm as HTMLElement;
        assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
      });
      it('handles unmoved text nodes', function () {
        let vnode1 = h('div', ['Text', h('span', 'Span')]);
        let vnode2 = h('div', ['Text', h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm as HTMLElement;
        assert.equal(elm.childNodes[0].textContent, 'Text');
        elm = patch(vnode1, vnode2).elm as HTMLElement;
        assert.equal(elm.childNodes[0].textContent, 'Text');
      });
      it('handles changing text children', function () {
        let vnode1 = h('div', ['Text', h('span', 'Span')]);
        let vnode2 = h('div', ['Text2', h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm as HTMLElement;
        assert.equal(elm.childNodes[0].textContent, 'Text');
        elm = patch(vnode1, vnode2).elm as HTMLElement;
        assert.equal(elm.childNodes[0].textContent, 'Text2');
      });
      it('prepends element', function () {
        let vnode1 = h('div', [h('span', 'World')]);
        let vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm as HTMLElement;
        assert.deepEqual(map(inner, elm.children), ['World']);
        elm = patch(vnode1, vnode2).elm as HTMLElement;
        assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
      });
      it('prepends element of different tag type', function () {
        let vnode1 = h('div', [h('span', 'World')]);
        let vnode2 = h('div', [h('div', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm as HTMLElement;
        assert.deepEqual(map(inner, elm.children), ['World']);
        elm = patch(vnode1, vnode2).elm as HTMLElement;
        assert.deepEqual(map(prop('tagName'), elm.children), ['DIV', 'SPAN']);
        assert.deepEqual(map(inner, elm.children), ['Hello', 'World']);
      });
      it('removes elements', function () {
        let vnode1 = h('div', [h('span', 'One'), h('span', 'Two'), h('span', 'Three')]);
        let vnode2 = h('div', [h('span', 'One'), h('span', 'Three')]);
        elm = patch(vnode0, vnode1).elm as HTMLElement;
        assert.deepEqual(map(inner, elm.children), ['One', 'Two', 'Three']);
        elm = patch(vnode1, vnode2).elm as HTMLElement;
        assert.deepEqual(map(inner, elm.children), ['One', 'Three']);
      });
      it('removes a single text node', function () {
        let vnode1 = h('div', 'One');
        let vnode2 = h('div');
        patch(vnode0, vnode1);
        assert.equal(elm.textContent, 'One');
        patch(vnode1, vnode2);
        assert.equal(elm.textContent, '');
      });
      it('removes a single text node when children are updated', function () {
        let vnode1 = h('div', 'One');
        let vnode2 = h('div', [h('div', 'Two'), h('span', 'Three')]);
        patch(vnode0, vnode1);
        assert.equal(elm.textContent, 'One');
        patch(vnode1, vnode2);
        assert.deepEqual(map(prop('textContent'), elm.childNodes), ['Two', 'Three']);
      });
      it('removes a text node among other elements', function () {
        let vnode1 = h('div', ['One', h('span', 'Two')]);
        let vnode2 = h('div', [h('div', 'Three')]);
        patch(vnode0, vnode1);
        assert.deepEqual(map(prop('textContent'), elm.childNodes), ['One', 'Two']);
        patch(vnode1, vnode2);
        assert.equal(elm.childNodes.length, 1);
        assert.equal((elm.childNodes[0] as HTMLElement).tagName, 'DIV');
        assert.equal(elm.childNodes[0].textContent, 'Three');
      });
      it('reorders elements', function () {
        let vnode1 = h('div', [h('span', 'One'), h('div', 'Two'), h('b', 'Three')]);
        let vnode2 = h('div', [h('b', 'Three'), h('span', 'One'), h('div', 'Two')]);
        elm = patch(vnode0, vnode1).elm as HTMLElement;
        assert.deepEqual(map(inner, elm.children), ['One', 'Two', 'Three']);
        elm = patch(vnode1, vnode2).elm as HTMLElement;
        assert.deepEqual(map(prop('tagName'), elm.children), ['B', 'SPAN', 'DIV']);
        assert.deepEqual(map(inner, elm.children), ['Three', 'One', 'Two']);
      });
    });
  });
  describe('hooks', function () {
    describe('element hooks', function () {
      it('calls `create` listener before inserted into parent but after children', function () {
        let result: any[] = [];
        function cb(_: VNode, vnode: VNode) {
          assert(vnode.elm instanceof Element);
          assert.equal((vnode.elm as HTMLSpanElement).children.length, 2);
          assert.strictEqual(vnode && vnode.elm && vnode.elm.parentNode, null);
          result.push(vnode);
        }
        let vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', { hook: { create: cb } }, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
          h('span', 'Can\'t touch me'),
        ]);
        patch(vnode0, vnode1);
        assert.equal(1, result.length);
      });
      it('calls `insert` listener after both parents, siblings and children have been inserted', function () {
        let result: any[] = [];
        function cb(vnode: VNode) {
          assert(vnode.elm instanceof Element);
          assert.equal((vnode.elm as HTMLSpanElement).children.length, 2);
          assert.equal(((vnode.elm as HTMLSpanElement).parentNode as HTMLDivElement).children.length, 3);
          result.push(vnode);
        }
        let vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', { hook: { insert: cb } }, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
          h('span', 'Can touch me'),
        ]);
        patch(vnode0, vnode1);
        assert.equal(1, result.length);
      });
      it('calls `prepatch` listener', function () {
        let result: any[] = [];
        function cb(oldVnode: VNode, vnode: VNode) {
          /* tslint:disable */
          assert.strictEqual(oldVnode, getChild(vnode1, 1));
          assert.strictEqual(vnode, getChild(vnode2, 1));
          /* tslint:enable */
          result.push(vnode);
        }
        let vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', { hook: { prepatch: cb } }, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        let vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', { hook: { prepatch: cb } }, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(result.length, 1);
      });
      it('calls `postpatch` after `prepatch` listener', function () {
        let pre: any[] = [], post: any[] = [];
        function preCb() {
          pre.push(pre);
        }
        function postCb() {
          assert.equal(pre.length, post.length + 1);
          post.push(post);
        }
        let vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', { hook: { prepatch: preCb, postpatch: postCb } }, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        let vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', { hook: { prepatch: preCb, postpatch: postCb } }, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(pre.length, 1);
        assert.equal(post.length, 1);
      });
      it('calls `update` listener', function () {
        let result1: any[] = [];
        let result2: any[] = [];
        function cb(result: any[], oldVnode: VNode, vnode: VNode) {
          if (result.length > 0) {
            assert.strictEqual(result[result.length - 1], oldVnode);
          }
          result.push(vnode);
        }
        let vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', { hook: { update: cb.bind(null, result1) } }, [
            h('span', 'Child 1'),
            h('span', { hook: { update: cb.bind(null, result2) } }, 'Child 2'),
          ]),
        ]);
        let vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', { hook: { update: cb.bind(null, result1) } }, [
            h('span', 'Child 1'),
            h('span', { hook: { update: cb.bind(null, result2) } }, 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(result1.length, 1);
        assert.equal(result2.length, 1);
      });
      it('calls `remove` listener', function () {
        let result: any[] = [];
        function cb(vnode: VNode, rm: () => any) {
          let parent = vnode.elm && vnode.elm.parentNode;
          assert(vnode.elm instanceof Element);
          assert.equal((vnode.elm as any).children && (vnode.elm as any).children.length, 2);
          assert.equal((parent as any).children && (parent as any).children.length, 2);
          result.push(vnode);
          rm();
          assert.equal((parent as any).children.length, 1);
        }
        let vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', { hook: { remove: cb } }, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        let vnode2 = h('div', [
          h('span', 'First sibling'),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(1, result.length);
      });
      it('calls `init` and `prepatch` listeners on root', function () {
        let count = 0;
        /* tslint:disable */
        function init(vnode: VNode) {
          assert.strictEqual(vnode, vnode2);
          count += 1;
        }
        function prepatch(_: VNode, vnode: VNode) {
          assert.strictEqual(vnode, vnode1);
          count += 1;
        }
        /* tslint:enable */
        let vnode1 = h('div', { hook: { init: init, prepatch: prepatch } });
        patch(vnode0, vnode1);
        assert.equal(1, count);
        let vnode2 = h('span', { hook: { init: init, prepatch: prepatch } });
        patch(vnode1, vnode2);
        assert.equal(2, count);
      });
      it('removes element when all remove listeners are done', function () {
        let rm1: any, rm2: any, rm3: any;
        let patch = init([
          { remove: function (_, rm) { rm1 = rm; } },
          { remove: function (_, rm) { rm2 = rm; } },
        ]);
        let vnode1 = h('div', [h('a', { hook: { remove: function (_, rm) { rm3 = rm; } } })]);
        let vnode2 = h('div', []);
        elm = patch(vnode0, vnode1).elm as HTMLElement;
        assert.equal(elm.children.length, 1);
        elm = patch(vnode1, vnode2).elm as HTMLElement;
        assert.equal(elm.children.length, 1);
        rm1();
        assert.equal(elm.children.length, 1);
        rm3();
        assert.equal(elm.children.length, 1);
        rm2();
        assert.equal(elm.children.length, 0);
      });
      it('invokes remove hook on replaced root', function () {
        let result: any[] = [];
        let parent = document.createElement('div');
        let vnode0 = document.createElement('div');
        parent.appendChild(vnode0);
        function cb(vnode: VNode, rm: () => any) {
          result.push(vnode);
          rm();
        }
        let vnode1 = h('div', { hook: { remove: cb } }, [
          h('b', 'Child 1'),
          h('i', 'Child 2'),
        ]);
        let vnode2 = h('span', [
          h('b', 'Child 1'),
          h('i', 'Child 2'),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(1, result.length);
      });
    });
    describe('module hooks', function () {
      it('invokes `pre` and `post` hook', function () {
        let result: any[] = [];
        let patch = init([
          { pre: function () { result.push('pre'); } },
          { post: function () { result.push('post'); } },
        ]);
        let vnode1 = h('div');
        patch(vnode0, vnode1);
        assert.deepEqual(result, ['pre', 'post']);
      });
      it('invokes global `destroy` hook for all removed children', function () {
        let result: VNode[] = [];
        function cb(vnode: VNode) { result.push(vnode); }
        let vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', [
            h('span', { hook: { destroy: cb } }, 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        let vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(result.length, 1);
      });
      it('handles text vnodes with `undefined` `data` property', function () {
        let vnode1 = h('div', [
          ' ',
        ]);
        let vnode2 = h('div', []);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
      });
      it('invokes `destroy` module hook for all removed children', function () {
        let created = 0;
        let destroyed = 0;
        let patch = init([
          { create: function () { created++; } },
          { destroy: function () { destroyed++; } },
        ]);
        let vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        let vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(created, 4);
        assert.equal(destroyed, 4);
      });
      it('does not invoke `create` and `remove` module hook for text nodes', function () {
        let created = 0;
        let removed = 0;
        let patch = init([
          { create: function () { created++; } },
          { remove: function () { removed++; } },
        ]);
        let vnode1 = h('div', [
          h('span', 'First child'),
          '',
          h('span', 'Third child'),
        ]);
        let vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(created, 2);
        assert.equal(removed, 2);
      });
      it('does not invoke `destroy` module hook for text nodes', function () {
        let created = 0;
        let destroyed = 0;
        let patch = init([
          { create: function () { created++; } },
          { destroy: function () { destroyed++; } },
        ]);
        let vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', [
            h('span', 'Child 1'),
            h('span', ['Text 1', 'Text 2']),
          ]),
        ]);
        let vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(created, 4);
        assert.equal(destroyed, 4);
      });
    });
  });
  describe('short circuiting', function () {
    it('does not update strictly equal vnodes', function () {
      let result: any[] = [];
      function cb(vnode: VNode) { result.push(vnode); }
      let vnode1 = h('div', [
        h('span', { hook: { update: cb } }, 'Hello'),
        h('span', 'there'),
      ]);
      patch(vnode0, vnode1);
      patch(vnode1, vnode1);
      assert.equal(result.length, 0);
    });
    it('does not update strictly equal children', function () {
      let result: any[] = [];
      function cb(vnode: VNode) { result.push(vnode); }
      let vnode1 = h('div', [
        h('span', { hook: { update: cb } }, 'Hello'),
        h('span', 'there'),
      ]);
      let vnode2 = h('div');
      vnode2.children = vnode1.children;
      patch(vnode0, vnode1);
      patch(vnode1, vnode2);
      assert.equal(result.length, 0);
    });
  });
});
