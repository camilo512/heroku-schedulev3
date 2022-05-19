const { app } = require('./app');

// Models
const { initModels } = require('./models/initModels');

// Utils // conected a bd
const { db } = require('./utils/database');
const req = require('express/lib/request');

// Authenticate database credentials
db.authenticate()
  .then(() => console.log('DB authenticated '))
  .catch(err => console.log(err));

// establish model relations
initModels();

//{ force: true }
db.sync()
  .then(() => console.log('Databe synced'))
  .catch(err => console.log(err));

// Spin to server
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(` Express app running on port!!: ${PORT}`);
});
