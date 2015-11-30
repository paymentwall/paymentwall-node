/**
 * @function
 *
 * Hooks can be used to prepare and clean
 * the environment before and after
 * each scenario is executed
 */
module.exports = function() {
    /**
     * To run something before every scenario,
     * use before hooks
     *
     * @param  {Function} callback a done callback from cucumber.js
     */
    this.Before(function(scenario,callback) {
        require('chai').should();
        require('chai').expect;
        var Paymentwall = require (process.cwd() + '/index');

        Paymentwall.configure(
            null,
            null,
            null
        );

        this.paymentwall = Paymentwall;

        //Initializes

        callback();
    });
}