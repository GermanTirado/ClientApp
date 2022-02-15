import { NewEditContactComponent } from './new-edit-contact/new-edit-contact.component';
import { ContactService } from './../../services/contact.service';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Contact } from 'src/app/models/contact.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'id',
    'name',
    'regDate',
    'address',
    'phone',
    'curp',
    'actions',
  ];
  info : any;
  contactSubscription!: Subscription;

  contactArray: Contact[] = [];

  constructor(
    private dialog: MatDialog,
    private contactService: ContactService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.contactSubscription?.unsubscribe();
  }

  // Get All Contact
  public loadContacts(): void {
    this.contactSubscription = this.contactService.getAllContacts().subscribe(
      (res) => {
        this.dataSource.data = res.data;
      },
      (err) => console.error(err)
    );
  }

  // Browser
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  showDeleteDialog(): void {
    this._snackbar.open('Contact deleted succesfully', '', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  // New / Edit Contact
  public openDialog(type: string, contact?: Contact): void {
    if (type === 'New Contact') {
      const contactDialog = this.dialog.open(NewEditContactComponent, {
        data: { type: type },
        disableClose: true,
        autoFocus: false,
        width: '30%',
      });
      contactDialog.afterClosed().subscribe(data => {
        if (data) {
          this.loadContacts();
        }
      });
    } else {
      const contactDialog = this.dialog.open(NewEditContactComponent, {
        data: { type: type, contact: contact },
        disableClose: true,
        autoFocus: false,
        width: '30%',
      });
      contactDialog.afterClosed().subscribe(data => {
        if (data) {
          this.loadContacts();
        }
      });
    }
  }

  // Delete Contact
  public deleteContact(contact: Contact): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.deleteContact(contact).subscribe((res) => {
          this.showDeleteDialog();
          this.loadContacts();
        });
        this.showDeleteDialog();
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    let data;
    reader.onloadend = (e) => {
      data = reader.result;
      this.parseText(data);
    };
    reader.readAsText(file);

    Swal.fire({
      title: 'do you want to import this data?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0D6EFD',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        const data = this.dataSource.data;
        this.contactArray.forEach((contact: Contact) => {
          data.push(contact);
        });
        this.dataSource.data = data;
      }
    });
  }

  parseText(data: any) {
    let csvToRowArray = data.split("\n");
    for (let index = 1; index < csvToRowArray.length; index++) {
      let row = csvToRowArray[index].split(",");
      this.contactArray.push(new Contact(
        parseInt( row[0], 10), row[1], row[2], row[3], row[4], row[5], parseInt(row[6]))
      );
    }
    console.log(this.contactArray);
  }
}
