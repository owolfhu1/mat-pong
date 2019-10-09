import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  opened = true;
  loading = false;
}

/*
  for deploy:
  ng build --prod --output-path docs --base-href mat-pong
  copy index.html -> 404.html
  git add, commit, push
 */
