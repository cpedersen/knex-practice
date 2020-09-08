/**
 * GENERAL NOTE:
 * Be VERY mindful of the use of _implicit returns_ with arrow functions.
 * Pay careful attention to whether the function utilizes curly braces or
 * not:
 * 
 * () => { 
 *   return db().select();
 * }
 *   vs
 * () => 
 *  db().select()
 * 
 * If you receive a strange error, especially errors concerning hooks, 
 * you have probably NOT returned an async function from one or more
 * of your tests. 
 * 
 */


const knex = require('knex')
const ArticlesService = {
    getAllArticles(knex) {
        //return 'all the articles!!'
        //return Promise.resolve('all the articles!!')
        return knex.select('*').from('blogful_articles')
    },
    insertArticle(knex, newArticle) {
        //return Promise.resolve({})
        return knex
            .insert(newArticle)
            .into('blogful_articles')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('blogful_articles').select('*').where('id', id).first()
    },
    deleteArticle(knex, id) {
        return knex('blogful_articles')
            .where({ id })
            .delete()
    },
    updateArticle(knex, id, newArticleFields) {
        return knex('blogful_articles')
            .where({ id })
            .update(newArticleFields)
    },
}

describe(`Articles service object`, function() {
    let db
    let testArticles = [
        {
            id: 1,
            date_published: new Date('2029-01-22T16:28:32.615Z'),
            title: 'First test post!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
        },
        {
            id: 2,
            date_published: new Date('2100-05-22T16:28:32.615Z'),
            title: 'Second test post!',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
        },
        {
            id: 3,
            date_published: new Date('1919-12-22T16:28:32.615Z'),
            title: 'Third test post!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('blogful_articles').truncate())
    afterEach(() => db('blogful_articles').truncate())
    after(() => db.destroy())



    // DATA TEST
    context(`Given 'blogful_articles' has data`, () => {
        beforeEach(() => {
          return db
            .into('blogful_articles')
            .insert(testArticles)
        })

        //TODO - test failure is here
        it(`getById() resolves an article by id from 'blogful_articles' table`, () => {
            const thirdId = 3
            const thirdTestArticle = testArticles[thirdId - 1]
            //const thirdTestArticle = testArticles.find(a => a.id === thirdId);
            return ArticlesService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        title: thirdTestArticle.title,
                        content: thirdTestArticle.content,
                        //date_published: thirdTestArticle.date_published,
                        date_published: new Date(thirdTestArticle.date_published),
                    })
                })
                /*.then(actual => {
                    expect(actual).to.eql(thirdTestArticle)
                })*/
        })
    
        it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {
          return ArticlesService.getAllArticles(db)
            .then(actual => {
              expect(actual).to.eql(testArticles)
            })
        })

        it(`getById() resolves an article by id from 'blogful_articles' table`, () => {
            const thirdId = 3
            const thirdTestArticle = testArticles[thirdId - 1]
            return ArticlesService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        title: thirdTestArticle.title,
                        content: thirdTestArticle.content,
                        date_published: thirdTestArticle.date_published,
                    })
                })
        })

        it(`deleteArticle() removes an article by id from 'blogful_articles' table`, () => {
            const articleId = 3
            return ArticlesService.deleteArticle(db, articleId)
                .then(() => ArticlesService.getAllArticles(db))
                .then(allArticles => {
                const expected = testArticles.filter(article => article.id !== articleId)
                expect(allArticles).to.eql(expected)
            })
        })

        it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
            const idOfArticleToUpdate = 3
            const newArticleData = {
                title: 'updated title',
                content: 'updated content',
                date_published: new Date(),
            }
            return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
                .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
                .then(article => {
                    expect(article).to.eql({
                        id: idOfArticleToUpdate,
                        ...newArticleData,
                    })
                })
            })
      })


    //NO DATA TEST
    context(`Given 'blogful_articles' has no data`, () => {
       it(`getAllArticles() resolves an empty array`, () => {
         return ArticlesService.getAllArticles(db)
           .then(actual => {
             expect(actual).to.eql([])
           })
       })
    })



    it(`insertArticle() inserts a new article and resolves the new article with an 'id'`, () => {
        const newArticle = {
            title: 'Test new title',
            content: 'Test new content',
            date_published: new Date('2020-01-01T00:00:00.000Z'),
        }
        return ArticlesService.insertArticle(db, newArticle)
            .then(actual => {
                expect(actual).to.eql({
                    id: 1,
                    title: newArticle.title,
                    content: newArticle.content,
                    //date_published: newArticle.date_published,
                    date_published: new Date(newArticle.date_published),
                })
            })
    })
})