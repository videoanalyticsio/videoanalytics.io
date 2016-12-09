const expect = require('chai').expect;
const offof = require('../dist/index');

describe('#offof', () => {

  it('should return same number', () => {
    const result = offof(undefined, 10);
    expect(result).to.equal(10);
  });

  it('should return 1', () => {
    const result = offof(10, 10);
    expect(result).to.equal(1);
  });

  it('should return 0.5', () => {
    const result = offof(5, 10);
    expect(result).to.equal(0.5);
  });
});