import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, catchError, Observable, throwError, of, finalize, delay, tap } from 'rxjs';

export interface Note {
  id?: number;
  content: string;
  createdAt?: Date;
  createdBy?: string;
  carVin: string;
}

@Injectable({
  providedIn: 'root'
})

export class NoteService {
  private notesListSubject = new BehaviorSubject<Note[]>([]);
  public notesList$ = this.notesListSubject.asObservable();
  private loadingNoteListSubject = new BehaviorSubject<boolean>(false);
  public loadingNoteList$ = this.loadingNoteListSubject.asObservable();
  private errorNoteListSubject = new BehaviorSubject<string | null>(null);
  public errorNoteList$ = this.errorNoteListSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  public loadNoteList(): void {
    this.loadingNoteListSubject.next(true);
    this.errorNoteListSubject.next(null);

    try {
      const dummyLists: Note[] = [
        {
          id: 1,
          content: "Very straight-to-point article. Really worth time reading. Thank you! But tools are just the instruments for the UX designers. The knowledge of the design tools are as important as the creation of the design strategy.",
          createdBy: "jgarcia",
          createdAt: new Date("2024-08-01T10:00:00Z"),
          carVin: "1C4HJWEGXY1YPF9Y"
        },
        {
          id: 2,
          content: "The article covers the essentials, challenges, myths and stages the UX designer should consider while creating the design strategy.",
          createdBy: "cjones",
          createdAt: new Date("2024-08-15T14:30:00Z"),
          carVin: "1C4HJWEGXY1YPF9Y"
        },
        {
          id: 3,
          content: "Thanks for sharing this. I do came from the Backend development and explored some of the tools to design my Side Projects.",
          createdBy: "chess",
          createdAt: new Date("2024-09-05T08:45:00Z"),
          carVin: "1C4HJWEGXY1YPF9Y"
        },
      ]
      setTimeout(() => {
        this.notesListSubject.next(dummyLists);
        this.loadingNoteListSubject.next(false);
      }, 2000);

    } catch (error: any) {
      this.errorNoteListSubject.next("Failed to load notes")
      this.loadingNoteListSubject.next(false);
    }
  }

  public createNote(data: any) {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const newNote: Note = {
      id: Math.floor(Math.random() * 10000), // simulate backend id
      content: data.content,
      createdBy: data.username,
      createdAt: new Date(),
      carVin: '',
    };

    return of(data).pipe(
      delay(500), // simulate network delay
      tap(note => {
        // Add to current BehaviorSubject value
        const current = this.notesListSubject.value;
        this.notesListSubject.next([...current, note]);
      }),
      catchError((err: HttpErrorResponse) => {
        this.errorSubject.next(err.message || 'Something went wrong');
        return throwError(() => err);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  public editeNote() {

  }

  public deleteNote() {

  }

  private handleError() {
    let errorMessage = '';
  }

}





