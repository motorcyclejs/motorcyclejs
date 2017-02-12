# [MotorcycleJS](https://github.org/motorcyclejs) JavaScript Style Guide

### Table of Contents

  - [Types](#types)
  - [Objects](#objects)
  - [Arrays](#arrays)
  - [Strings](#strings)
  - [Functions](#functions)
  - [Properties](#properties)
  - [Variables](#variables)
  - [Requires](#requires)
  - [Callbacks](#callbacks)
  - [Try-catch](#try-catch)
  - [Conditional Expressions & Equality](#conditional-expressions--equality)
  - [Blocks](#blocks)
  - [Comments](#comments)
  - [Whitespace](#whitespace)
  - [Commas](#commas)
  - [Semicolons](#semicolons)
  - [Type Casting & Coercion](#type-casting--coercion)
  - [Naming Conventions](#naming-conventions)
  - [Accessors](#accessors)



## Types

###### Primitives
When you access a primitive type, you work directly on its value.

* `string`
* `number`
* `boolean`
* `null`
* `undefined`

```js
const foo = 1
const bar = foo

bar = 9

console.log(foo, bar) // => 1, 9
```

###### Complex
When you access a complex type, you work on a reference 
to its value.

* `object`
* `array`
* `function`

```javascript
const foo = [1, 2]
const bar = foo

bar[0] = 9

console.log(foo[0], bar[0]) // => 9, 9
```

**[⬆ Back to top](#table-of-contents)**



## Objects

* Use the literal syntax for object creation.

  ```javascript
  // bad
  const item = new Object()

  // good
  const item = {}
  ```

* Use readable synonyms in place of reserved words.

  ```javascript
  // bad
  const superman =
   {
     class: `alien`
   }

  // bad
  const superman =
    {
      klass: `alien`
    }

  // good
  const superman =
    {
      type: `alien`
    }
  ```

**[⬆ Back to top](#table-of-contents)**



## Arrays

* Use the literal syntax for array creation.

  ```javascript
  // bad
  const items = new Array()

  // good
  const items = []
  ```

* If you don't know array length use Array#push.

  ```javascript
  const someStack = []

  // bad
  someStack[someStack.length] = `abracadabra`

  // good
  someStack.push(`abracadabra`)
  ```

* When you need to copy an array use Array#slice. 
  [jsPerf](http://jsperf.com/converting-arguments-to-an-array/7)

  ```javascript
  const len = items.length
  const itemsCopy = []
  const i

  // bad
  for (i = 0; i < len; i++)
    itemsCopy[i] = items[i]

  // good
  itemsCopy = items.slice()
  ```

* To convert an array-like object to an array, use Array#slice.

  ```javascript
  function trigger() {
    const args = Array.prototype.slice.call(arguments)
    ...
  }
  ```

**[⬆ Back to top](#table-of-contents)**



## Strings

* Use backquotes ``` `` ``` for strings

  ```javascript
  // bad
  const name = "Bob Parr"

  // bad
  const name = 'Bob Parr'

  // good
  const name = `Bob Parr`

  // bad
  const fullName = "Bob " + lastName

  // bad
  const fullName = 'Bob ' + lastName

  // good
  const fullName = `Bob ${lastName}`
  ```

* Strings longer than 80 characters should be written across
  multiple lines.

  ```javascript
  // bad
  const errorMessage = `This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.`

  // good
  const errorMessage = `This is a super long error that was thrown because
    of Batman. When you stop to think about how Batman had anything to do
    with this, you would get nowhere fast.`
  ```

* When programmatically building up a string, use Array#join
  instead of string concatenation.

  ```javascript
  const messages = [{
    state: 'success',
    message: 'This one worked.'
  }, {
    state: 'success',
    message: 'This one worked as well.'
  }, {
    state: 'error',
    message: 'This one did not work.'
  }];

  const length = messages.length;

  // bad
  function inbox(messages) {
    let items = `<ul>`;

    for (let i = 0; i < length; i++)
      items += `<li>${messages[i].message}</li>`;

    return `${items}</ul>`;
  }

  // good
  function inbox(messages) {
    const items = [];

    for (i = 0; i < length; i++)
      items[i] = messages[i].message;

    return `<ul><li>${items.join('</li><li>')}</li></ul>`;
  }
  ```

**[⬆ Back to top](#table-of-contents)**



## Functions

* Function expressions:

  ```javascript
  // anonymous function expression
  const anonymous = () => true

  // named function expression
  const named = function named() {
    return true
  };

  // immediately-invoked function expression (IIFE)
  (function iife() {
    console.log(`Welcome to the Internet. Please follow me.`)
  })()
  ```

* Never declare a function in a non-function block (if, while, 
  etc). Assign the function to a variable instead.

  ```javascript
  // bad
  if (currentUser) {
    function test() {
      console.log('Nope.')
    }
  }

  // good
  const test;
  if (currentUser) {
    test = function () {
      console.log('Yup.')
    }
  }
  ```

* Never name a parameter `arguments`, this will take precedence 
  over the `arguments` object that is given to every 
  function scope.

  ```javascript
  // bad
  function nope(name, options, arguments) {
    // ...stuff...
  }

  // good
  function yup(name, options, ...args) {
    // ...stuff...
  }
  ```

**[⬆ Back to top](#table-of-contents)**



## Properties

  - Use dot notation when accessing properties.

    ```javascript
    const luke =
      {
        jedi: true,
        age: 28,
      };

    // bad
    const isJedi = luke[`jedi`]

    // good
    const isJedi = luke.jedi
    ```

  - Use subscript notation `[]` when accessing properties with a variable.

    ```javascript
    const luke =
      {
        jedi: true,
        age: 28,
      };

    function props(prop) {
      return luke[prop]
    }

    const isJedi = props(`jedi`)
    ```

**[⬆ Back to top](#table-of-contents)**



## Variables

* Always use `let` or `const` to declare variables, greatly preferring `const`.

  ```javascript
  // bad
  var superPower = SuperPower()

  // good
  let superPower = SuperPower()

  // good
  const superPower = SuperPower()
  ```

* Declare each variable on a newline, with a `const` before 
  each of them.

  ```javascript
  // bad
  const items = Items(),
      goSportsTeam = true,
      dragonball = `z`

  // good
  const items = Items()
  const goSportsTeam = true
  const dragonball = `z`
  ```

* Declare unassigned variables last. This is helpful when later 
  on you might need to assign a variable depending on one 
  of the previous assigned variables.

  ```javascript
  // bad
  const i
  const items = Items()
  const dragonball
  const goSportsTeam = true
  const len

  // good
  const items = Items()
  const goSportsTeam = true
  const dragonball
  const len
  const i
  ```

* Avoid redundant variable names, use `Object` instead.

  ```javascript
  // bad
  const kaleidoscopeName = `..`
  const kaleidoscopeLens = []
  const kaleidoscopeColors = []

  // good
  const kaleidoscope =
    {
      name: `..`,
      lens: [],
      colors: [],
    };
  ```

* Assign variables as close to where they are being used within 
  their scope.

  ```javascript
  // bad
  function bad() {
    const name = Name()
    test()
    console.log(`doing stuff...`)

    //...other stuff...

    if (name === `test`) {
      return false
    }

    return name
  }

  // good
  function good() {
    test()
    console.log(`doing stuff...`)

    //...other stuff...

    const name = Name()
    if (name === `test`) {
      return false
    }

    return name
  }

  // bad
  function bad(...args) {
    const name = Name()

    if (!args.length) {
      return false
    }

    return true
  }

  // good
  function good(...args) {
    if (!args.length) {
      return false
    }

    const name = Name();

    return true;
  }
  ```


## Imports

* Organize your imports in the following order:
  + core modules
  + npm modules
  + others

  ```javascript
  // bad
  import Car from './models/Car'
  import async from 'async'
  import http from 'http'

  // good
  import http from 'http'
  import fs from 'fs'

  import async from 'async'
  import mongoose from 'mongoose'

  import Car from './models/Car'
  ```

* Do not use the `.js` or `.ts` when importing modules

```javascript
  // bad
  import Batmobil from './models/Car.js'

  // good
  import Batmobil from './models/Car'

```

**[⬆ Back to top](#table-of-contents)**



## Callbacks

* Always check for errors in callbacks.

```javascript
//bad
database.get(`pokemons`, (err, pokemons) => {
  console.log(pokemons)
});

//good
database.get(`drabonballs`, (err, drabonballs) => {
  if (err) {
    // handle the error somehow, maybe return with a callback
    return console.log(err)
  }
  console.log(drabonballs)
});
```

* Return on callbacks.

```javascript
//bad
database.get(`drabonballs`, (err, drabonballs) => {
  if (err) {
    // if not return here
    console.log(err)
  }
  // this line will be executed as well
  console.log(drabonballs)
});

//good
database.get(`drabonballs`, (err, drabonballs) => {
  if (err) {
    // handle the error somehow, maybe return with a callback
    return console.log(err)
  }
  console.log(drabonballs)
});
```

* Use descriptive arguments in your callback when 
  it is an "interface" for others. It makes your code readable.

```javascript
// bad
function getAnimals(done) {
  Animal.get(done)
}

// good
function getAnimals(done) {
  Animal.get((err, animals) => {
    if(err) {
      return done(err)
    }

    return done(null, {
      dogs: animals.dogs,
      cats: animals.cats,
    })
  })
}
```

**[⬆ Back to top](#table-of-contents)**



## Try catch

* Only throw in synchronous functions.

  Try-catch blocks cannot be used to wrap async code. They will
  bubble up to the top, and bring down the entire process.

  ```javascript
  //bad
  function readPackageJson(callback) {
    fs.readFile('package.json', (err, file) => {
      if (err)
        throw err
      ...
    })
  }

  //good
  function readPackageJson(callback) {
    fs.readFile('package.json', (err, file) => {
      if (err)
        return callback(err)

      ...
    })
  }
  ```

* Catch errors in sync calls.

  ```javascript
  //bad
  const data = JSON.parse(jsonAsAString)

  //good
  const data
  try {
    data = JSON.parse(jsonAsAString);
  } catch (err) {
    //handle error - hopefully not with a console.log ;)
    console.log(err)
  }
  ```

**[⬆ Back to top](#table-of-contents)**



## Conditional Expressions & Equality

* Use `===` and `!==` over `==` and `!=`.
* Conditional expressions are evaluated using coercion with 
  the `ToBoolean` method and always follow these simple rules:

  - **Objects** evaluate to **true**
  - **Undefined** evaluates to **false**
  - **Null** evaluates to **false**
  - **Booleans** evaluate to **the value of the boolean**
  - **Numbers** evaluate to **false** if **+0, -0, or NaN**, 
    otherwise **true**
  - **Strings** evaluate to **false** if an empty string `''`, 
    otherwise **true**

  ```javascript
  if ([0]) {
    // true
    // An array is an object, objects evaluate to true
  }
  ```

* Use shortcuts.

  ```javascript
  // bad
  if (name !== ``) {
    // ...stuff...
  }

  // good
  if (name) {
    // ...stuff...
  }

  // bad
  if (collection.length > 0) {
    // ...stuff...
  }

  // good
  if (collection.length) {
    // ...stuff...
  }
  ```

* For more information see [Truth Equality and JavaScript](http://javascriptweblog.wordpress.com/2011/02/07/truth-equality-and-javascript/#more-2108) by Angus Croll

**[⬆ Back to top](#table-of-contents)**



## Blocks

  - Use braces with all multi-line blocks.

    ```javascript
    // bad
    if (test)
      return false

    // bad
    if (test) return false

    // good
    if (test)
      return false

    // bad
    function bad() { return false }

    // good
    function good() {
      return false
    }
    ```

**[⬆ Back to top](#table-of-contents)**



## Comments

* Use `/** ... */` for multiline comments. Include a description, 
  specify types and values for all parameters and return values.

  ```javascript
  // bad
  // make() returns a new element
  // based on the passed in tag name.
  //
  // @param <String> tag
  // @return <Element> element
  function make(tag) {

    // ...stuff...

    return element
  }

  // good
  /**
   * make() returns a new element
   * based on the passed in tag name.
   *
   * @param <String> tag
   * @return <Element> element
   */
  function make(tag) {

    // ...stuff...

    return element
  }
  ```

* Use `//` for single line comments. Place single line comments 
  on a new line above the subject of the comment. Put an empty 
  line before the comment.

  ```javascript
  // bad
  const active = true  // is current tab

  // good
  // is current tab
  const active = true

  // bad
  function getType(optType) {
    console.log(`fetching type...`)
    // set the default type to `no type`
    const type = optType || `no type`

    return type
  }

  // good
  function getType(optType) {
    console.log(`fetching type...`)

    // set the default type to `no type`
    const type = optType || `no type`

    return type;
  }
  ```

* Prefixing your comments with `FIXME` or `TODO` helps other 
  developers quickly understand if you're pointing out a problem 
  that needs to be revisited, or if you're suggesting a solution 
  to the problem that needs to be implemented. These are 
  different than regular comments because they are actionable. 
  The actions are `FIXME -- need to figure this out` 
  or `TODO -- need to implement`.

* Use `// FIXME:` to annotate problems.

  ```javascript
  function Calculator() {

    // FIXME: shouldn't use a global here
    total = 0;

    return {
      total,
    }
  }
  ```

* Use `// TODO:` to annotate solutions to problems

  ```javascript
  function Calculator() {

    // TODO: total should be configurable by an options param
    const total = 0

    return { total }
  }
```

**[⬆ Back to top](#table-of-contents)**



## Whitespace

* Use soft tabs set to two spaces.

  ```javascript
  // bad
  function bad() {
  ∙∙∙∙const name
  }

  // bad
  function bad() {
  ∙const name
  }

  // good
  function good() {
  ∙∙const name
  }
  ```

* Place one space before the leading brace.

  ```javascript
  // bad
  function test(){
    console.log(`test`)
  }

  // good
  function test() {
    console.log(`test`)
  }

  // bad
  dog.set(`attr`,{
    age: `1 year`,
    breed: `Bernese Mountain Dog`,
  })

  // good
  dog.set(`attr`, {
    age: `1 year`,
    breed: `Bernese Mountain Dog`,
  })
  ```

* Set off operators with spaces.

  ```javascript
  // bad
  const x=y+5

  // good
  const x = y + 5
  ```

* End files with a single newline character.

  ```javascript
  // bad
  (function iife(global) {
    // ...stuff...
  })(this)
  ```

  ```javascript
  // bad
  (function iife(global) {
    // ...stuff...
  })(this)↵
  ↵
  ```

  ```javascript
  // good
  (function iife(global) {
    // ...stuff...
  })(this)↵
  ```

* Use indentation when making long method chains.

  ```javascript
  // bad
  obj(`item`).find(`selected`).highlight().end().find(`open`).updateCount()

  // good
  obj(`item`)
    .find(`selected`)
      .highlight()
      .end()
    .find(`open`)
      .updateCount()

  // bad
  const leds = stage.selectAll(`.led`).data(data).enter().append(`svg:svg`).class(`led`, true)
      .attr(`width`,  (radius + margin) * 2).append(`svg:g`)
      .attr(`transform`, `translate(' + (radius + margin) + ',' + (radius + margin) + ')`)
      .call(tron.led)

  // good
  const leds = stage.selectAll(`.led`)
      .data(data)
    .enter().append(`svg:svg`)
      .class(`led`, true)
      .attr(`width`,  (radius + margin) * 2)
    .append(`svg:g`)
      .attr(`transform`, `translate(' + (radius + margin) + ',' + (radius + margin) + ')`)
      .call(tron.led)
  ```

**[⬆ Back to top](#table-of-contents)**



## Commas

* Leading commas: **Nope.**

  ```javascript
  // bad
  const hero =
    { firstName: `Bob`
    , lastName: `Parr`
    , heroName: `Mr. Incredible`
    , superPower: `strength`
    ,
    }

  // good
  const hero =
    {
      firstName: `Bob`,
      lastName: `Parr`,
      heroName: `Mr. Incredible`,
      superPower: `strength`,
    }
  ```

* Additional trailing comma: **Yes.**

  ```javascript
  // bad
  const hero =
    {
     firstName: `Kevin`,
      lastName: `Flynn`
    }

  const heroes =
    [
      `Batman`,
      `Superman`
    ]

  // good
  const hero =
    {
      firstName: `Kevin`,
      lastName: `Flynn`,
    }

  const heroes =
    [
      `Batman`,
      `Superman`,
    ]
  ```

**[⬆ Back to top](#table-of-contents)**



## Semicolons

* **Yes.**

  ```javascript
  // bad
  function bad() {
    const name = `Skywalker`
    return name
  }

  // good
  function good() {
    const name = `Skywalker`;
    return name;
  }
  ```

**[⬆ Back to top](#table-of-contents)**



## Type Casting & Coercion

* Perform type coercion at the beginning of the statement.
* Strings:

  ```javascript
  //  => reviewScore = 9;

  // bad
  const totalScore = reviewScore + ``

  // good
  const totalScore = `` + reviewScore

  // best
  const totalScore = `${reviewScore}`

  // bad
  const totalScore = `` + reviewScore + ` total score`

  // good
  const totalScore = reviewScore + ` total score`

  // best
  const totalScore = `${reviewScore} total score`
  ```

* Use `parseInt` for Numbers and always with a radix for 
  type casting.

  ```javascript
  const inputValue = `4`

  // bad
  const val = new Number(inputValue)

  // bad
  const val = +inputValue

  // bad
  const val = inputValue >> 0

  // bad
  const val = parseInt(inputValue)

  // good
  const val = Number(inputValue)

  // good
  const val = parseInt(inputValue, 10)
  ```

* If for whatever reason you are doing something wild 
  and `parseInt` is your bottleneck and need to use Bitshift 
  for [performance reasons](http://jsperf.com/coercion-vs-casting/3), 
  leave a comment explaining why and what you're doing.

  ```javascript
  // good
  /**
   + parseInt was the reason my code was slow.
   + Bitshifting the String to coerce it to a
   + Number made it a lot faster.
   */
  const val = inputValue >> 0
  ```

* **Note:** Be careful when using bitshift operations. Numbers 
  are represented as [64-bit values](http://es5.github.io/#x4.3.19), 
  but Bitshift operations always return a 32-bit integer 
  ([source](http://es5.github.io/#x11.7)). Bitshift can lead 
  to unexpected behavior for integer values larger than 
  32 bits. [Discussion](https://github.com/airbnb/javascript/issues/109). 
  Largest signed 32-bit Int is 2,147,483,647:

  ```javascript
  2147483647 >> 0 //=> 2147483647
  2147483648 >> 0 //=> -2147483648
  2147483649 >> 0 //=> -2147483647
  ```

* Booleans:

  ```javascript
  const age = 0

  // bad
  const hasAge = new Boolean(age)

  // good
  const hasAge = Boolean(age)

  // good
  const hasAge = !!age
  ```

**[⬆ Back to top](#table-of-contents)**



## Naming Conventions

  - Avoid single letter names. Be descriptive with your naming.

    ```javascript
    // bad
    function q() {
      // ...stuff...
    }

    // good
    function query() {
      // ..stuff..
    }
    ```

  - Use camelCase when naming objects, functions, and instances.

    ```javascript
    // bad
    const OBJEcttsssss = {}
    const this_is_my_object = {}
    function c() {}
    const u = makeUser({
      name: `Bob Parr`,
    })

    // good
    const thisIsMyObject = {}
    function thisIsMyFunction() {}
    const user = makeUser({
      name: `Bob Parr`,
    })
    ```

  - Use PascalCase when naming constructors.

    ```javascript
    // bad
    function user({name}) {
      return {
        name,
      }
    }

    const bad = user({
      name: `nope`,
    })

    // good
    function User({name}) {
      return {
        name,
      }
    }

    const good = User({
      name: `yup`,
    })
    ```

  - Name your functions. This is helpful for stack traces.

    ```javascript
    // bad
    const log = function(msg) {
      console.log(msg)
    }

    // good
    const log = function log(msg) {
      console.log(msg)
    }
    ```

**[⬆ Back to top](#table-of-contents)**



## Accessors

* Accessor functions for properties are not required. If you do 
  make accessor functions, there are certain recommended forms, 
  depending on how the property is expressed:

  - If the property is expressed as a noun, the format is:
    + \<*type*\>function *noun*()
    + \<void\>function set*Noun*(\<*type*\>*aNoun*)
    
    For example:
    ```javascript
    const age = dragon.age()

    dragon.setAge(42)
    ```

  - If the property is expressed as an adjective, the format is:
    + \<Boolean\>function is*Adjective*()
    + \<void\>function set*Adjective*(\<Boolean\>flag)
    
    For example:
    ```javascript
    const editable = text.isEditable()

    text.setEditable(true)
    ```

  - If the property is expressed as a verb, the format is:
    + \<Boolean\>function *verbObject*()
    + \<void\>function set*VerbObject*(\<Boolean\>flag)
    
    For example:
    ```javascript
    const showsAlpha = colorPanel.showsAlpha()

    colorPanel.setShowsAlpha(true)
    ```

    The verb should be simple present tense.

  - Don’t twist a verb into an adjective by using a participle:

    | Example | Correct? |
    | ------------ | ----------- |
    | `<void>setAcceptsSubscribers(<Boolean>flag)` | Right. |
    | `<Boolean>acceptsSubscribers` | Right. |
    | `<void>setSubscribersAccepted(<Boolean>flag)` | Wrong. |
    | `<Boolean>subscribersAccepted` | Wrong. |

  - May use modal verbs (verbs preceded by “can”, “should”, 
    “will”, and so on) to clarify meaning, but don’t use 
    “do” or “does”.

    | Example | Correct? |
    | ------------ | ----------- |
    | `<void>setCanSubscribe(<Boolean>flag)` | Right. |
    | `<Boolean>canSubscribe` | Right. |
    | `<void>setShouldCloseStream(<Boolean>flag)` | Right. |
    | `<Boolean>shouldCloseStream` | Right. |
    | `<void>setDoesAcceptSubscribers(<Boolean>flag)` | Wrong. |
    | `<Boolean>doesAcceptSubscribers` | Wrong. |

  - Use “get” only for methods that return objects and values 
    indirectly. Use this form for methods only when multiple 
    items need to be returned.

**[⬆ Back to top](#table-of-contents)**