import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {

  constructor(private authService: AuthService, private router: Router) { }

  public ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        console.log(data);
      }
    })
  }

  public viewDashboard() {
    this.router.navigate(['/dashboard'])
  }

  public logout(): void {
    this.authService.logout();
  }
}
