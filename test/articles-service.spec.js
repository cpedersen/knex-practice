//Verify that the test fails
/*describe(`Articles service object`, function() {
    it(`should run the tests`, () => {
      expect(true).to.eql(false)
    })
})*/

//Refactor the test, inserting a tested describe
const ArticlesService = require('../src/articles-service')
const knex = require('knex')

describe(`Articles service object`, function() {
    let db
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })
    describe(`getAllArticles()`, () => {
        it(`resolves all articles from 'blogful_articles' table`, () => {
        // test that ArticlesService.getAllArticles gets data from table
        })
    })
})