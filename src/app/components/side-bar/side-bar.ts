import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css'
})
export class SideBar {

  constructor(private router: Router) {

  }

  public viewDashboard() {
    this.router.navigate(['/dashboard'])
  }
}
