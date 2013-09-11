/*
 * GET home page.
 */

exports.test = function(req, res) {
	console.log(req.params);
	
	var  itemsLen=req.params[0];
	var  productsLen=req.params[1];
	var  contactsLen=req.params[2];
	var  relatedBusinessesLen=req.params[3];
	var  product2sLen=req.params[4];

	var items = [];
	var products = [];
	var product2s = [];
	var contacts = [];
	var relatedBusinesses = [];

	for (var i = 0; i < itemsLen; i++) {
		items.push({
			index : i,
			content : "content" + i,
			guilin_guid : "guilin_guid" + i,
			data : "data" + i,
			review : "review" + i,
			ip : "ip" + i
		});
	};

	for (var i = 0; i < productsLen; i++) {
		products.push({
			Code : "Code" + i,
			Quantity : "Quantity" + i,
			Unit : "Unit " + i,
			Tax : "Tax" + i,
			Discount : "Discount" + i,
			Total : "Total" + i
		});
	};

	for (var i = 0; i < contactsLen; i++) {
		contacts.push({
			guilin_guid : "guilin_guid" + i,
			data_sap_domid : "data_sap_domid" + i,
			name : "name" + i
		});
	};

	for (var i = 0; i < relatedBusinessesLen; i++) {
		relatedBusinesses.push({
		});
	};

	for (var i = 0; i < product2sLen; i++) {
		product2s.push({
			Code : "Code" + i,
			Quantity : "Quantity" + i,
			Unit : "Unit " + i,
			Tax : "Tax" + i,
			Discount : "Discount" + i,
			Total : "Total" + i
		});
	};

	res.render('index', {
		items : items,
		products : products,
		product2s : product2s,
		contacts : contacts,
		relatedBusinesses : relatedBusinesses
	});
};

exports.list = function(req, res) {
	res.render("list", {
		title : "List",
		items : [1991, "a", "b", "c"]
	});
}; 



exports.index=function(){

};
exports.user=function(){

};
exports.post=function(){

};
exports.reg=function(){

};
exports.doReg=function(){

};
exports.login=function(){

};
exports.doLogin=function(){

};
exports.logout=function(){

};

module.exports=function(app){
	app.get("/micro",function(req,res){
		res.render("microblog/index",{title:"UFO"});
	});
	app.get("/micro/reg",function(req,res){
		res.render("microblog/reg",{title:"UFO"});
	});
}


