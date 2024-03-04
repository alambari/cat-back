'use strict';

const nanoid = require('nanoid');

function generateToken(len = 32, size) {
  return nanoid.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', len)(size);
}

module.exports = {
  generateToken
};