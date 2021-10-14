var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// schema = modelo do banco - pré determinando uma modelagem pro banco - ainda nao passou nenhuma informação pro mongoDB

var departmentSchema = new Schema({
	name:String
});

module.exports = mongoose.model("Department", departmentSchema);
// primeiro parâmetro é o nome que quer dar para a tabela no banco e o segundo é o esquema que quer dar