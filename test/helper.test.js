'use strict'

const helper = require('../helper');
const expect = require('chai').expect

it('helper.extract', () => {
  expect(helper.extract([], "Montag")).to.contain("Heute");
})

it('helper.today montag', () => {
  expect(helper.getToday(1)).to.contain("Montag");
})

it('helper.today donnerstag', () => {
  expect(helper.getToday(4)).to.contain("Donnerstag");
})