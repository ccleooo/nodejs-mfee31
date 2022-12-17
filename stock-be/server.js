const express = require('express');
//利用 express 這個框架建立一個web app
const app =express();

//app. [method]
//get, post, put, patch, delete, option, head(共七個)
app.get('/', (req, res) => {
    res.send('Hello Express2')
});

// port可隨便打 不可重複、需大於1024
app.listen(3001, () => {
    console.log('Server running at port 3001')
});