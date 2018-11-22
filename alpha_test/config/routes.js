/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  '/': 'BuildController.firstInstance',

  'GET /build' :'BuildController.build',

  'GET /cart/' :'CartController.get',
  'GET /cart/view' :'CartController.get',

  'GET /cart/update/:option/' :'CartController.update',
  'GET /cart/remove' :'CartController.remove',

  'GET /products/list': 'ProductController.list',
  'GET /products/:id': 'ProductController.get',

  'GET /order/list' :'OrderController.list',
  'GET /order/create' :'OrderController.create',
  'GET /order/:id' :'OrderController.get',

  'GET /order/success/:id' :'OrderController.finish',

  'POST /order/validation' : 'OrderController.validation',

  'POST /cart/add':'CartController.add',

  //'POST /checkout/finish': {action:'orders/create',},

  //'POST /customer/login':  {action:'customer/login'}
};
