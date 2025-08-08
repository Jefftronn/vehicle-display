import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SideBar } from '../side-bar/side-bar';
import { NavBar } from '../nav-bar/nav-bar';

declare const simpleDatatables: any;

@Component({
  selector: 'app-dashboard',
  standalone: true, // Use this only if you're using standalone components
  imports: [SideBar, NavBar],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, AfterViewInit {

  ngOnInit(): void {
    // Do initialization logic if needed
  }

  ngAfterViewInit(): void {
    const tableElement = document.getElementById('pagination-table');

    if (tableElement && typeof simpleDatatables?.DataTable !== 'undefined') {
      const dataTable = new simpleDatatables.DataTable("#pagination-table", {
        paging: true,
        perPage: 5,
        perPageSelect: [5, 10, 20, 50],
        firstLast: true,
        nextPrev: true,
        labels: {
          placeholder: "Search...",
          perPage: "{select} entries per page",
          noRows: "No entries found",
          info: "Showing {start} to {end} of {rows} entries",
        }
      });

      // Wait for DOM render
      setTimeout(() => {
        requestAnimationFrame(() => {
          const searchInput = document.querySelector(".dataTable-input") as HTMLInputElement;
          if (searchInput) {
            searchInput.classList.add(
              "border",
              "border-gray-300",
              "rounded-lg",
              "px-4",
              "py-2",
              "text-sm",
              "focus:ring-2",
              "focus:ring-blue-500",
              "focus:border-blue-500"
            );
          }

          const paginationButtons = document.querySelectorAll(".dataTable-pagination .dataTable-pagination-list li button");
          paginationButtons.forEach(button => {
            button.classList.add(
              "mx-1",
              "px-3",
              "py-1",
              "rounded-md",
              "bg-white",
              "border",
              "border-gray-300",
              "hover:bg-blue-100",
              "text-gray-700",
              "text-sm"
            );
          });
        });
      }, 100);
    }
  }
}
