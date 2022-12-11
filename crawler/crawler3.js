// readfile 版本

const fs = require('fs');
const axios = require('axios');

let p = new Promise((resolve, reject) => {
  fs.readFile('stock.txt', 'utf-8', (err, data) => {
      if(err){
          reject(err);
      }else{
          resolve(data);
      }
  });
});

(async () => {
  try{
    let stockNo = await p;
    let date = '20221211';

    let response = await axios.get(`http://54.71.133.152:3000/stocks`,{
      params: {
        stockNo,
        date,
      },
    });

    console.log('await', response.data);
  }catch(e){
    console.error(e);
  }
}) ();






