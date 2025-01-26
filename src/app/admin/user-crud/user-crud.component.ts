import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { User } from '../../core/models/object-model';
import { UserCrudService } from '../service/user-crud.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-crud',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-crud.component.html',
  styleUrl: './user-crud.component.css',
})
export class UserCrudComponent implements OnInit {
  userCrudServise = inject(UserCrudService);
  formBuilder = inject(FormBuilder);

  @ViewChild('closeUpdateAdd') closeUpdateAdd: any;
  @ViewChild('closebutton') closebutton: any;
  userList: User[] = [];
  addEditUser = false;
  userForm!: FormGroup;
  imageName = '';
  updateUsrId!: number;
  deletedUsrId!: number;
  roleList = [
    { id: 1, name: 'admin' },
    { id: 1, name: 'teatcher' },
    { id: 1, name: 'student' },
  ];
  constructor() {}
  ngOnInit(): void {
    this.userCrudServise.users$.subscribe((usersdata) => {
      this.userList = usersdata;
    });
    this.userFormBuilder();
    this.getAllUsers();
  }

  userFormBuilder() {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobNumber: ['', Validators.required],
      age: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      gender: ['', Validators.required],
      role: ['', Validators.required],
      image: [],
    });
  }
  getAllUsers() {
    this.userCrudServise.getAllUsers().subscribe((usersdata) => {
      this.userList = usersdata;
    });
  }

  OnAddUserPopup() {
    this.addEditUser = false;
    this.userForm.reset();
  }
  addNewUser() {
    let userData: User = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      mobNumber: this.userForm.value.mobNumber,
      gender: this.userForm.value.gender,
      role: this.userForm.value.role,
      age: this.userForm.value.age,
      image: this.userForm.value.image ? this.userForm.value.image : '',
    };

    this.userCrudServise.addUser(userData).subscribe((data) => {
      if (data) {
        this.closeUpdateAdd.nativeElement.click();
      }
    });
  }

  OnUpdateSubPopup(userId: number) {
    this.addEditUser = true;
    this.updateUsrId = userId;

    this.userCrudServise.getUserPerId(userId).subscribe((userdata) => {
      this.imageName = userdata.image.toString();
      let tempUserform = {
        name: userdata.name,
        email: userdata.email,
        password: userdata.password,
        mobNumber: userdata.mobNumber,
        gender: userdata.gender,
        role: userdata.role,
        age: userdata.age,
        image: '',
      };
      this.userForm.patchValue(tempUserform);
    });
  }
  updateUser() {
    let updatedUser: User = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      mobNumber: this.userForm.value.mobNumber,
      gender: this.userForm.value.gender,
      role: this.userForm.value.role,
      age: this.userForm.value.age,

      image:
        this.userForm.value.image == ''
          ? this.imageName
          : this.userForm.value.image,
    };
    this.userCrudServise
      .updateUser(this.updateUsrId, updatedUser)
      .subscribe((data) => {
        if (data) {
          this.closeUpdateAdd.nativeElement.click();
          alert('user updated');
        }
      });
  }

  onDeletePopup(userId: number) {
    this.deletedUsrId = userId;
  }
  deletUser() {
    this.userCrudServise.deleteUser(this.deletedUsrId).subscribe((data) => {
      if (data) {
        this.closebutton.nativeElement.click();
        alert('user Deleted');
      }
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }
}
