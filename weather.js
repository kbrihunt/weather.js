//----- Modules -----
const express       = require('express');
const path          = require('path');
const mongoose      = require('mongoose');
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');     //módulo de cookies.
const session       = require('express-session');   //módulo de sesiones.
const https         = require('https');
const fs            = require('fs');
var stringify       = require('json-stringify-safe');
const favicon       = require('express-favicon');

//----- Meine Modules -----
// const rsps_datas = require('./config/rsps.js');
const RSP0  = require('./models/rsp0_data'); //MODEL
const RSP1  = require('./models/rsp1_data'); //MODEL
const RSP2  = require('./models/rsp2_data'); //MODEL
const RSP3  = require('./models/rsp3_data'); //MODEL
const rsp   = require('./config/rsps');



//----- Variables -----
const app = express();

const httpsOptions = {
    cert:   fs.readFileSync(path.join(__dirname, 'ssl', 'server_cert.pem')),
    key:    fs.readFileSync(path.join(__dirname, 'ssl', 'server_key.pem')) 
}
// const address = '192.168.0.15';
const port    =  process.env.PORT || 3000;
var server  = https.createServer(httpsOptions, app);
var io = require('socket.io')(server); 


//---- LOCALS. -----
app.locals.menuLogout = false;
app.locals.Db;
app.locals.valid = false;

//----- Connect to the DB -----
mongoose.connect('mongodb+srv://kbrihunt:6HP7WEB9NTpqpM3@emaweather-a05px.mongodb.net/weaher-mongo?retryWrites=true')
    .then(db => {
        console.log('Db connected')
        Db = db;
    })
    .catch(err => console.log(err));

     
//----- Settings -----
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//----- Middleware -----
app.use(favicon(__dirname + '/public/favicon.png'));

app.use(cookieParser('MySecretSessionToken'));
app.use(session({
    secret: 'MySecretSessionToken',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 3600000,
    }
}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

//----- Importing Routes -----
const Routes = require('./routes/route');

//----- Routes -----
app.use('/', Routes); //VOLVER A REVISAR



app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});



