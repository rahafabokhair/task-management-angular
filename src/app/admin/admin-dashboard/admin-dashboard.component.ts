import { Component, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ParamMap,
  RouterLink,
  RouterModule,
  RouterOutlet,
  UrlSegment,
} from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, RouterOutlet,RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {}
