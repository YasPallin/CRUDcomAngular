var express = require('express');
var router = express.Router();
var Product = require('./product');

router.post('/', (req, res) => {
	let prod = new Product({
		name: req.body.name
	})

	prod.save((err, d) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(d); 
		}
	})
})

router.get('/', (req, res) => {
	Product.find().exec((err, products) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(products);
		}
	})
})


router.delete('/:id', async (req, res) => {
	try {
		let id = req.params.id;
		await Product.deleteOne({ _id: id }) 
		res.status(200).send({})
	}
	catch (err) {
		res.status(500).send({ msg: 'Internal Error', error: err })
	}
})

router.patch('/:id', (req, res) => {
	Product.findById(req.params.id, (err, prod) => {
		if (err) {
			res.status(500).send(err);
		}
		else if (!prod) {
			res.status(404).send({ prod })
		}
		else {
			prod.name = req.body.name;
			prod.save() 
				.then((d) => res.status(200).send(d))
				.catch((err) => res.status(500).send(err))
		}
	})
})

module.exports = router;
