const PORT = process.env.PORT || 3003
const app = require('./app')

app.listen(PORT, ()=>{
    console.log("server running at port "+PORT)
})
