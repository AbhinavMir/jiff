// BigNumber Library
var BigNumber = require('bignumber.js');

// Reuse base generation but with different underlying generation methods
var baseGeneration = require('../base/generation.js');

// Override
baseGeneration.generateUniform = function (test, options) {
  var Zp = new BigNumber(options.Zp);
  return BigNumber.random().times(Zp).floor();
};
baseGeneration.generateNonZeroUniform = function (test, options) {
  var Zp = new BigNumber(options.Zp);
  return BigNumber.random().times(Zp.minus(1)).plus(1).floor();
};
baseGeneration.generateBit = function (test, options) {
  return Math.random() < 0.5 ? new BigNumber(0) : new BigNumber(1);
};
baseGeneration.generateMultiple = function (test, options, factor) {
  var Zp = new BigNumber(options.Zp);
  var coef = baseGeneration.generateUniform(test, { Zp: Zp.div(factor).floor() });
  return coef.times(factor);
};

module.exports = baseGeneration;