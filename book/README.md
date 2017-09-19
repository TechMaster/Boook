# UI layer riêng biệt:
* book.com (Nunjucks, Express)
  * Liệt kê books, liệt kê theo category, author
  * Tìm kiếm 
  * Đăng kí/ đăng nhập
  * Có thể tải sau khi đăng nhập
  * Sẽ có chỗ *write your own book* -> click vào chuyển sang write.book.com
* admin.book.com (Nuxt, Express)
  * quản lý tất cả sách: trỏ vào book service
  * quản lý users (thêm quyền, chỉnh sửa thông tin): trỏ vào user service
  * payroll: tính toán lượt tải sách, tính profit của author
* write.book.com (Vuejs, Express)
  * Đăng kí tài khoản là có thể viết sách
  * Cứ bắt đầu viết nháp là thành author (có thể có cột author trong bảng user để phân biệt hoặc cập nhật vào subset author table trong book service)
  * Xuất bản thì cập nhật vào bảng book

# Backend: xây dựng các services riêng biệt
Các ứng dụng sẽ trỏ đến các services cần thiết khác nhau. Tất cả các services là API trả về json

Dự kiến các services và dbs
## Web services (các app trên)

## User service: 
* User service xử lý xác thực, phân quyền người dùng (JWT), sử dụng CSDL riêng là user-db
* Ở các trang web services, người dùng log in/ log out thì những requests này sẽ gửi qua axios đến user service để xử lý và trả về kết quả cho web services
* Sử dụng JWT, mỗi lần sẽ trả về 1 token và user có thể lưu token này vào localStorage, sau đó requests từ user này đều cần gắn token này trong req.header để xác thực 

## Book service:
* Book service lưu trữ và trả về dữ liệu liên quan đến book
* Các hành động CRUD đều là requests gửi về service này xử lý. Ví dụ, book.com liệt kê các sách sẽ gửi GET request, hay write.book.com tạo và xuất bản sách sẽ là POST request.
* Book db: 
  * book
  * category
  * draft_book
  * author (maybe)
* Trong bảng book lưu author\_id (id này cũng chính là user\_id trong user db).    * Thử nghiệm lưu author_id nếu muốn lấy author data thì thêm 1 request vào user service. Làm sao để đánh giá tốc độ? 
  * Thử nghiệm subset của user db đc lưu trong book db. Cách đồng bộ và cập nhật dữ liệu? 

## Todo: 15/09
* Vẽ book-db
* Tạo book-service: theo movie-service
* front-end: vue

## Cấu trúc:

| Name             | Service | Container | Tech                 |
|------------------|---------|-----------|----------------------|
| Book.com         | Web 1   | web 1     | Nunjucks, Express    |
| Admin.book.com   | Web 2   | web 2     | Nuxt                 |
| Book.com         | Web 3   | web 3     | Vuejs, Vue-router    |
| Book API         | Books   | books     | Node, Express        |
| Book DB          | Books   | books-db  | Postgres             |
| Users API        | Users   | users     | Node, Express        |
| Users DB         | Users   | users-db  | Postgres             |

## 17/09:
* Tạo book service: 
* test API với in memory database `db/fake-model.js`, chạy test file `mocha book.fake.js`
* dùng knex để tạo và kết nối db: `book-model.js`

## 18/09:
* Kết nối sang user service lấy author data

## 19/09: 
```bash
.
├── package.json
├── package-lock.json
├── src
│   ├── app.js
│   ├── db
│   │   └── fake-model.js
│   ├── routes
│   │   ├── book.js
│   │   ├── _fakehelpers.js
│   │   └── _helpers.js
│   └── server.js
└── tests
    ├── book.fake.js
    └── index.spec.js

6 directories, 16 files

```

