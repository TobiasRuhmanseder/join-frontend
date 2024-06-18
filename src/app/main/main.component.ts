import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';






@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SidemenuComponent, HeaderMenuComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  constructor() { }

}
