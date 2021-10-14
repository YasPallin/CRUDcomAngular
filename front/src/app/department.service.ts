import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Department } from './department';
import { tap, delay } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class DepartmentService {

	readonly url = 'http://localhost:3000/departments';

	private departmentsSubject$: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>(null);
	// é um tipo de observable, serve para que tbm possa enviar valores a um determinado sujeito, alem, de escrever - no observable convencional nao faz isso, esse tbm pode enviar valores para um determinado sujeito que esteja querendo observar

	private loaded: boolean = false;

	constructor(private http: HttpClient) { }

	// <Department> é a classe exportada
	get(): Observable<Department[]> {
		if (!this.loaded) {
			this.http.get<Department[]>(this.url)
				.pipe(
					tap((deps) => console.log(deps)), // gerar efeito colateral - uma espécie de notificação/msg par quando quiser mudar 
					delay(1000) // gerar atraso
				)
				.subscribe(this.departmentsSubject$);// se insceve pra ouvir o observable
			this.loaded = true;
		}
		return this.departmentsSubject$.asObservable(); // responsável por fazer a busca na api para conseguir listar no caso os departamentos que la contém 
	}
	// método add
	add(d: Department): Observable<Department> { // <> é do tipo department
		return this.http.post<Department>(this.url, d)
			.pipe(
				tap((dep: Department) => this.departmentsSubject$.getValue().push(dep))
			)
	}

	// método de deletar
	del(dep: Department): Observable<any> { // <> é do tipo any
		return this.http.delete(`${this.url}/${dep._id}`)
		.pipe(
			tap(() => {
				let departments = this.departmentsSubject$.getValue();
				let i = departments.findIndex(d => d._id === dep._id);// compara o q tem guardado com o q está tentando excluir
				// vai retornar a posição do elemento que será deletado
				if (i >= 0) {
					// se for maior ou igual a 0 é pq existe na array
					departments.splice(i, 1); // vai alterar o conteúdo, remove o do id e coloca o 1 no lugar para n ter buracos, da pra ver o q for diferente de 1 no caso
				}
			})
		)
	}

	// método de alterar
	update(dep: Department): Observable<Department>{
		return this.http.patch<Department>(`${this.url}/${dep._id}`, dep)// segundo paramanetro é o q vai alterar
		.pipe( // pipe pq serve como filtro
			tap((d)=>{ //tap causa uma ação no observable
				let departments = this.departmentsSubject$.getValue();
				let i = departments.findIndex(d => d._id === dep._id);
				if (i>=0){
					departments[i].name = d.name;
				}
			})
		)
	}
}
