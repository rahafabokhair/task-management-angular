import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginSignoutService } from '../../../admin/service/login-signout.service';
import { User } from '../../../core/models/object-model';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  searchText = '';
  router = inject(Router);
  fb = inject(FormBuilder);
  // courseService = inject(CourseService);
  loginSignoutService = inject(LoginSignoutService);
  username: any;
  role: any;


  constructor() {
    const user: User = JSON.parse(localStorage.getItem('user') || '{}');
    this.loginSignoutService.setCurrentUser(user);

    this.loginSignoutService.currentUser$.subscribe((userdata) => {
      this.username = userdata.name;
      this.role = userdata.role;
    });
  }
  searchProduct() {
   // this.courseService.onSearchVal.next(this.searchText);
    this.router.navigateByUrl('courses');
  }

  logout() {
    this.loginSignoutService.logout();
    this.router.navigateByUrl('auth');
  }
}
