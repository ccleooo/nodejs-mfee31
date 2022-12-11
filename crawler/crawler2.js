// 1. 安裝
// 2. 引用
// 3. 去讀官方文件
// http://54.71.133.152:3000/stocks?stockNo=2618&date=202211


const axios = require('axios');

// await 寫法

(async () => {
  try{
    let response = await axios.get('http://54.71.133.152:3000/stocks?stockNo=2618&date=202211');
    console.log(response.data);
  }catch(e){
    console.error('錯誤', e);

  }
}) ();



