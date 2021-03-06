import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  public showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 7000,
    });
  }
}
