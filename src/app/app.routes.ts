import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SummaryComponent } from './main/content/summary/summary.component';
import { AddTaskComponent } from './main/content/add-task/add-task.component';
import { BoardComponent } from './main/content/board/board.component';
import { UsersComponent } from './main/content/users/users.component';
import { PrivacyPolicyComponent } from './main/content/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './main/content/legal-notice/legal-notice.component';
import { EditTaskComponent } from './main/content/edit-task/edit-task.component';
import { CurrentUserResolver } from './resolvers/current-user.resolver';
import { PrivacyPolicySignupComponent } from './login/privacy-policy-signup/privacy-policy-signup.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'privacy_policy', component: PrivacyPolicySignupComponent },
  { path: 'main', redirectTo: '/main/summary', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'main', component: MainComponent, resolve: { CurrentUserResolver }, children: [
      { path: 'summary', component: SummaryComponent },
      { path: 'addtask', component: AddTaskComponent },
      { path: 'board', component: BoardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'privacy_policy', component: PrivacyPolicyComponent },
      { path: 'legal_notice', component: LegalNoticeComponent },
      { path: 'edit_task/:id', component: EditTaskComponent },
    ]
  },
  { path: '**', redirectTo: '/login' }
];
