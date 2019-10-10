import { Component } from '@angular/core';
import { URL, LOGO_PATH } from '../constants';

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

  constructor() {
    fetch(URL + `players/test`, {mode: 'cors'})
      .then(res => res.text()).then(() => {
        this.loading = false;
      }
    );
  }
}

/*
  for deploy:
  ng build --prod --output-path docs --base-href mat-pong
  copy index.html -> 404.html
  git add, commit, push
 */
