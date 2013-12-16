
# css-color-function
  
  Implements Tab Atkins's proposed color function in CSS.

## Installation

    $ npm install css-color-function

## Example

```js
var color = require('css-color-function');

color.convert('color(red tint(50%))');
// "rgb(255, 128, 128)"

color.parse('color(red blue(+ 30) tint(50%))');
// {
//   color: 'red',
//   adjusters: [
//     {
//       name: 'blue',
//       modifier: '+',
//       values: ['30']
//     }
//     {
//       name: 'tint',
//       values: ['50%']
//     }
//   ]
// }
```

## API

### color.convert(string)

  Convert a color function CSS `string` into an RGB color string.

### color.parse(string)

  Parse a color function CSS `string` and return an AST.

## License

  MIT
