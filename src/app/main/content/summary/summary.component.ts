import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {

  constructor(private router: Router, private userService: UserService, private taskService: TaskService) { }


  ngOnInit(): void {
    this.subUser();
  }

  subUser() {
    this.userService.getCurrentUser().subscribe(currentUser => {
      console.log(currentUser);

    }
    )
  }

  navigateToBoard() {
    this.router.navigateByUrl('main/board');
  }
}
