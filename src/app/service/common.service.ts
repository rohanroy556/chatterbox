import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

/**
 * Common Service that can be used to emit messages to the screen.
 */
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loader = false;

  constructor(private messageSnackBar: MatSnackBar) { }

  /**
   * A message snackbar can be displayed with a timeout to the screen.
   * @param message to be displayed
   * @param duration in milliseconds
   * @param horizontalPosition horizontal position of the snackbar on screen
   * @param verticalPosition vertical position of the snackbar on screen
   */
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
