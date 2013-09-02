/*
 * GET home page.
 */

exports.index = function(req, res) {

	var items = [];
	var products=[];
	var contacts=[];
	var relatedBusinesses=[];

	for (var i = 0; i < 100; i++) {
		items.push({
			index: i,
			content: "content"+i,
			guilin_guid: "guilin_guid"+i,
			data: "data"+i,
			review: "review"+i,
			ip: "ip"+i
		});
	};	

	for (var i = 0; i < 100; i++) {
		products.push({
			Code:"Code"+i,
			Quantity:"Quantity"+i,
			Unit :"Unit "+i,
			Tax:"Tax"+i,
			Discount:"Discount"+i,
			Total:"Total"+i
		});
	};

	for (var i = 0; i < 100; i++) {
		contacts.push({
			guilin_guid:"guilin_guid"+i,
			data_sap_domid:"data_sap_domid"+i,
			name:"name"+i
		});
	};


	for (var i = 0; i < 100; i++) {
		relatedBusinesses.push({
		});
	};

	res.render('index', {
		items: items,
		products:products,
		contacts:contacts,
		relatedBusinesses:relatedBusinesses
	});
};