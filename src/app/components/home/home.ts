import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideBar } from '../side-bar/side-bar';
import { NavBar } from '../nav-bar/nav-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SideBar, NavBar, CommonModule, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
