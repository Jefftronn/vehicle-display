import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NoteService, Note } from '../../services/note.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-car-report-notes',
  imports: [CommonModule, MatMenuModule, MatIcon, ReactiveFormsModule],
  templateUrl: './car-report-notes.html',
  styleUrl: './car-report-notes.css'
})
export class CarReportNotes implements OnInit {
  @Input() carVin = '';
  public lists$!: Observable<Note[]>;
  public noteListLoading$!: Observable<boolean>;
  public errorNoteList$!: Observable<string | null>;
  public noteLoading$!: Observable<boolean>;
  public error$!: Observable<string | null>;
  public noteForm!: FormGroup
  public isDropdownOpen: boolean = true;
  public userProfile: UserProfile | null = null;

  constructor(private fb: FormBuilder, private noteService: NoteService, private http: HttpClient, private snackbar: MatSnackBar, private authService: AuthService) { }

  ngOnInit(): void {
    this.lists$ = this.noteService.notesList$;
    this.noteListLoading$ = this.noteService.loadingNoteList$;
    this.errorNoteList$ = this.noteService.errorNoteList$;

    this.noteService.loadNoteList();
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        console.log(profile);
      }
    })

    this.noteForm = this.fb.group({
      content: ['', Validators.required],
    })
  }

  public onSubmit() {
    if (this.noteForm.valid) {
      const noteContent = this.noteForm.value;
      const noteRequest: Note = {
        content: noteContent.content,
        createdBy: this.userProfile?.username,
        createdAt: new Date(),
        carVin: this.carVin,
      }

      this.noteService.createNote(noteRequest).subscribe({
        next: (list) => {
          this.openSnackBar("Your note has been saved successfully.")
          this.noteForm.reset();
        },
        error: (err) => console.error(err)
      });
    }
  }

  public onDropDownClick() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  public openSnackBar(message: string, action: string = 'Close') {
    this.snackbar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  };
}