* Folder `src` chứa source codes: 
  * `app.js` cấu hình và khởi tạo express server
  * `server.js` chạy server
  * `routes` chứa các files cấu hình routes và hàm phụ trợ trong xử lý routes
     * `book.js` khai báo các routes. Router này được gọi lại và sử dụng trong `app.js`
     ```js
      const routes = require('./routes/book');
      app.use('/api', routes);
      // => 1 route sẽ có dạng 'http://localhost:3000/api/ping'
     ```
     * Một số routes là *secure routes* yêu cầu user đăng nhập mới thực thi, ví dụ, phải có log in mới đc tạo sách mới. Những routes này sử dụng 1 hàm kiểm tra `routeHelpers.ensureAuthenticated` 
     * `_fakehelpers.js` chứa hàm `ensureAuthenticated` giả để kiểm thử local (không cần kết nối với user service)
     * `_helpers.js` chứa hàm thật gọi sang user service để xác thực
  * `db` chứa các files cấu hình, khởi tạo và truy xuất CSDL
    * `fake-model.js` dựng CSDL in memory giả để kiểm thử
    * CSDL Postgresql gồm các files còn lại. Kết nối sử dụng ORM Knex

### Xây dựng Book Service với CSDL giả in memory 

#### In-memory DB: `fake-model.js`:
* BookDB và CategoryDB lưu dạng arrays chứa objects
* Các hàm CRUD ví dụ `getAll`, `getBookByAlias`, `createBook`,...

#### `Routes/book.js`

#### Test Routes: 
* `tests/book.fake.js` chạy các hàm kiểm thử routes sử dụng CSDL giả `fake-model`
* Chạy tests:
```bash
$ cd tests
$ mocha book.fake.js
// hoặc chạy tất cả các file tests
$ npm test
```
* Nếu không kết nối với user service trong `routes/book.js` sử dụng `_fakehelpers.js` để xác thực người dùng
```js
// ./routes/book.js
// connect to db
const bookModel = require('../db/fake-model');
// authentication helper functions
const routeHelpers = require('./_fakehelpers');
```
* Nếu có user service, mở user service và sử dụng `_helpers.js` để gọi sang user service xác thực
  * Request của user trong phần header cần chứ JWT token đc cấp khi đăng nhập
  * Hàm `ensureAuthenticated` kiểm tra headers có chứa token và username không -> Có thì gọi sang user service (user service chạy port 3003) 
  ```js
    const request = require('request-promise');
    let userURL = 'http://localhost:3003'
    let ensureAuthenticated = (req, res, next) => {
      if (!(req.headers && req.headers.authorization)) {
        return res.status(400).json({
          status: 'Please log in'
        });
      }
      let username = req.headers.username;
      // call users-service to authenticate and get user info
      const options = {
        method: 'GET',
        uri: `${userURL}/api/userbyusername/${username}`,
        json: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${req.headers.authorization.split(' ')[1]}`,
        },
      };
      return request(options)
        .then((response) => {
          // response is user data received from users-service
          req.user_id = response.id;
          return next();
        })
        .catch((err) => {
          return next(err);
        });
    };

  ```
  * Gửi request `/api/userbyusername/:username` để lấy lại user data để trả về cho hàm xử lý route của book service. User service xác thực token là user đăng nhập & trả về user_id. Sau đó book service gọi hàm xử lý trong model.
  * Ví dụ gửi 1 DELETE request *Delete a book* vào `/api/book/:id` của book service. Sau khi user service xác thực và gửi lại user\_id, book service truyền req.user_id này vào hàm `deleteBook` của `fake-model`. 
  * `deleteBook` tiếp tục kiểm tra nếu đúng là author thì cho phép delete không thì báo lỗi ``new Error('not the book author')`
  ```js
  /**
   * Delete a book (authenticate that an user is logged in)
   */
  router.delete('/books/:id', routeHelpers.ensureAuthenticated, (req, res, next) => {
    // receive user_id from users service
    return bookModel.deleteBook(req.user_id, req.params.id).then(data => {
      res.status(200).json({
        status: 'success',
        data: data
      })
    }).catch(err => {
      console.log(err);
      return next(err);
    })
  })
  ```

