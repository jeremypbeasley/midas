const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://admin:almighty@ds035348.mlab.com:35348/caseyappv1', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('View the build at http://localhost:3000/')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

// DISPLAYING ITEMS

app.get('/', (req, res) => {
  db.collection('tranzactions').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {tranzactions: result})
  })
})

// ADDING NEW ITEMS

app.use(bodyParser.urlencoded({extended: true}))

app.post('/tranzactions', (req, res) => {
  db.collection('tranzactions').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

// UPDATING ITEMS

app.put('/tranzactions', (req, res) => {
  db.collection('tranzactions')
  .findOneAndUpdate({category: 'France'}, {
    $set: {
      amount: req.body.amount,
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/tranzactions', (req, res) => {
  db.collection('tranzactions').findOneAndDelete({category: req.body.category}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})

// app.put('/tranzactions', (req, res) => {
//   db.collection('tranzactions')
//   .findOneAndUpdate({category: 'France'}, {
//     $set: {
//       amount: req.body.amount,
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })


// PLAID

// var plaid = require('plaid');
// var access_token = "";

// var plaidClient = new plaid.Client('576cd20566710877408d0572'
// , '945fb4239cb1de171fd6feb4e41291', plaid.environments.tartan);

// plaidClient.addAuthUser('wells', {
//   username: 'XXXXXXXXX',
//   password: 'XXXXXXXX',
// }, function(err, mfaResponse, response) {
//   if (err != null) {
//     console.error(err);
//   } else if (mfaResponse != null) {
//     plaidClient.stepAuthUser(mfaResponse.access_token, 'tomato', {},
//     function(err, mfaRes, response) {
//       console.log(response.accounts);
//     });
//   } else {
//     console.log(response.accounts);
//     var access_token = response.access_token;
//   }
// });

// plaidClient.getConnectUser(access_token, {
//   gte: '30 days ago',
// }, function(err, response) {
//   console.log(access_token)
// });





