const mongoose = require('mongoose')

const connectionURL = process.env.MONGODB_URL // connection url + db name

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(console.log("Connected to MongoDB ....."))




