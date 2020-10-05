const express =  require('express');
const path = require('path');

const app=express();

app.use(express.static(__dirname+'dist/sistemaventasapp'));
app.get('/*',function (req,res) {
    res.sendFile('dist/sistemaventasapp/index.html',{ root: '.' });
})
app.listen(process.env.PORT || 8080);