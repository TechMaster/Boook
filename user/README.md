# Cấu hình + sử dụng

### Cài đặt

```
npm i --save express-session
npm i --save jsonwebtoken
npm i --save passport
npm i --save passport-jwt
```

### Cấu hình

```javascript
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'tasmanianDevil',
    issuer: 'http://localhost:3000'
};
const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    console.log('payload received', jwt_payload);
    const user = users[_.findIndex(users, {id: jwt_payload.id})];
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
passport.use(strategy);
app.use(passport.initialize());
```

### Gửi từ host khác

Muốn host khác yêu cầu dữ liệu từ server thì cần phải có:
```javascript
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
```

### Tạo token khi đăng nhập thành công

```javascript
//Lấy id user
let payload = {id: checkUser.id};

const options = {
  issuer: 'http://localhost:3000',
  subject: 'secret micro service',
  expiresIn: 50 //Expire in 20 seconds
};
// jwtOptions.secretOrKey được lấy ở phần cấu hình
// Tạo ra token
jwt.sign(payload, jwtOptions.secretOrKey, options, (err, token) => {
    if (err) {
        res.status(401).json({msgErr: "Fail to generate jwt token"});
    } else {
        res.json({
            msg: 'ok',
            token
        });
    }
});
```



# User API

### Login

## `POST /api/login`

Tham số truyền vào:
```
{
    username,
    password
}
```

Trả về: 
```
{
    msg: 'ok',
    token,
}
```

## `POST /api/register`

Tham số truyền vào:
```
{
    username,
    password
}
```

Trả về:

```
{
    msg: 'Đăng ký thành công.'
}
```

## `GET /api/users`

Trả về:

```
{
    id,
    username,
    password
}
```

## `GET /api/userbyid/{{ id }}`

Trả về:

```
{
    id,
    username,
    password
}
```

## `GET /api/userbyusername/{{ username }}`

Trả về:

```
{
    id,
    username,
    password
}
```