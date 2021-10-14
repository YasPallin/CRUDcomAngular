import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Department } from '../department';
import { DepartmentService } from '../department.service';

@Component({
	selector: 'app-department',
	templateUrl: './department.component.html',
	styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
	// iniciando as variáveis
	depName: string = '';
	departments: Department[] = []; // tipo array
	depEdit: Department = null; // nulo

	private unsubscribe$: Subject<any> = new Subject();

	constructor(
		private departmentService: DepartmentService,
		private snackbar: MatSnackBar) { }

	// ngOnInit aparece logo que a pagina é criada
	ngOnInit() {
		this.departmentService.get() //get para trazer as infos do BD
			.pipe(takeUntil(this.unsubscribe$)) // takeuntil leva alguns segundos - monitoria
			.subscribe((deps) => this.departments = deps) // preenche o array q ta vazio
	}

	// método save - para salvar quando criar e quando alterar
	save() {
		if (this.depEdit) {
			this.departmentService.update(
				{ name: this.depName, _id: this.depEdit._id }
			).subscribe(
				(dep) => {
					this.notify('Alterado!')
				},
				(err) => {
					this.notify('Erro!');
					console.log(err)
				}
			)
		} else {
			this.departmentService.add({ name: this.depName })
			.subscribe(
				(dep) => {
					console.log(dep);
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
	edit(dep: Department){
		this.depName = dep.name;
		this.depEdit = dep;
	}

	delete(dep:Department){
		this.departmentService.del(dep) // del foi eito em services
		.subscribe(
			() => this.notify('Removido!'),
			(err) => this.notify(err.error.msg)
		)
	}

	// limpa o formulário
	clearFields() {
		this.depName = '';
		this.depEdit = null;
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
