import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RegisterComponent } from './register/register.component';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import { RecordComponent } from './record/record.component';
import {MatSelectModule} from "@angular/material/select";
import { ScoreChartComponent } from './score-chart/score-chart.component';
import { LookupComponent } from './lookup/lookup.component';
import {MatMenuModule} from "@angular/material/menu";
import { SeasonsComponent } from './seasons/seasons.component';
import { HighscoresComponent } from './highscores/highscores.component';
import { ExpectationsComponent } from './expectations/expectations.component';
import { ScoreTableComponent } from './shared/score-table/score-table.component';
import {MatTableModule} from "@angular/material/table";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    RecordComponent,
    ScoreChartComponent,
    LookupComponent,
    SeasonsComponent,
    HighscoresComponent,
    ExpectationsComponent,
    ScoreTableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatTabsModule,
    MatExpansionModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    MatTableModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
