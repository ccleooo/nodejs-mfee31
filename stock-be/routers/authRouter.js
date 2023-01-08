const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../utils/db');

const argon2 = require('argon2');

// app.use((req, res, next) => {...})

router.use((req, res, next) => {
  console.log('這裡是 auth router 的中間件');
  next();
});

// 要處理 content-type 是 multipart/form-data
// express 沒有內建，需要另外用套件
// 這邊用第三方套件 multer 來處理
const multer = require('multer');
const path = require('path');
// 設定圖片存哪裡: 位置跟名稱
const storage = multer.diskStorage({
  // 設定儲存的目的地 -> 檔案夾
  // 先手動建立好檔案夾 public/uploads
  destination: function (req, file, cb) {
    // path.join: 避免不同的作業系統之間 / 或 \
    // __dirname 目前檔案所在的目錄路徑
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  // 圖片名稱
  filename: function (req, file, cb) {
    console.log('multer storage', file);
    // {
    //   fieldname: 'photo',
    //   originalname: 'AI-replace.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg'
    // }
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
    // uuid https://www.npmjs.com/package/uuid
  },
});
// 真正在處理上傳
const uploader = multer({
  storage: storage,
  // 圖片格式的 validation
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
      cb(new Error('上傳圖片格式不合法'), false);
    } else {
      cb(null, true);
    }
  },
  // 限制檔案的大小
  limits: {
    // 1k = 1024 => 200k 200x1024
    fileSize: 200 * 1024, // 204800
  },
});

// 驗證資料 validation -> 因為後端不可以相信來自前端的資料
const registerRules = [
  // 中間件: 負責檢查 email 是否合法
  body('email').isEmail().withMessage('請輸入正確格式的 Email'),
  // 中間件: 檢查密碼的長度
  body('password').isLength({ min: 8 }).withMessage('密碼長度至少為 8'),
  // 中間件: 檢查 password 跟 confirmPassword 是否一致
  // 客製自己想要的檢查條件
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('驗證密碼不符合'),
];

// /api/auth
router.post('/register', uploader.single('photo'), registerRules, async (req, res, next) => {
  console.log('I am register', req.body);

  // TODO: async/await 應該要有 try-catch 去做錯誤處理

  // 處理驗證的結果
  const validateResult = validationResult(req);
  console.log(validateResult);
  if (!validateResult.isEmpty()) {
    // validateResult 不是空的 -> 表示有錯誤
    return res.status(400).json({ errors: validateResult.array() });
    // early return
  }

  // 驗證通過
  // 檢查 email 是否已經註冊過
  let [members] = await pool.execute('SELECT * FROM members WHERE email = ?', [req.body.email]);
  if (members.length > 0) {
    // 表示這個 email 有存在資料庫中
    // 如果已經註冊過，就回覆 400
    return res.status(400).json({
      errors: [
        {
          msg: 'email 已經註冊過',
          param: 'email',
        },
      ],
    });
  }

  // --> 這個 email 不存在於資料庫中

  // 雜湊 hash 密碼
  const hashedPassword = await argon2.hash(req.body.password);

  // 存到資料庫
  let result = await pool.execute('INSERT INTO members (email, password, name) VALUES (?, ?, ?);', [req.body.email, hashedPassword, req.body.name]);
  console.log('register: insert to db', result);

  // 回覆給前端
  res.json({
    email: req.body.email,
    member_id: result[0].insertId,
  });
});

module.exports = router;