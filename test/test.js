const expect = require('chai').expect;
const Square = require('../src/index');

describe('#Square', () => {
  it('should return 4', () => {
    const result = Square(2);
    expect(result).to.equal(4);
  });
});
