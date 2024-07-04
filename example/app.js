const express = require('express');
const app = express();
const PORT = 8081;

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static('public'))

var Paymentwall = require('../index');

Paymentwall.Configure(
    Paymentwall.Base.API_GOODS,
    'appKey',
    'secretKey'
);



app.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname})
})

app.get('/brick/en/translations.json', function (req, res) {
    res.sendFile('brick/en/translations.json', {root: __dirname})
})

app.post('/api/pay', function (req, res) {
    const data = req.body;
    let extraParams = {
        'customer[firstname]': data.firstname,
        'customer[lastname]': data.lastname,
        'customer[zip]': '1000'
    };

    // append 3DS data
    if (data.hasOwnProperty('brick_charge_id') && data.hasOwnProperty('brick_secure_token')) {
        extraParams = Object.assign(extraParams, {
            charge_id: data.brick_charge_id,
            secure_token: data.brick_secure_token,
        })
    }

    var charge = new Paymentwall.Charge(
        0.5,                                 //price
        'USD',                               //currency code
        'description',                       //description of the product
        data.email,             // user's email which can be gotten by req.body.email
        data.brick_fingerprint,                       // fingerprint which can be gotten by req.body.brick_fingerprint
        data.brick_token,                      //one-time token
        extraParams  //custom parameters
    );

    charge.createCharge(function(brick_response){
        // brick_response is a new Response Object Entity (defined in paymentwall/lib/Response/Abstract)
        if(brick_response.isSuccessful()){
            if(brick_response.isCaptured()){
                //deliver goods to user
            } else if(brick_response.isUnderReview()){
                //under risk review
            }
        } else{
            const error_code = brick_response.getErrorCode();         //handle error
            const error_details = brick_response.getErrorDetails();
        }
        res.json(brick_response.getBrickResponse())
    });
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});