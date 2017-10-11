
var assert = require('assert');
var color = require('..');

function parse (string, expected) {
  string = 'color-mod(' + string + ')';
  assert.deepEqual(color.parse(string), expected);
}

describe('#parse', function () {
  it('should parse a color', function () {
    parse('red', {
      type: 'function',
      name: 'color-mod',
      arguments: [
        {
          type: 'color',
          value: 'red'
        }
      ]
    });
  });

  it('should parse a complex color', function () {
    parse('rgba(0,0,0,0)', {
      type: 'function',
      name: 'color-mod',
      arguments: [
        {
          type: 'color',
          value: 'rgba(0,0,0,0)'
        }
      ]
    });
  });

  it('should parse a more complex color', function () {
    parse('rgba(0, 31, 231, .4)', {
      type: 'function',
      name: 'color-mod',
      arguments: [
        {
          type: 'color',
          value: 'rgba(0, 31, 231, .4)'
        }
      ]
    });
  });

  it('should parse a basic adjuster', function () {
    parse('red red(24)', {
      type: 'function',
      name: 'color-mod',
      arguments: [
        {
          type: 'color',
          value: 'red',
        },
        {
          type: 'function',
          name: 'red',
          arguments: [
            {
              type: 'number',
              value: '24'
            }
          ]
        }
      ]
    });
  });

  it('should parse an adjuster with a modifier', function () {
    parse('red red(+ 24)', {
      type: 'function',
      name: 'color-mod',
      arguments: [
        {
          type: 'color',
          value: 'red',
        },
        {
          type: 'function',
          name: 'red',
          arguments: [
            {
              type: 'modifier',
              value: '+'
            },
            {
              type: 'number',
              value: '24'
            }
          ]
        }
      ]
    });
  });

  it('should parse multiple adjusters', function () {
    parse('red red(24) blue(27)', {
      type: 'function',
      name: 'color-mod',
      arguments: [
        {
          type: 'color',
          value: 'red',
        },
        {
          type: 'function',
          name: 'red',
          arguments: [
            {
              type: 'number',
              value: '24'
            }
          ]
        },
        {
          type: 'function',
          name: 'blue',
          arguments: [
            {
              type: 'number',
              value: '27'
            }
          ]
        }
      ]
    });
  });

  it('should parse adjusters with multiple arguments', function () {
    parse('red blend(white 50%)', {
      type: 'function',
      name: 'color-mod',
      arguments: [
        {
          type: 'color',
          value: 'red',
        },
        {
          type: 'function',
          name: 'blend',
          arguments: [
            {
              type: 'number',
              value: 'white'
            },
            {
              type: 'number',
              value: '50%'
            }
          ]
        }
      ]
    });
  });

  it('should parse adjusters with nested color functions', function () {
    parse('red blend(color-mod(red) 50%)', {
      type: 'function',
      name: 'color-mod',
      arguments: [
        {
          type: 'color',
          value: 'red',
        },
        {
          type: 'function',
          name: 'blend',
          arguments: [
            {
              type: 'function',
              name: 'color-mod',
              arguments: [
                {
                  type: 'color',
                  value: 'red'
                }
              ]
            },
            {
              type: 'number',
              value: '50%'
            }
          ]
        }
      ]
    });
  });

  it('should parse nested color functions', function () {
    parse('color-mod(hsl(0, 0%, 93%) l(- 5%)) l(+ 10%)', {
      type: 'function',
      name: 'color-mod',
      arguments: [
        {
          type: 'function',
          name: 'color-mod',
          arguments: [
            {
              type: 'color',
              value: 'hsl(0, 0%, 93%)',
            },
            {
              type: 'function',
              name: 'l',
              arguments: [
                {
                  type: 'modifier',
                  value: '-'
                },
                {
                  type: 'number',
                  value: '5%'
                }
              ]
            }
          ]
        },
        {
          type: 'function',
          name: 'l',
          arguments: [
            {
              type: 'modifier',
              value: '+'
            },
            {
              type: 'number',
              value: '10%'
            }
          ]
        }
      ]
    });
  });

  it('should properly parse modifiers', function () {
    parse('red a(+ 5%) a(+5%) a(- 5%) a(-5%) a(* 50%) a(*50%)', {
      type: 'function',
      name: 'color-mod',
      arguments: [
        {
          type: 'color',
          value: 'red',
        },
        {
          type: 'function',
          name: 'a',
          arguments: [
            {
              type: 'modifier',
              value: '+'
            },
            {
              type: 'number',
              value: '5%'
            }
          ]
        },
        {
          type: 'function',
          name: 'a',
          arguments: [
            {
              type: 'number',
              value: '+5%'
            }
          ]
        },
        {
          type: 'function',
          name: 'a',
          arguments: [
            {
              type: 'modifier',
              value: '-'
            },
            {
              type: 'number',
              value: '5%'
            }
          ]
        },
        {
          type: 'function',
          name: 'a',
          arguments: [
            {
              type: 'number',
              value: '-5%'
            }
          ]
        },
        {
          type: 'function',
          name: 'a',
          arguments: [
            {
              type: 'modifier',
              value: '*'
            },
            {
              type: 'number',
              value: '50%'
            }
          ]
        },
        {
          type: 'function',
          name: 'a',
          arguments: [
            {
              type: 'modifier',
              value: '*'
            },
            {
              type: 'number',
              value: '50%'
            }
          ]
        }
      ]
    });
  })


  it('should throw on syntax error', function () {
    assert.throws(function () {
      color.parse('color-mod(red');
    }, /Missing closing parenthese/);
  });

  it('should throw on syntax error for adjuster', function () {
    assert.throws(function () {
      color.parse('color-mod(red l(+ 5%)');
    }, /Missing closing parenthese for/);
  });

  it('should throw on syntax error if color-mod() is empty', function () {
    assert.throws(function () {
      color.parse('color-mod()');
    }, /color-mod\(\) function cannot be empty/);
  });
});
