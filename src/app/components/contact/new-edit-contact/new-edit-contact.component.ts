import { ResponseModel } from './../../../models/response.model';
import { Contact } from './../../../models/contact.model';
import { ContactService } from './../../../services/contact.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-edit-contact',
  templateUrl: './new-edit-contact.component.html',
  styleUrls: ['./new-edit-contact.component.css'],
})
export class NewEditContactComponent implements OnInit {
  phone = /^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  type: string = '';
  contact: FormGroup;

  constructor(
    private contactService: ContactService,
    private dialogRef: MatDialogRef<NewEditContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string; contact: Contact },
    private _snackbar: MatSnackBar
  ) {
    this.contact = new FormGroup({
      id: new FormControl(),
      regDate: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.nullValidator]),
      phone: new FormControl('', [Validators.pattern(this.phone)]),
      curp: new FormControl('', [Validators.required]),
      active: new FormControl(1),
    });
    this.type = data.type;
    if (this.type === "Edit Contact") {
      this.assignValues(data.contact);
    }
  }

  ngOnInit(): void {}

  assignValues(data: Contact): void {
    this.contact.controls['id'].setValue(data.id);
    this.contact.controls['regDate'].setValue(data.regDate);
    this.contact.controls['name'].setValue(data.name);
    this.contact.controls['address'].setValue(data.address);
    this.contact.controls['phone'].setValue(data.phone);
    this.contact.controls['curp'].setValue(data.curp);
    this.contact.controls['active'].setValue(data.active);
  }

  curpValida(curp: any) {
    var re =
        /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
      validado = curp.match(re);

    if (!validado) return false;

    if (validado[2] != this.digitoVerificador(validado[1])) return false;

    return true;
  }

  digitoVerificador(curp17: string) {
    var diccionario = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ',
      lngSuma = 0.0,
      lngDigito = 0.0;
    for (var i = 0; i < 17; i++)
      lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
    lngDigito = 10 - (lngSuma % 10);
    if (lngDigito == 10) return 0;
    return lngDigito;
  }

  validarInput(input: any) {
    const curp = (input.target as HTMLInputElement).value.toUpperCase();
    if (this.curpValida(curp)) {
      this.contact.controls['curp'].setErrors(null);
    } else {
      this.contact.controls['curp'].setErrors({ pattern: true });
    }
  }

  showSuccesDialog(): void {
    let message: string = "";
    if (this.type === "New Contact") {
      message = "Contact created succesfully";
    } else {
      message = "Contact updated succesfully";
    }
    this._snackbar.open(message, "", {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 2500
    });
  }

  showErrorDialog(): void {
    this._snackbar.open("Theres and error", "", {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 2500
    });
  }

  onSubmit() {
    if (this.contact.valid) {
      if (this.type === 'New Contact') {
        this.contactService.addContact(this.contact.value).subscribe(
          (res) => {
            console.log(res);
            this.showSuccesDialog();
            this.dialogRef.close('si');
          }
        );
      } else {
        console.log(this.contact.value);
        this.contactService.updateContact(this.contact.value).subscribe(
          (res) => {
            this.showSuccesDialog();
            this.dialogRef.close('si');
          }
        );
      }
    }
  }
}
