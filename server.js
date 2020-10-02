const express =  require('express');
const path = require('path');

const app=express();
app.set('port', (process.env.PORT || 8080))
app.use(express.static('/dist/sistemaventasapp'));
app.get('/*',function (req,res) {
    res.sendFile(path.join('/dist/sistemaventasapp/index.html'));
})
app.listen(app.get('port'));