io.on('connection', function(socket){
    console.log('a user connected');
    // socket.on('rsp0-temp-new-data', async (cant) => {
    //     var newData = [];
    //     try {
    //         newData = await RSP0.find({}, 'time temp', function (err, result) {
    //             if (err) {throw err}
    //             result.circularRef = result;
    //             result.list = [result, result];
    //             newData = stringify(result, null, 2);
    //             console.log(typeof(newData));
    //             console.log(newData);
    //             socket.emit('sending-temp-data', newData);
    //         }).limit(cant).sort({_id: -1});
    //     } catch (error) {
    //         throw error
    //     }   
    // });

    // socket.on('rsp0-hum-new-data', async (cant) => {
    //     var newData = [];
    //     try {
    //         newData = await RSP0.find({}, 'time hum', function (err, result) {
    //             if (err) {throw err}
    //             result.circularRef = result;
    //             result.list = [result, result];
    //             newData = stringify(result, null, 2);
    //             console.log(typeof(newData));
    //             console.log(newData);
    //             socket.emit('sending-hum-data', newData);
    //         }).limit(cant).sort({_id: -1});
    //     } catch (error) {
    //         throw error
    //     }   
    // });

    // socket.on('rsp0-press-new-data', async (cant) => {
    //     var newData = [];
    //     try {
    //         newData = await RSP0.find({}, 'time press', function (err, result) {
    //             if (err) {throw err}
    //             result.circularRef = result;
    //             result.list = [result, result];
    //             newData = stringify(result, null, 2);
    //             console.log(typeof(newData));
    //             console.log(newData);
    //             socket.emit('sending-press-data', newData);
    //         }).limit(cant).sort({_id: -1});
    //     } catch (error) {
    //         throw error
    //     }   
    // });

    // /* ------------------------------------------------------------------------------------------ */
    // socket.on('rsp1-temp-new-data', async (cant) => {
    //     var newData = [];
    //     try {
    //         newData = await RSP1.find({}, 'time temp', function (err, result) {
    //             if (err) {throw err}
    //             result.circularRef = result;
    //             result.list = [result, result];
    //             newData = stringify(result, null, 2);
    //             console.log(typeof(newData));
    //             console.log(newData);
    //             socket.emit('sending-temp-data', newData);
    //         }).limit(cant).sort({_id: -1});
    //     } catch (error) {
    //         throw error
    //     }   
    // });

    // socket.on('rsp1-hum-new-data', async (cant) => {
    //     var newData = [];
    //     try {
    //         newData = await RSP1.find({}, 'time hum', function (err, result) {
    //             if (err) {throw err}
    //             result.circularRef = result;
    //             result.list = [result, result];
    //             newData = stringify(result, null, 2);
    //             console.log(typeof(newData));
    //             console.log(newData);
    //             socket.emit('sending-hum-data', newData);
    //         }).limit(cant).sort({_id: -1});
    //     } catch (error) {
    //         throw error
    //     }   
    // });

    // socket.on('rsp1-press-new-data', async (cant) => {
    //     var newData = [];
    //     try {
    //         newData = await RSP1.find({}, 'time press', function (err, result) {
    //             if (err) {throw err}
    //             result.circularRef = result;
    //             result.list = [result, result];
    //             newData = stringify(result, null, 2);
    //             console.log(typeof(newData));
    //             console.log(newData);
    //             socket.emit('sending-press-data', newData);
    //         }).limit(cant).sort({_id: -1});
    //     } catch (error) {
    //         throw error
    //     }   
    // });

    //  /* ------------------------------------------------------------------------------------------ */
    //  socket.on('rsp2-temp-new-data', async (cant) => {
    //     var newData = [];
    //     try {
    //         newData = await RSP2.find({}, 'time temp', function (err, result) {
    //             if (err) {throw err}
    //             result.circularRef = result;
    //             result.list = [result, result];
    //             newData = stringify(result, null, 2);
    //             console.log(typeof(newData));
    //             console.log(newData);
    //             socket.emit('sending-temp-data', newData);
    //         }).limit(cant).sort({_id: -1});
    //     } catch (error) {
    //         throw error
    //     }   
    // });

    // socket.on('rsp2-hum-new-data', async (cant) => {
    //     var newData = [];
    //     try {
    //         newData = await RSP2.find({}, 'time hum', function (err, result) {
    //             if (err) {throw err}
    //             result.circularRef = result;
    //             result.list = [result, result];
    //             newData = stringify(result, null, 2);
    //             console.log(typeof(newData));
    //             console.log(newData);
    //             socket.emit('sending-hum-data', newData);
    //         }).limit(cant).sort({_id: -1});
    //     } catch (error) {
    //         throw error
    //     }   
    // });

    // socket.on('rsp2-press-new-data', async (cant) => {
    //     var newData = [];
    //     try {
    //         newData = await RSP2.find({}, 'time press', function (err, result) {
    //             if (err) {throw err}
    //             result.circularRef = result;
    //             result.list = [result, result];
    //             newData = stringify(result, null, 2);
    //             console.log(typeof(newData));
    //             console.log(newData);
    //             socket.emit('sending-press-data', newData);
    //         }).limit(cant).sort({_id: -1});
    //     } catch (error) {
    //         throw error
    //     }   
    // });

    /* ------------------------------------------------------------------------------------------ */
    socket.on('rsp0query', async(fromDate, toDate, fromTime, toTime, ascDesc)=>{
        var newData = [];
        try {
            newData = await RSP0.find({
                date: {$gte: fromDate, $lte: toDate},
                time: {$gte: fromTime, $lte: toTime},
            }).sort({_id: ascDesc}).exec(
                function (err, result) {
                    if (err) {throw err}
                    result.circularRef = result;
                    result.list = [result, result];
                    newData = stringify(result, null, 2);
                    console.log(typeof(newData));
                    console.log(newData);
                    socket.emit('rsp0query-response', newData);
                });
        } catch (error) {
            throw error
        }   
        
    });

    socket.on('rsp1query', async(fromDate, toDate, fromTime, toTime, ascDesc)=>{
        var newData = [];
        try {
            newData = await RSP1.find({
                date: {$gte: fromDate, $lte: toDate},
                time: {$gte: fromTime, $lte: toTime},
            }).sort({_id: ascDesc}).exec(
                function (err, result) {
                    if (err) {throw err}
                    result.circularRef = result;
                    result.list = [result, result];
                    newData = stringify(result, null, 2);
                    console.log(typeof(newData));
                    console.log(newData);
                    socket.emit('rsp1query-response', newData);
                });
        } catch (error) {
            throw error
        }   
        
    });

    socket.on('rsp2query', async(fromDate, toDate, fromTime, toTime, ascDesc)=>{
        var newData = [];
        try {
            newData = await RSP2.find({
                date: {$gte: fromDate, $lte: toDate},
                time: {$gte: fromTime, $lte: toTime},
            }).sort({_id: ascDesc}).exec(
                function (err, result) {
                    if (err) {throw err}
                    result.circularRef = result;
                    result.list = [result, result];
                    newData = stringify(result, null, 2);
                    console.log(typeof(newData));
                    console.log(newData);
                    socket.emit('rsp2query-response', newData);
                });
        } catch (error) {
            throw error
        }   
        
    });

    socket.on('rsp3', async (fromDate, toDate) => {
        var newData = [];
        console.log(fromDate);
        console.log('type of fromDate: ' + typeof(fromDate) );
        console.log(toDate);
        console.log('type of toDate: ' + typeof(toDate));
        
        try {
            newData = await RSP3.find({
                date: {$gte: fromDate, $lte: toDate}
            }, function (err, result) {
                if (err) {throw err}
                result.circularRef = result;
                result.list = [result, result];
                newData = stringify(result, null, 2);
                console.log(newData);
                socket.emit('respuesta', newData);
            });
        } catch (error) {
            throw error
        }   
    });

    socket.on('actual-data', async () => {
        var newData = [];
    
        try {
            newData = await RSP3.find({}, function (err, result) {
                if (err) {throw err}
                result.circularRef = result;
                result.list = [result, result];
                newData = stringify(result, null, 2);
                console.log(newData);
                socket.emit('actual-data-response', newData);
            }).limit(1).sort({_id: -1});
        } catch (error) {
            throw error
        }   
    });


    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

});

    

// ----- Server on ------
// app.listen(app.get('port'), function () {
//     console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
// });


// io.on('connection', function(socket){
//     console.log('a user connected');
//     socket.on('disconnect', function () {
//         console.log('user disconnected');
//     });
// });


server.listen(port,function () {
    console.log('Express started on https://'+ port + '; press Ctrl-C to terminate.')
});



