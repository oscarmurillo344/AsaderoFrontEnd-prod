const express =  require('express');
const path = require('path');

const app=express();
app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname+'./dist/sistema-ventas-app'));
app.get('/*',function (req,res) {
    res.sendFile(path.join(__dirname+'./dist/sistema-ventas-app/index.html'));
})
app.listen(app.get('port'));