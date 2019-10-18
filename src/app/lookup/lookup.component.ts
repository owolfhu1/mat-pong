import { Component, Inject, OnInit } from '@angular/core';
import { URL } from "../../constants";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent implements OnInit {
  displayedColumns = ['playerOne', 'playerTwo', 'date', 'edit'];
  dataSource: GameRecord[] = [];
  rawData: GameRecord[] = [];

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    fetch(URL + 'players/list', {mode: 'cors'})
      .then(res => res.json())
      .then(result => this.names = result);
  }

  getAll() {
    fetch(URL + 'games/all', {mode: 'cors'}).then(res => res.json())
      .then(result => {
        this.rawData = result;
        this.setFromAndTo();
        this.takeGames();
      });
  }

  getPlayerOne() {
    fetch(URL + 'games/player?player=' + this.playerOne, {mode: 'cors'}).then(res => res.json())
      .then(result => {
        this.rawData = result;
        this.setFromAndTo();
        this.takeGames();
      });
  }

  getVs() {
    fetch(URL + `games/vs?playerOne=${this.playerOne}&playerTwo=${this.playerTwo}`, {mode: 'cors'})
      .then(res => res.json())
      .then(result => {
        this.rawData = result;
        this.setFromAndTo();
        this.takeGames();
      });
  }

  setFromAndTo() {
    if (this.rawData && this.rawData.length) {
      this.fromDate = this.fromDate ? this.fromDate : new Date(this.rawData[0].time - 1).toISOString();
      this.toDate = this.toDate ? this.toDate : new Date(this.rawData[this.rawData.length -1].time).toISOString();
    }
  }

  takeGames() {
    this.dataSource = [];
    if (!this.fromDate && !this.toDate) {
      this.dataSource = this.rawData;
    } else {
      const fromDate = this.fromDate ? new Date(this.fromDate).getTime() : null;
      const toDate = this.toDate ? new Date(this.toDate).getTime() + 86400000 : null;
      this.rawData.forEach(x => {
        const time = x.time;
        if (
          (!fromDate || fromDate && time > fromDate) &&
          (!toDate || toDate && time < toDate)
        ) {
          this.dataSource.push(x);
        }
      });
    }
  }

  formatTime(time) {
    return new Date(time).toLocaleDateString() + ' at ' + new Date(time).toLocaleTimeString();
  }

  names = [];
  playerOne;
  playerTwo;
  fromDate;
  toDate;

  reset() {
    this.playerOne = null;
    this.playerTwo = null;
    this.fromDate = null;
    this.toDate = null;
    this.dataSource = [];
  }

  editGame(game: GameRecord) {
    const ref = this.dialog.open(GameEditDialog, {
      width: '300px',
      data: game,
    });
    ref.afterClosed().subscribe(x => {
      if (x) this.snackBar.open(x, 'ok');
    });
  }

  history(data: GameRecord) {
    const ref = this.dialog.open(GameHistDialog, { data });
    ref.afterClosed().subscribe(x => {
      if (x) this.snackBar.open(x, 'ok');
    });
  }
}

@Component({
  selector: 'game-hist-dialog',
  template: `

      <h3>Edit History</h3>
    
      <mat-card class="bottom-margin" *ngFor="let game of data.history; let i = index">
          <span [ngClass]="{'win': game.scoreOne > game.scoreTwo}">
              {{ game.playerOne }} ({{ game.scoreOne }})
          </span>
          &nbsp;vs&nbsp;
          <span [ngClass]="{'win': game.scoreOne < game.scoreTwo}">
              {{ game.playerTwo }} ({{ game.scoreTwo }})
          </span>
          &nbsp;
          <button mat-icon-button mat-raised-button (click)="revert(i)" matTooltip="Revert to this data">
              <mat-icon>restore</mat-icon>
          </button>
      </mat-card>
      
      <br>
      
      <div class="right">
          <button mat-raised-button color="warn" (click)="dialogRef.close()">close</button>
      </div>
    
  `,
  styleUrls: ['./lookup.component.css']
})
export class GameHistDialog {
  constructor(
    public dialogRef: MatDialogRef<GameHistDialog>,
    @Inject(MAT_DIALOG_DATA) public data: GameRecord
  ) {}

  revert(index) {
    const revertTo = this.data.history[index];
    fetch(URL + `games/update?playerOne=${revertTo.playerOne}&playerTwo=${revertTo.playerTwo
    }&scoreOne=${revertTo.scoreOne}&scoreTwo=${revertTo.scoreTwo}&time=${revertTo.time}`,{mode: 'cors'})
      .then(res => res.text()).then(x => {
      this.dialogRef.close(x);
    });
  }
}

@Component({
  selector: 'game-edit-dialog',
  template: `
      <h3>Edit Game</h3>
    
      <mat-form-field class="player">
          <mat-label>player one</mat-label>
          <mat-select [(value)]="editedData.playerOne">
              <mat-option *ngFor="let name of names" [value]="name">{{ name }}</mat-option>
          </mat-select>
      </mat-form-field>

      &nbsp;

      <mat-form-field class="score">
          <input matInput type="number" placeholder="score" [min]="0" [(ngModel)]="editedData.scoreOne">
      </mat-form-field>

      <mat-form-field class="player">
          <mat-label>player two</mat-label>
          <mat-select [(value)]="editedData.playerTwo">
              <mat-option *ngFor="let name of names" [value]="name">{{ name }}</mat-option>
          </mat-select>
      </mat-form-field>

      &nbsp;

      <mat-form-field class="score">
          <input matInput type="number" placeholder="score" [min]="0" [(ngModel)]="editedData.scoreTwo">
      </mat-form-field>


      <div class="buttons">
          <button mat-raised-button color="primary" [disabled]="!isEdited" (click)="submit()">submit</button>
          &nbsp;
          <button mat-raised-button color="warn" (click)="cancel()">cancel</button>
      </div>
  `,
  styles: [`      
      .buttons {
          text-align: right;
      }
      .player {
          width: 170px;
      }
      .score {
          width: 70px;
      }
      h3 {
          text-align: center;
      }
  `]
})
export class GameEditDialog {
  editedData: GameRecord;
  names = [];

  constructor(
    public dialogRef: MatDialogRef<GameEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: GameRecord
  ) {
    this.editedData = { ...data };
    fetch(URL + 'players/list', {mode: 'cors'})
      .then(res => res.json())
      .then(result => this.names = result);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  get isEdited(): boolean {
    let x = false;
    Object.keys(this.data).forEach(key => {
      if (this.data[key] !== this.editedData[key]) {
        x = true;
      }
    });
    return x;
  }

  submit() {
    fetch(URL + `games/update?playerOne=${this.editedData.playerOne}&playerTwo=${this.editedData.playerTwo
    }&scoreOne=${this.editedData.scoreOne}&scoreTwo=${this.editedData.scoreTwo}&time=${this.editedData.time}`,{mode: 'cors'})
      .then(res => res.text()).then(x => {
        this.dialogRef.close(x);
    });
  }
}

interface GameRecord {
  playerOne: string;
  playerTwo: string;
  scoreOne: number;
  scoreTwo: number;
  time: number;
  history: GameRecord[];
}
