var express = require('express');
var router = express.Router();
var Department = require('./department');
// requer o modelo 


//ROTA PARA SALVAR (CREATE)
router.post('/', (req, res) => {
	let dep = new Department({
		name: req.body.name
	})

	// (tratando caso dê erro ou não)
	dep.save((err, d) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(d); // d do parâmetro ali
		}
	})
})

// ROTA PARA TRAZER OS DEPARTAMENTOS SALVOS (READ)
router.get('/', (req, res) => {
	Department.find().exec((err, departments) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(departments);
		}
	})
})

// ROTA PARA DELETAR (DELETE)
// async é pq é assíncrona -- usa o .delete pq vai pegar coisa de outra aplicação
router.delete('/:id', async (req, res) => {
	// try fuciona como if caso a aplicação dê certo e catch para quando der erro
	try {
		let id = req.params.id;
		// precisa determinar em que momento vai fazer a função
		await Department.deleteOne({ _id: id }) // esse id vai conter a característica daquele id específico capturado pela rota
		res.status(200).send({})
	}
	catch (err) {
		res.status(500).send({ msg: 'Internal Error', error: err })
	}
})

// ROTA PARA EDITAR (UPDATE)
router.patch('/:id', (req, res) => {
	Department.findById(req.params.id, (err, dep) => {
		if (err) {
			res.status(500).send(err);
		}
		else if (!dep) {
			res.status(404).send({ dep })
		}
		else {
			dep.name = req.body.name;
			dep.save() //salve o nome
				.then((d) => res.status(200).send(d))// faz o papel de try
				.catch((err) => res.status(500).send(err))
		}
	})
})

module.exports = router;
// exporta as rotas