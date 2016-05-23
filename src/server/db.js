var path = require( 'path' ),
    express = require( 'express' ),
    mongojs = require( 'mongojs' ),
    cors = require( 'cors' );


var app = express(),
    database = 'http://127.0.0.1:51076/configTool',
    //db = mongojs( database ),
    //collection = db.collection( 'metadata_types' ),
    application_root = __dirname;

var mdb = mongojs('localhost:27017/configTool', ['metadata_types']);
//db.connect(database, collections);
app.use(cors({origin: 'http://localhost:8080'}));
app.listen( 8880 );

app.get('/getMetadataTypes', function (req, res) {

    mdb.metadata_types.find(function (err, docs) {

        res.send(docs);
        // docs is an array of all the documents in mycollection
    });

});

