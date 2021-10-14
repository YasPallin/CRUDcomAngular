import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit {
	// iniciando as variáveis
	prodName: string = '';
	products: Product[] = []; // tipo array
	prodEdit: Product = null; // nulo

	private unsubscribe$: Subject<any> = new Subject();

	constructor(
		private productService: ProductService,
		private snackbar: MatSnackBar) { }

	// ngOnInit aparece logo que a pagina é criada
	ngOnInit() {
		this.productService.get() //get para trazer as infos do BD
			.pipe(takeUntil(this.unsubscribe$)) // takeuntil leva alguns segundos - monitoria
			.subscribe((prods) => this.products = prods) // preenche o array q ta vazio
	}

	// método save - para salvar quando criar e quando alterar
	save() {
		if (this.prodEdit) {
			this.productService.update(
				{ name: this.prodName, _id: this.prodEdit._id }
			).subscribe(
				(prod) => {
					this.notify('Alterado!')
				},
				(err) => {
					this.notify('Erro!');
					console.log(err)
				}
			)
		} else {
			this.productService.add({ name: this.prodName })
			.subscribe(
				(prod) => {
					console.log(prod);
					this.notify('Inserido!')
				},
				(err) => {
					console.error(err);
				}
			)
		}
		this.clearFields();
	}

	// método de editar
	edit(prod: Product){
		this.prodName = prod.name;
		this.prodEdit = prod;
	}

	delete(prod:Product){
		this.productService.del(prod) // del foi eito em services
		.subscribe(
			() => this.notify('Removido!'),
			(err) => this.notify(err.error.msg)
		)
	}

	// limpa o formulário
	clearFields() {
		this.prodName = '';
		this.prodEdit = null;
	}

	// vai ser chamado para cancelar (limpar)
	cancel() {
		this.clearFields();
	}

	//emite notificação
	notify(msg: string) {
		this.snackbar.open(msg, 'OK', { duration: 3000 });
	}

	//para destruir
	ngOnDestroy() {
		this.unsubscribe$.next();
	}


}
