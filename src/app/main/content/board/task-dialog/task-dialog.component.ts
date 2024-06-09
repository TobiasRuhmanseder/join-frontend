import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { take, timer } from 'rxjs';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      state('out', style({ transform: 'translateX(100vw)', opacity: 1 })),
      transition('out => in', [animate('500ms ease-in')]),
      transition('in => out', [animate('500ms ease-out')])
    ])
  ]
})
export class TaskDialogComponent implements OnInit {
  @Input() task: any;
  public slideInOut = 'out';

  ngOnInit() {
    timer(0).pipe(
      take(1)
    ).subscribe(() => {
      this.slideInOut = 'in';
    });
  }

  closeDialog: (() => void) | undefined;

  close() {
    this.slideInOut = 'out';
    timer(300).pipe(
      take(1)
    ).subscribe(() => {
      if (this.closeDialog) {
        this.closeDialog();
      }
    });
  }
}
