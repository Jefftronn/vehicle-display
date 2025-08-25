import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {

  constructor(private authService: AuthService) { }

  public ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        console.log(data);
      }
    })
  }

  public logout(): void {
    this.authService.logout();
  }
}
