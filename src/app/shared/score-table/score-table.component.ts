import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Player } from "../../highscores/highscores.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.css']
})
export class ScoreTableComponent implements OnInit, OnChanges {
  @Input() data: MatTableDataSource<Player>;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['username', 'rating', 'zachRating', 'wins', 'losses', 'win%'];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.data)
      this.data.sort = this.sort;
  }

  round(number) {
    const roundUp = ['5', '6', '7', '8', '9'];
    number = number + '';
    const split = number.split('.');
    let result = split[0] * 1;
    if (split.length > 1) {
      const firstDecimal = split[1].substring(0, 1);
      if (roundUp.includes(firstDecimal)) {
        result++;
      }
    }
    return result;
  }

  winPercent(player) {
    const wins = player.wins;
    const total = player.wins + player.losses;
    const result = wins / total * 100;
    return this.round(result) + '%';
  }
}
