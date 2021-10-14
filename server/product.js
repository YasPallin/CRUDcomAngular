var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// schema = modelo do banco - pré determinando uma modelagem pro banco - ainda nao passou nenhuma informação pro mongoDB

var productSchema = new Schema({
	name:String
});

module.exports = mongoose.model("Product", productSchema);
