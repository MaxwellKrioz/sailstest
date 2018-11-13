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

  'GET /products/list': 'ProductController.list',
  'GET /products/:id': 'ProductController.get',  

  'GET /orders/' :'OrderController.list',
  'GET /orders/:id' :'OrderController.get',  

  'POST /cart/add':{action:'cart-add',},

  //'POST /checkout/finish': {action:'orders/create',},
  
  //'POST /customer/login':  {action:'customer/login'}
};
