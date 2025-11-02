// start server
require('dotenv').config({path:'../.env'});
const app = require('./app');
const connectDB = require('./db/db');
// const cookieParser = require('cookie-parser');/
// connect to database
connectDB();





// app.use(cookieParser());
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
})
