const express =  require('express');
const path = require('path');

const app=express();

app.use(express.static('/dist/sistema-ventas-app', { root: __dirname }));
app.get('/*',function (req,res) {
    res.sendFile(path.join('/dist/sistema-ventas-app/index.html', { root: __dirname }));
})
app.listen(process.env.PORT || 8080);