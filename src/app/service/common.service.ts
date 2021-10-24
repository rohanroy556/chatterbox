import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  showAppLoader = false;

  constructor(private messageSnackBar: MatSnackBar) { }

  durationMessage(message: string, 
    duration?: number, 
    horizontalPosition?: MatSnackBarHorizontalPosition, 
    verticalPosition?: MatSnackBarVerticalPosition) {
    this.messageSnackBar.open(message, "OK", {
      duration: duration || 5000,
      horizontalPosition: horizontalPosition || 'right',
      panelClass: [ 'message-snackbar' ],
      verticalPosition: verticalPosition || 'bottom'
    });
  }
}
