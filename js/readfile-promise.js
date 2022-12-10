const fs = require('fs');

// Promise 是一個表示非同步運算的最終完成或失敗的物件。
let p = new Promise((resolve, reject) => {
    fs.readFile('test.txt', 'utf-8', (err, data) => {
        if(err){
            reject(err);
        }else{
            resolve(data);
        }
    });
})

// console.log(p); // Promise 物件 <pending>

//是真正用的人
p.then((data) => {
    console.log('我是then', data);
  }).catch((error) => {
    console.error('我是catch', error);
  });

