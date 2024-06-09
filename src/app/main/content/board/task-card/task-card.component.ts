import { Component, Input, ViewContainerRef } from '@angular/core';
import { GetTask } from '../../../../interface/task';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../../../services/dialog.service';


@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() task!: GetTask;
  @Input() loading: boolean = false;

  constructor(private dialogService: DialogService, private viewContainerRef: ViewContainerRef) { }

  openDialog() {
    this.dialogService.openDialog(this.viewContainerRef, this.task);
  }
}
