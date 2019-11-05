import { Component } from '@angular/core';
import { URL, LOGO_PATH } from '../constants';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  opened = true;
  loading = true;
  image = LOGO_PATH;
  showImage = true;
  username;

  constructor(public dialog: MatDialog) {
    fetch(URL + `players/test`, {mode: 'cors'})
      .then(res => res.text()).then(() => {
        this.loading = false;
        this.promptLogin();
      }
    );
  }

  promptLogin() {
    this.username = null;
    const ref = this.dialog.open(LoginDialog, { disableClose: true });
    ref.afterClosed().subscribe(x => {
      this.username = x;
    })
  }

  toggle() {
    this.opened = !this.opened;
  }
}


@Component({
  selector: 'login-dialog',
  template: `
      <mat-accordion>
          <mat-expansion-panel hideToggle expanded>
              <mat-expansion-panel-header>
                  <mat-panel-title>Login</mat-panel-title>

                  <mat-icon>account_circle</mat-icon>
              </mat-expansion-panel-header>

              <app-login (success)="dialogRef.close($event)"></app-login>
          </mat-expansion-panel>

          <mat-expansion-panel hideToggle>
              <mat-expansion-panel-header>
                  <mat-panel-title>Register New User</mat-panel-title>

                  <mat-icon>person_add</mat-icon>
              </mat-expansion-panel-header>

              <app-register></app-register>
          </mat-expansion-panel>
      </mat-accordion>
  `
})
export class LoginDialog {
  username;
  password;

  constructor(public dialogRef: MatDialogRef<LoginDialog>) {}
}


/*
  for deploy:
  ng build --prod --output-path docs --base-href mat-pong
  copy index.html -> 404.html
  git add, commit, push
 */
