'use strict'

const extractString = require('../extractString');
const expect = require('chai').expect

it('extractString', () => {
  expect(extractString([], "Montag")).to.contain("Heute");
})