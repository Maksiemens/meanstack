import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MaterializeService } from '../../services/materialize.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements AfterViewInit {

@ViewChild('floating') floatingRef: ElementRef;

links = [
  { url: '/overview', name: 'Обзор' },
  { url: '/analytics', name: 'Аналитика' },
  { url: '/history', name: 'История' },
  { url: '/order', name: 'Добавить заказ' },
  { url: '/categories', name: 'Ассортимент' }
];

  constructor(
    private auth: AuthService,
    private router: Router,
    private materialize: MaterializeService
  ) {}

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngAfterViewInit() {
    this.materialize.initializeFloatingButton(this.floatingRef);
  }
}
