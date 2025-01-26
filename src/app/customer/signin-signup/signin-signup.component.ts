import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { User } from '../../core/models/object-model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginSignoutService } from '../../admin/service/login-signout.service';

@Component({
  selector: 'app-signin-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signin-signup.component.html',
  styleUrl: './signin-signup.component.css',
})
export class SigninSignupComponent {
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  loginSignoutService = inject(LoginSignoutService);
  signupForm!: FormGroup;
  formStatus = false;
  submitted = false;
  signupUser!: User;

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      mobNumber: ['', Validators.required],
      gender: ['', Validators.required],
      role: [''],
      age: ['', Validators.required],
    });
  }

  switchMode() {
    this.formStatus = !this.formStatus;
  }
  onLogin(formValue: NgForm) {
    if (!this.formStatus) {
      const email = formValue.value.email;
      const password = formValue.value.password;

      this.loginSignoutService.Login(email, password).subscribe((userdata) => {
        if (userdata) {
          this.router.navigateByUrl('');
        } else {
          alert('this account is not found');
        }
      });
    }
  }
  onSignup() {
    this.submitted = true;

    console.log(this.signupForm.value);
    if (!this.signupForm.valid) {
      return;
    }
    this.signupUser = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      mobNumber: this.signupForm.value.mobNumber,
      gender: this.signupForm.value.gender,
      role: 'student',
      age: this.signupForm.value.age,
      image: '',
    };

    this.loginSignoutService
      .signup(this.signupUser)
      .subscribe((userdata: any) => {
        if (userdata) {
          this.router.navigateByUrl('courses');
          this.signupForm.reset();
        } else {
          alert('somthing error');
        }
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }
}
