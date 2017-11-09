'use strict'

const helper = require('../helper');
const expect = require('chai').expect

it('helper.extract', () => {
  expect(helper.extract([], "Montag")).to.contain("Heute");
})

it('helper.getDay montag', () => {
  expect(helper.getDay(1)).to.contain("Montag");
})

it('helper.getDay donnerstag', () => {
  expect(helper.getDay(4)).to.contain("Donnerstag");
})