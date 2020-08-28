require('dotenv').config()
const knex = require('knex')
const knexInstance = knex({
    client: 'pg',
    //connection: 'postgresql://dunder_mifflin@localhost/knex-practice',
    //connection: 'postgresql://dunder_mifflin:password-here@localhost/knex-practice',
    connection: process.env.DB_URL
  })

// Drill #1 - Get all items that contain text
/*function getItemsByText(searchTerm) {
    knexInstance
      //.select('id', 'name', 'price', 'date_added', 'checked', 'category')
      .select ('*')
      .from('shopping_list')
      .where('name', 'ILIKE', `%${searchTerm}%`)
      .then(result => {
        console.log(result)
      })
  }
getItemsByText('fish')*/


// Drill #2 - Get all items paginated
/*function paginateItems(page) {
    const itemsPerPage = 6
    const offset = itemsPerPage * (page - 1)
    knexInstance
      .select('*')
      .from('shopping_list')
      .limit(itemsPerPage)
      .offset(offset)
      .then(result => {
        console.log(result)
      })
  }
paginateItems(4)*/


// Drill #3 - Get all items added after date
/*function itemsAddedAfterDate(daysAgo) {
    knexInstance
      //.select('id', 'name', 'price', 'date_added', 'checked', 'category')
      .select('*')
      .from('shopping_list')
      .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
      )
      .then(results => {
        console.log(results)
      })
  }
itemsAddedAfterDate(30)*/


// Drill #4 - Get the total cost for each category
function costPerCategory() {
    knexInstance
      .select('category')
      .from('shopping_list')
      .groupBy('category')
      .sum('price AS total')
      .then(result => {
        console.log(result)
      })
  }
  
costPerCategory()
