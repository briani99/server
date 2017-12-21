// ========================
// Packages and Files
// ========================
const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const dotenv      = require('dotenv');
const helmet      = require('helmet');

const User   = require('./models/User');
const tokens = require('./controller/auth/tokens');
// =======================
// Configuration & DB ====
// =======================
dotenv.load({ path: 'config.env' });
var port = process.env.PORT;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, {useMongoClient: true})
.then(
    () => { 
        console.log('The MongoDB is Connected ✓');
    },
    err => { 
        console.error(err);
        console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
        process.exit();
    }
);
// =======================
// Express ===============
// =======================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(helmet());
app.use(express.static(__dirname + '/public'));

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9000");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// =======================
// Controllers ===========
// =======================
const facebookController = require('./controller/auth/facebook');
const basicController = require('./controller/auth/basic');
const userController = require('./controller/user');

// =======================
// Routes ================
// =======================
app.options("*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    return res.status(200).send();
});

app.get('/', function(req, res) {
    res.send('Hello! The API is at working');
});


//app.get('/', function(req, res) {
//    res.render('/public/app.html');
//});


app.post('/auth/login', basicController.login);
app.post('/auth/signup', basicController.signup);

app.post('/facebook', facebookController.authenticate);

app.get('/secure/users', tokens.ensureAuthenticated, userController.users);
app.get('/secure/user:id', tokens.ensureAuthenticated, userController.userById);

// =======================
// Start the server ======
// =======================
app.listen(port, () => {
  console.log('App is running at http://localhost:%d  ✓', port);
  console.log('  Press CTRL-C to stop\n');
});