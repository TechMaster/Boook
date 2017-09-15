const express = require('express');
const app = express();
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const request = require("request");
const session = require('express-session');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const _ = require("lodash");
const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const UserDB = [
    {
        id: 1,
        username: 'thanhdat1',
        password: '1'
    },
    {
        id: 2,
        username: 'thanhdat2',
        password: '11'
    },
    {
        id: 3,
        username: 'thanhdat3',
        password: '111'
    },
    {
        id: 4,
        username: 'thanhdat4',
        password: '1111'
    }
];

app.use(session({
    cookie: {maxAge: (3600 * 1000)},
    unser: 'destroy',
    secret: 'JackCodeHammer',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'tasmanianDevil',
    issuer: 'http://localhost:3000'
};

const strategy = new JwtStrategy({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),secretOrKey: 'tasmanianDevil'}, (jwt_payload, next) => {
    console.log('payload received', jwt_payload);
    const user = UserDB[_.findIndex(users, {id: jwt_payload.id})];
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});


// app.use((req, res, next) => {
//     // req.session.login = false;
//     console.log(req.session)
//     next();
// });

passport.use(strategy);
app.use(passport.initialize());

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});



// const cors = require('cors');
// app.use(cors());


app.get('/', (req, res) => {
    res.json({msg: 'home'})
});

//Hàm này yêu cầu bảo mật, có một middle ware đứng giữa là passport.authenticate
//Session = false để lần nào request cũng phải authenticate chứ không kiểm tra user có trong session
app.get('/api/users', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(UserDB)
});

app.get('/api/userbyid/:id', (req, res) => {
    res.json(UserDB.find(user => user.id == req.params.id) || '')
});




app.post("/api/register", (req, res) => {
    let username = req.body.username || '';
    let password = req.body.password || '';
    if (username && password) {
        let checkUser = UserDB.find(user => user.username == username)
        if(checkUser){
            res.json({msgErr: 'Username đã được đăng ký.'})
        }else{
            let obj = {
                id: shortid.generate(),
                username,
                password
            };
            UserDB.push(obj)
            res.json({msg: 'Đăng ký thành công.'})
        }
    } else {
        res.json({msgErr: 'Không được bỏ trống.'})
    }
});

app.post("/api/login", (req, res) => {
    let username = req.body.username || '';
    let password = req.body.password || '';

    if (username && password) {

        let checkUser = UserDB.find(user => user.username == username);
        if(checkUser) {
            if(checkUser.password === password){
                let payload = {id: checkUser.id};

                const options = {
                  issuer: 'http://localhost:3000',
                  subject: 'secret micro service',
                  expiresIn: 500 //Expire in 20 seconds
                };
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
            }else{
                res.json({msgErr: 'Mật khẩu không đúng.'})
            }
        }else{
            res.json({msgErr: 'Username không tồn tại.'})
        }
    } else {
        res.json({msgErr: 'Không được bỏ trống.'})
    }
});

const server = app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
