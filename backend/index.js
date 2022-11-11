const express = require('express')
const mongoose = require('mongoose')
const router = require("./routes/user-routes")
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser())
app.use(express.json())
app.use('/api', router)
mongoose.connect(
    "mongodb://localhost:27017/marhabaDB"
)
.then(()=>{console.log("database is connected")}).catch((err) => console.log(err));

app.use(express.urlencoded({extended : true}))
// app.use(cors())



app.listen(3001, ()=> console.log('running'))