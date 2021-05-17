const MongoClient = require('mongodb').MongoClient;
const uri =
  'mongodb+srv://lollinadmin:qq4wrf@lollindatabase.fqop9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// client.connect((err) => {
//   const collection = client.db('test').collection('devices');
//   // perform actions on the collection object
//   console.log(collection);
//   client.close();
// });

module.exports = client;
