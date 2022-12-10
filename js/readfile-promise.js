const fs = require('fs');

let p = new Promise((resolve, reject) => {
    fs.readFile('test.txt', 'utf-8', (err, data) => {
        if(err){
            console.error('發生錯誤',err);
        }else{
            console.log('成功讀到資料:', data);
        }
    });
})

console.log(p); // Promise 物件 <pending>

p.then((data) => {
    console.log(data);
  }).catch((error) => {
    console.error(error);
  });

