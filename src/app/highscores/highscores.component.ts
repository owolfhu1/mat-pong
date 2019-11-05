import { Component, OnInit } from '@angular/core';
import { URL } from "../../constants";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.css']
})
export class HighscoresComponent implements OnInit {

  allPlayers: MatTableDataSource<Player>;
  seasonPlayers: MatTableDataSource<Player>;
  seasons: Season[] = [];
  season: Season = { id: '', start: 0, end: 0 };

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.fetchAll();
    this.fetchCurrent();
  }

  fetchAll() {
    fetch(URL + 'players/scores?type=rating', {mode: 'cors'}).then(res => res.json())
      .then(result => {
        this.allPlayers = new MatTableDataSource(result);
      });
  }

  fetchCurrent() {
    fetch(URL + 'seasons/current', {mode: 'cors'}).then(res => res.json())
      .then(result => {
        this.seasonPlayers = new MatTableDataSource(result);
      });
    fetch(URL + 'seasons/all', {mode: 'cors'}).then(res => res.json())
      .then(result => {
        this.seasons = result;
        result.forEach(season => {
          if (!season.end) {
            this.season = season;
          }
        });
      });
  }

  formatSeason(s) {
    const start = new Date(s.start).toLocaleDateString();
    const end = s.end ? new Date(s.end).toLocaleDateString() : 'present';
    return `${start} - ${end}`;
  }

  fetchSeason() {
    fetch(URL + `seasons/scores?type=rating&id=${this.season.id}`, {mode: 'cors'}).then(res => res.json())
      .then(result => {
        this.seasonPlayers = new MatTableDataSource(result);
      });
  }

  setSeason(s) {
    this.season = s;
    fetch(URL + `seasons/scores?type=rating&id=${this.season.id}`, {mode: 'cors'}).then(res => res.json())
      .then(result => {
        this.seasonPlayers = new MatTableDataSource(result);
      });
  }

  end() {
    const ref = this.dialog.open(EndSeasonDialog, {
      width: '300px'
    });
    ref.afterClosed().subscribe(x => {
      if (x) this.snackBar.open(x, 'ok');
    });
  }
}

export interface Player {
  username: string;
  rating: number;
  zachRating: number;
  losses: number;
  wins: number;
}

export interface Season {
  id: string;
  start: number;
  end: number;
}

@Component({
  selector: 'end-season-dialog',
  template: `
      <h3>End Season</h3>
      Enter the magic word to end the season. <br>
      <mat-form-field>
          <input matInput type="password" placeholder="magic word" #input>
      </mat-form-field>
      <div>
          <button mat-raised-button color="primary" (click)="end(input.value)" [disabled]="!input.value">end now</button>&nbsp;
          <button mat-raised-button color="warn" (click)="dialogRef.close()">cancel</button>
      </div>
  `,
  styles: [`
      h3 {
          text-align: center;
      }
      div {
          text-align: right;
      }
  `]
})
export class EndSeasonDialog {
  constructor(public dialogRef: MatDialogRef<EndSeasonDialog>) {}
  end(word) {
    fetch(URL + `seasons/end?word=${word}&time=${new Date().getTime()}`, {mode: 'cors'}).then(res => res.text())
      .then(result => this.dialogRef.close(result ? result : 'Something went wrong, you probably entered a bad password.'));

  }
}
