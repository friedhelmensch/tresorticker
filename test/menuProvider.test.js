'use strict'

const menuProvider = require('../menuProvider');
const expect = require('chai').expect

it('Parsing the text representation of Wochenkarte should create menu', () => {
  const fs = require('fs')

  const menuText = fs.readFileSync('./test/Wochenkarte.content.txt', 'utf8').replace(/(\r\n |\n |\r )/gm, "")
  const menu = menuProvider.getMenu(menuText)

  const expectedMenu = [{
      "day": "2018-02-26",
      "meals": [{
        "meal": "Schupfnudelpfanne mit Sauerkraut und Kasseler",
        "priceInEUR": "7.50"
      }]
    },
    {
      "day": "2018-02-27",
      "meals": [{
        "meal": "Gebratene Hähnchenbrust auf Gemüsereis und Magodip",
        "priceInEUR": "7.50"
      }]
    },
    {
      "day": "2018-02-28",
      "meals": [{
        "meal": "Gefüllter Schweinehals mit Spätzle",
        "priceInEUR": "7.50"
      }]
    },
    {
      "day": "2018-03-01",
      "meals": [{
        "meal": "Überbackenes Putensteak mit Tomate-Mozzarella und Wedges",
        "priceInEUR": "7.50"
      }]
    },
    {
      "day": "2018-03-02",
      "meals": [{
        "meal": "Tilapiafilet mit Rosmarinkartoffeln",
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
  ];

  expect(menu).to.deep.equal(expectedMenu);
})

it('GetMenu should return daily special as well as all week daily dishes', () => {
  const fs = require('fs')
  const LocalDate = require('js-joda').LocalDate;

  const menuText = fs.readFileSync('./test/Wochenkarte.content.txt', 'utf8').replace(/(\r\n |\n |\r )/gm, "")
  const todaysMenu = menuProvider.getMenuByDay(LocalDate.of(2018, 2, 26), menuText)

  const expectedDailyMenu = [{
      "day": "2018-02-26",
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

it('Extracting start date of weekly menu should return 26.02.2018', () => {
  const fs = require('fs')
  const LocalDate = require('js-joda').LocalDate;

  const menuText = fs.readFileSync('./test/Wochenkarte.content.txt', 'utf8').replace(/(\r\n |\n |\r )/gm, "")
  const weekRangeRegEx = /\d{1,2}. (Januar?|Februar?|März?|April?|Mai|Juni?|Juli?|August?|September?|Oktober?|November?|Dezember?) bis/g
  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const dayAndMonth = menuText
    .match(weekRangeRegEx)[0]
    .replace('bis', '')
    .replace(' ', '')
    .trim()
    .split('.')

  const startDate = LocalDate.of(new Date().getFullYear(), monthNames.indexOf(dayAndMonth[1].trim()) + 1, dayAndMonth[0])
  const expectedStartDate = LocalDate.of(2018, 2, 26)

  expect(expectedStartDate).to.deep.equal(startDate);
})