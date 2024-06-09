import { Injectable, ComponentRef, ViewContainerRef, EnvironmentInjector } from '@angular/core';
import { TaskDialogComponent } from '../main/content/board/task-dialog/task-dialog.component';
import { take, timer } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogRef: ComponentRef<TaskDialogComponent> | null = null;

  constructor(private environmentInjector: EnvironmentInjector) { }

  openDialog(viewContainerRef: ViewContainerRef, taskData: any) {
    if (this.dialogRef) return;
    this.dialogRef = viewContainerRef.createComponent(TaskDialogComponent, {
      environmentInjector: this.environmentInjector
    });
    this.dialogRef.instance.task = taskData;
    document.body.appendChild(this.dialogRef.location.nativeElement);
    this.dialogRef.instance.closeDialog = () => {
      this.closeDialog();
    };
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.instance.slideInOut = 'out';
      timer(10).pipe(
        take(1)
      ).subscribe(() => {
        if (this.dialogRef) {
          document.body.removeChild(this.dialogRef.location.nativeElement);
          this.dialogRef.destroy();
          this.dialogRef = null;
        }
      });
    }
  }
}
