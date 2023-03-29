const express = require('express')
const dotenv = require('dotenv').config()
const DataRoutes = require('./routes/data')
const JobRoutes = require('./routes/job')
const app = express()
app.use(express.json())

app.use('/api', DataRoutes)
app.use('/api', JobRoutes)


const PORT = process.env.PORT ?? 7000
app.listen(PORT, () => console.log("Server was run on port " + PORT))