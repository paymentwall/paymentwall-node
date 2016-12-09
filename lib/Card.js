'use strict';

function Card(number,exp_month,exp_year,cvv){
	this.number = number || null,
	this.exp_month =  exp_month || null,
	this.exp_year = exp_year || null,
	this.cvv = cvv || null
}

module.exports = Card;