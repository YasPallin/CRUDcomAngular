import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product';
import { tap, delay } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class ProductService {

	readonly url = 'http://localhost:3000/products';

	private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);

	private loaded: boolean = false;

	constructor(private http: HttpClient) { }

	get(): Observable<Product[]> {
		if (!this.loaded) {
			this.http.get<Product[]>(this.url)
				.pipe(
					tap((prods) => console.log(prods)), // gerar efeito colateral - uma espécie de notificação/msg par quando quiser mudar 
					delay(1000) // gerar atraso
				)
				.subscribe(this.productsSubject$);// se insceve pra ouvir o observable
			this.loaded = true;
		}
		return this.productsSubject$.asObservable(); // responsável por fazer a busca na api para conseguir listar no caso os departamentos que la contém 
	}
	// método add
	add(p: Product): Observable<Product> { // <> é do tipo department
		return this.http.post<Product>(this.url, p)
			.pipe(
				tap((prod: Product) => this.productsSubject$.getValue().push(prod))
			)
	}

	// método de deletar
	del(prod: Product): Observable<any> { // <> é do tipo any
		return this.http.delete(`${this.url}/${prod._id}`)
		.pipe(
			tap(() => {
				let products = this.productsSubject$.getValue();
				let i = products.findIndex(p => p._id === prod._id);// compara o q tem guardado com o q está tentando excluir
				// vai retornar a posição do elemento que será deletado
				if (i >= 0) {
					// se for maior ou igual a 0 é pq existe na array
					products.splice(i, 1); // vai alterar o conteúdo, remove o do id e coloca o 1 no lugar para n ter buracos, da pra ver o q for diferente de 1 no caso
				}
			})
		)
	}

	// método de alterar
	update(prod: Product): Observable<Product>{
		return this.http.patch<Product>(`${this.url}/${prod._id}`, prod)// segundo paramanetro é o q vai alterar
		.pipe( // pipe pq serve como filtro
			tap((p)=>{ //tap causa uma ação no observable
				let products = this.productsSubject$.getValue();
				let i = products.findIndex(p => p._id === prod._id);
				if (i>=0){
					products[i].name = p.name;
				}
			})
		)
	}
}
