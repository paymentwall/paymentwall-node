# About Paymentwall
[Paymentwall](http://paymentwall.com/?source=gh-node) is the leading digital payments platform for globally monetizing digital goods and services. Paymentwall assists game publishers, dating sites, rewards sites, SaaS companies and many other verticals to monetize their digital content and services. 
Merchants can plugin Paymentwall's API to accept payments from over 100 different methods including credit cards, debit cards, bank transfers, SMS/Mobile payments, prepaid cards, eWallets, landline payments and others. 

To sign up for a Paymentwall Merchant Account, [click here](http://paymentwall.com/signup/merchant?source=gh-node).

# Paymentwall Node.js Library
This library allows developers to use [Paymentwall APIs](http://paymentwall.com/en/documentation/API-Documentation/722?source=gh-node) (Virtual Currency, Digital Goods featuring recurring billing, and Virtual Cart).

To use Paymentwall, all you need to do is to sign up for a Paymentwall Merchant Account so you can setup an Application designed for your site.
To open your merchant account and set up an application, you can [sign up here](http://paymentwall.com/signup/merchant?source=gh-node).

# Installation
To install the library in your environment, simply run the following command:

```
npm install paymentwall
```

Then use a code sample below.

# Code Samples

## Digital Goods API

[Web API details](http://www.paymentwall.com/en/documentation/Digital-Goods-API/710#paymentwall_widget_call_flexible_widget_call)

#### Initializing Paymentwall

```javascript
var Paymentwall = require('paymentwall');
Paymentwall.Configure(
  Paymentwall.Base.API_GOODS,
  'YOUR_APPLICATION_KEY',
  'YOUR_SECRET_KEY'
);
```

#### Widget Call

The widget is a payment page hosted by Paymentwall that embeds the entire payment flow: selecting the payment method, completing the billing details, and providing customer support via the Help section. You can redirect the users to this page or embed it via iframe. The sample code below renders an iframe with Paymentwall Widget.

```javascript
var widget = new Paymentwall.Widget(
  'user40012',                                // id of the end-user who's making the payment
  'pw',                                       // widget code, e.g. pw; can be picked in the Widgets section of your merchant account 
  [                                           // product details for Flexible Widget Call. 
                                              // Leave empty if product selection happens on Paymentwall's side
    new Paymentwall.Product(
      'product301',                           // id of the product in your system  
      9.99,                                   // price
      'USD',                                  // currency code
      'Gold Membership',                      // product name
      // if it is a onetime charge product, you don't need to configure time-based part
      Paymentwall.Product.TYPE_SUBSCRIPTION,  // this is a time-based product
      1,                                      // length of product period
      Paymentwall.Product.PERIOD_TYPE_MONTH,  // type of product period
      true                                    // this is a recurring product
    )
  ],
  {'email': 'user@hostname.com'}              // additional parameters. for full list check API docs
);
console.log(widget.getHtmlCode());
```

#### Pingback Processing

The Pingback is a webhook notifying about a payment being made. Pingbacks are sent via HTTP/HTTPS to your servers. To process pingbacks use the following code:

```javascript
var pingback = new Paymentwall.Pingback("query data in pingback request", "ip address of pingback");
if (pingback.validate()) {
  var productId = pingback.getProduct().getId();
  if (pingback.isDeliverable()) {
    // deliver the product
  } else if (pingback.isCancelable()) {
    // withdraw the product
  } 
  console.log('OK'); // Paymentwall expects the string OK in response, otherwise the pingback will be resent
} else {
  console.log(pingback.getErrorSummary());
}
```

## Virtual Currency API

[Web API Details](https://www.paymentwall.com/en/documentation/Virtual-Currency-API/711)

#### Initializing Paymentwall

```javascript
var Paymentwall = require('paymentwall');
Paymentwall.Configure(
  Paymentwall.Base.API_VC,
  'YOUR_APPLICATION_KEY',
  'YOUR_SECRET_KEY'
);
```

#### Widget Call

```javascript
var widget = new Paymentwall.Widget(
  'user40012',
  'p10',
  [],
  {'email': 'user@hostname.com'}
);
console.log(widget.getHtmlCode());
```

#### Pingback Processing

```javascript
var pingback = new Paymentwall.Pingback("query data in pingback request", "ip address of pingback");
if (pingback.validate()) {
  var virtualCurrency = pingback.getVirtualCurrencyAmount();
  if (pingback.isDeliverable()) {
    // deliver the virtual currency
  } else if (pingback.isCancelable()) {
    // withdraw the virtual currency
  } 
  console.log('OK'); // Paymentwall expects the string OK in response, otherwise the pingback will be resent
} else {
  console.log(pingback.getErrorSummary());
}
```

## Cart API

[Web API Details](https://www.paymentwall.com/en/documentation/Shopping-Cart-API/1098)

#### Initializing Paymentwall

```javascript
var Paymentwall = require('paymentwall');
Paymentwall.Configure(
  Paymentwall.Base.API_CART,
  'YOUR_APPLICATION_KEY',
  'YOUR_SECRET_KEY'
);
```

#### Widget Call

```javascript
var widget = new Paymentwall.Widget(
  'user40012',
  'p10',
  [
    new Paymentwall.Product('product301', 3.33, 'EUR'), // first product in cart
    new Paymentwall.Product('product607', 7.77, 'EUR')  // second product in cart
  ],
  {'email': 'user@hostname.com'}
);
console.log(widget.getHtmlCode());
```

#### Pingback Processing

```javascript
var pingback = new Paymentwall.Pingback("query data in pingback request", "ip address of pingback");
if (pingback.validate()) {
  var productId = pingback.getProduct().getId();
  if (pingback.isDeliverable()) {
    // deliver the product
  } else if (pingback.isCancelable()) {
    // withdraw the product
  } 
  console.log('OK'); // Paymentwall expects the string OK in response, otherwise the pingback will be resent
} else {
  console.log(pingback.getErrorSummary());
}
```
## Brick API

[Web API details](https://www.paymentwall.com/en/documentation/Brick/2968)

#### Initializing Paymentwall

```javascript
var Paymentwall = require('paymentwall');
Paymentwall.Configure(
  Paymentwall.Base.API_GOODS,
  'YOUR_APPLICATION_KEY',
  'YOUR_SECRET_KEY'
);
```

#### Create a one-time token

```javascript
var onetimetoken = new Paymentwall.Onetimetoken(
  4000000000000002, // Card number, digits only
  01,               // Expiration month, 2 digits from 01 to 12
  2017,             // Expiration year, 4 digits
  222               // CVC/CVV, 3-4 digits
);

onetimetoken.createOnetimetoken(function(response){
  // response is a new Response Object Entity (defined in paymentwall/lib/Response/Abstract)
  if(response.isSuccessful()){
    if(response.isActivated()){
      token = response.getOnetimeToken();         //get onetimetoken
      card = response.getCardInfo();              //get card information    
    }
  } else{
    error_code = response.getErrorCode();
    error_details = response.getErrorDetails();
  };
  console.log(response.getFullResponse());
});
```

#### Charge

```javascript
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
```

#### Charge Details

```javascript
//get the charge details through chargeid
var charge = new Paymentwall.Charge();
charge.otherOperation(chargeid,'detail',function(brick_response){
  // brick_response is a new Response Object Entity (defined in paymentwall/lib/Response/Abstract)
  brick_response.getFullResponse();                      // get full response content in String format
  brick_response.getFullResponse('JSON');                // get full response content in JSON format
});
```

#### Charge-capture

```javascript
//capture a charge through chargeid
var charge = new Paymentwall.Charge();
charge.otherOperation(chargeid,'capture',function(brick_response){
  // brick_response is a new Response Object Entity (defined in paymentwall/lib/Response/Abstract)
  brick_response.getFullResponse();                      // get full response content in String format
  brick_response.getFullResponse('JSON');                // get full response content in JSON format
});
```

#### Charge-void

```javascript
//void a charge through chargeid
var charge = new Paymentwall.Charge();
charge.otherOperation(chargeid,'void',function(brick_response){
  // response is a new Response Object Entity (defined in paymentwall/lib/Response/Abstract)
  brick_response.getFullResponse();                     // get full response content in String format
  brick_response.getFullResponse('JSON');               // get full response content in JSON format
});
```

#### Charge-refund

```javascript
//refund a charge through chargeid
var charge = new Paymentwall.Charge();
charge.otherOperation(chargeid,'refund',function(brick_response){
  // response is a new Response Object Entity (defined in paymentwall/lib/Response/Abstract)
  brick_response.getFullResponse();                      // get full response content in String format
  brick_response.getFullResponse('JSON');                // get full response content in JSON format
});
```

#### Subscription

```javascript
//create a subscription
var subscription = new Paymentwall.Subscription(
  0.5,                                 //price
  'USD',                               //currency code
  'description',                       //description of the product
  'useremail@example.com',             // user's email which can be gotten by req.body.email
  'fingerprint',                       // fingerprint which can be gotten by req.body.brick_fingerprint
  'onetimetoken',                      //one-time token
  'day',                               // day/week/month/year
  3,                                   // duration
  {
    // parameters for trial period
    'trial[amount]':0.5,
    'trial[currency]':'USD',
    'trial[period]':'day',
    'trial[period_duration]':3
  },
  {'custom[User_prfile_API]':'Value'}  //custom parameters, if there is a trail, plan is required
);

subscription.createSubscription(function(brick_response){
  // brick_response is a new Response Object Entity (defined in paymentwall/lib/Response/Abstract)
  if(brick_response.isSuccessful()){
    if(brick_response.isActivated()&&brick_response.isStarted()){
      subscription_id = getSubscriptionId();
      charge_id = brick_response.getChargeId();         //deliver goods to user
    } else if(brick_response.isUnderReview()){          
      subscription_id = getSubscriptionId();
      charge_id = brick_response.getChargeId();         //under risk review
    } else if(brick_response.isUnder3DSecure()){        
      return_page = brick_response.get3DHtml();             //return 3D secure page
    };
  } else{
    error_code = brick_response.getErrorCode();         //handle error
    error_details = brick_response.getErrorDetails();
  };

  brick_response.getFullResponse();                      // get full response content in String format
  brick_response.getFullResponse('JSON');                // get full response content in JSON format
});
```

#### Subscription-details

```javascript
//get the subscription details through subscriptionid
var subscription = new Paymentwall.Subscription();
subscription.otherOperation(subscriptionid,'detail',function(response){
  // response is a new Response Object Entity (defined in paymentwall/lib/Response/Abstract)
  response.getFullResponse();                      // get full response content in String format
  response.getFullResponse('JSON');                // get full response content in JSON format
});
```

#### Subscription-cancel

```javascript
//cancel a subscription through subscriptionid
var subscription = new Paymentwall.Subscription();
subscription.otherOperation(subscriptionid,'cancel',function(response){
  // response is a new Response Object Entity (defined in paymentwall/lib/Response/Abstract)
  response.getFullResponse();                      // get full response content in String format
  response.getFullResponse('JSON');                // get full response content in JSON format
});
```

#### Pingback Processing

The Pingback is a webhook notifying about a payment being made. Pingbacks are sent via HTTP/HTTPS to your servers. To process pingbacks use the following code:

```javascript
var pingback = new Paymentwall.Pingback("query data in pingback request", "ip address of pingback");
if (pingback.validate()) {
  var productId = pingback.getProduct().getId();
  if (pingback.isDeliverable()) {
    // deliver the product
  } else if (pingback.isCancelable()) {
    // withdraw the product
  } 
  console.log('OK'); // Paymentwall expects the string OK in response, otherwise the pingback will be resent
} else {
  console.log(pingback.getErrorSummary());
}
```

## Signature API

[Web API details](https://www.paymentwall.com/en/documentation/Signature-Calculation/2313)

#### Widget Signature

```javascript
var Paymentwall = require('paymentwall');
var widget_signature = Paymentwall.WidgetSignature.calculateSignature(parameters,secret_key, signature_version);
```

#### Pingback Signature

```javascript
var Paymentwall = require('paymentwall');
var pingback_signature = Paymentwall.PingbackSignature.calculateSignature(parameters,secret_key, signature_version);
```
