var Paymentwall = require('./index');
Paymentwall.configure(
  Paymentwall.Base.API_GOODS,
  "t_33c1806e0daf60fc31f2167f0e4d59",
  "t_85c66c2d7461e8885805f92dfd171c"
);

// // get the token from callback and make a charge and a subscription
// var onetimetoken = new Paymentwall.Onetimetoken(
// 	4000000000000002,          // Card number, digits only
// 	01,         // Expiration month, 2 digits from 01 to 12
// 	2017,           // Expiration year, 4 digits
// 	222            // CVC/CVV, 3-4 digits
// );

// onetimetoken.createOnetimetoken(function(onetimetoken_response){
// 	// get the parameter in response
// 	console.log('onetimetoken='+onetimetoken_response.token);
// 	var token = onetimetoken_response.token;

// 	console.log(token);

// 	//create a charge
// 	var charge = new Paymentwall.Charge(
// 		0.5,
// 		'USD',
// 		'fan',
// 		'liufanhh@hotmail.com',
// 		123,
// 		token,
// 		{'custom[aad]':'aa'} //custom parameters
// 	);

// 	charge.createCharge(function(Charge_response){
// 	// get the parameter in response
// 	console.log('response of Charge ='+Charge_response);
// 	});

// 	//get the charge details
// 	var charge = new Paymentwall.Charge();

// 	charge.otherOperation(chargeid,'detail',function(data){
// 		console.log('detail'+data);
// 	});

// 	//capture a charge
// 	var charge = new Paymentwall.Charge();

// 	charge.otherOperation(chargeid,'capture',function(data){
// 		console.log('capture_data'+data);
// 	});

// 	//void a charge
// 	var charge = new Paymentwall.Charge();

// 	charge.otherOperation(chargeid,'void',function(data){
// 		console.log('void_data'+data);
// 	});

// 	//refund a charge
// 	var charge = new Paymentwall.Charge();

// 	charge.otherOperation(chargeid,'refund',function(data){
// 		console.log('refund_data'+data);
// 	});

// 	//create a subscription
// 	var subscription = new Paymentwall.Subscription(
// 	0.5,
// 	'USD',
// 	'fan',
// 	'example@xx.com',
// 	123,
// 	token,
// 	'day',
// 	3,
// 	{
// 		'trial[amount]':0.5,
// 		'trial[currency]':'USD',
// 		'trial[period]':'day',
// 		'trial[period_duration]':3
// 	}
// 	);

// 	subscription.createSubscription(function(subscription_response){
// 		console.log(subscription_response);
// 	});

// 	//get details of subscription
// 	var subscription = new Paymentwall.Subscription();

// 	subscription.otherOperation(subscriptionid,'detail',function(data){
// 		console.log('subscription_data'+data);
// 	});

// 	//cancel a subscription
// 	var subscription = new Paymentwall.Subscription();

// 	subscription.otherOperation(subscriptionid,'cancel',function(data){
// 		console.log('cancel_data'+data);
// 	});
// });


var widget = new Paymentwall.Widget(
  'test_user',      // id of the end-user who's making the payment
  'p10',             // widget code, e.g. p1; can be picked in the Widgets section of your merchant account 
  [                 // product details for Flexible Widget Call. 
                    // Leave empty if product selection happens on Paymentwall's side
    new Paymentwall.Product(
      'product301',                           // id of the product in your system  
      9.99,                                   // price
      'USD',                                  // currency code
      'Automatic Test Product Name'                             // this is a recurring product
    )
  ],
  {'email': 'user@hostname.com', 'sign_version': "2"}              // additional parameters. for full list check API docs
);
console.log(widget.getHtmlCode());