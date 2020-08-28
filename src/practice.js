//echo "console.log('hello, practice')" >> ./src/practice.js
//node ./src/practice.js

require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  //connection: 'postgresql://dunder_mifflin@localhost/knex-practice',
  //connection: 'postgresql://dunder_mifflin:password-here@localhost/knex-practice',
  connection: process.env.DB_URL
})

//const q1 = knexInstance('amazong_products').select('*').toQuery()
//const q2 = knexInstance.from('amazong_products').select('*').toQuery()
//console.log('q1:', q1)
//console.log('q2:', q2)

//knexInstance.from('amazong_products').select('*')
//   .then(result => {
//    console.log(result)
//    })

//SELECT product_id, name, price, category
//    FROM amazong_products
//WHERE name = 'Point of view gun';

/*knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({ name: 'Point of view gun' })
  .first()
  .then(result => {
    console.log(result)
  })*/


/*const qry = knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({ name: 'Point of view gun' })
  .first()
  .toQuery() */
  // .then(result => {
  //   console.log(result)
  // })

//console.log(qry)



const searchTerm = 'holo'
/*knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where('name', 'ILIKE', `%${searchTerm}%`)
  .then(result => {
    console.log(result)
  })*/

/*function searchByProduceName(searchTerm) {
    knexInstance
      .select('product_id', 'name', 'price', 'category')
      .from('amazong_products')
      .where('name', 'ILIKE', `%${searchTerm}%`)
      .then(result => {
        console.log(result)
      })
}
  
searchByProduceName('holo')

function paginateProducts(page) {
    const productsPerPage = 10
    const offset = productsPerPage * (page - 1)
    knexInstance
      .select('product_id', 'name', 'price', 'category')
      .from('amazong_products')
      .limit(productsPerPage)
      .offset(offset)
      .then(result => {
        console.log(result)
      })
  }
  paginateProducts(2)*/


/*function getProductsWithImages() {
    knexInstance
      .select('product_id', 'name', 'price', 'category', 'image')
      .from('amazong_products')
      .whereNotNull('image')
      .then(result => {
        console.log(result)
      })
  }
  getProductsWithImages()*/


  // getProductsWithImages()

  
function mostPopularVideosForDays(days) {
    knexInstance
      .select('video_name', 'region')
      .count('date_viewed AS views')
      .where(
        'date_viewed',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
      )
      .from('whopipe_video_views')
      .groupBy('video_name', 'region')
      .orderBy([
        { column: 'region', order: 'ASC' },
        { column: 'views', order: 'DESC' },
      ])
      .then(result => {
        console.log(result)
      })
  }
  
  mostPopularVideosForDays(30)