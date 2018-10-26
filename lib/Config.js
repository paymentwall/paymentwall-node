'use strict';

function Config (apiType, appKey, secretKey) {
  	Config.prototype.apiType = apiType;
  	Config.prototype.appKey = appKey;
  	Config.prototype.secretKey = secretKey;
};

Config.prototype.API_VC = 1;
Config.prototype.API_GOODS = 2;
Config.prototype.API_CART = 3;
Config.prototype.SIGNATURE_VERSION_1 = 1;
Config.prototype.SIGNATURE_VERSION_2 = 2;
Config.prototype.SIGNATURE_VERSION_3 = 3;
Config.prototype.DEFAULT_SIGNATURE_VERSION = 3;
Config.prototype.VC_CONTROLLER = 'ps';
Config.prototype.GOODS_CONTROLLER = 'subscription';
Config.prototype.CART_CONTROLLER = 'cart';
Config.prototype.WIDGET_BASE_URL = 'https://api.paymentwall.com/api';

Config.prototype.BRICK_ONETIMETOKEN_TEST_BASE_URL = 'pwgateway.com';
Config.prototype.BRICK_ONETIMETOKEN_TEST_PATH = '/api/token';
Config.prototype.BRICK_BASE_URL = 'api.paymentwall.com';
Config.prototype.BRICK_ONETIMETOKEN_PATH = '/api/brick/token';
Config.prototype.BRICK_CHARGE_PATH = '/api/brick/charge';
Config.prototype.BRICK_SUBSCRIPTION_CHARGE_PATH = '/api/brick/subscription';


Config.prototype.VERSION = '2.0.0';

module.exports = Config;