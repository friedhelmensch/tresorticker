'use strict'

const menuProvider = require('../menuProvider');
const expect = require('chai').expect

it('Parsing the text representation of Wochenkarte should create menu', () => {

  const fs = require('fs')

  const menuText = fs.readFileSync('./test/Wochenkarte.content.txt', 'utf8').replace(/(\r\n |\n |\r )/gm, "")
  const menu = menuProvider.getMenu(menuText)

  const expectedMenu = [
    {"day": "Montag", "meals":[{
      "meal": "Schupfnudelpfanne mit Sauerkraut und Kasseler",
      "priceInEUR": "7.50"
    }]},
    {"day": "Dienstag", "meals":[{
      "meal": "Gebratene Hähnchenbrust auf Gemüsereis und Magodip",
      "priceInEUR": "7.50"
    }]},
    {"day": "Mittwoch", "meals":[{
      "meal": "Gefüllter Schweinehals mit Spätzle",
      "priceInEUR": "7.50"
    }]},
    {"day": "Donnerstag", "meals":[{
      "meal": "Überbackenes Putensteak mit Tomate-Mozzarella und Wedges",
      "priceInEUR": "7.50"
    }]},
    {"day": "Freitag", "meals":[{
      "meal": "Tilapiafilet mit Rosmarinkartoffeln",
      "priceInEUR": "7.50"
    }]},
    {"day": "Täglich", "meals":[{
      "meal": "Salatteller mit Schinken und Ei",
      "priceInEUR": "7.20"
    }, {
      "meal": "Spaghetti „Amatriciana“ mit Speck in Tomatensosse",
      "priceInEUR": "7.00"
    }, {
      "meal": "Linseneintopf mit Saiten",
      "priceInEUR": "6.80"
    }]}
  ];

  expect(menu).to.deep.equal(expectedMenu);
})

it('GetMenu should return daily special as well as all week daily dishes', () => {
  const fs = require('fs')
  const helper = require('../helper');

  const menuText = fs.readFileSync('./test/Wochenkarte.content.txt', 'utf8').replace(/(\r\n |\n |\r )/gm, "")
  const todaysMenu = menuProvider.getMenuByDay(new Date(2018, 2, 26), menuText, helper)

  const expectedDailyMenu = [{
      "day": "Montag",
      "meals": [{
        "meal": "Schupfnudelpfanne mit Sauerkraut und Kasseler",
        "priceInEUR": "7.50"
      }]
    },
    {
      "day": "Täglich",
      "meals": [{
        "meal": "Salatteller mit Schinken und Ei",
        "priceInEUR": "7.20"
      }, {
        "meal": "Spaghetti „Amatriciana“ mit Speck in Tomatensosse",
        "priceInEUR": "7.00"
      }, {
        "meal": "Linseneintopf mit Saiten",
        "priceInEUR": "6.80"
      }]
    }
  ]

  expect(todaysMenu).to.deep.equal(expectedDailyMenu);
})
