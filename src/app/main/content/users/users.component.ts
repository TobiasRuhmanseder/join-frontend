import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interface/user';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  groupedUsers: { [key: string]: User[] } = {};
  selectedUser: User | null = null;
  private userSubscription!: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userSubscription = this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.groupUsersByAlphabet();
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  groupUsersByAlphabet() {
    this.groupedUsers = this.users.reduce((result, user) => {
      const letter = user.first_name.charAt(0).toUpperCase();
      if (!result[letter]) {
        result[letter] = [];
      }
      result[letter].push(user);
      return result;
    }, {} as { [key: string]: User[] });
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }

  isSelected(user: User): boolean {
    return this.selectedUser ? this.selectedUser.id === user.id : false;
  }

  getAlphabet(): string[] {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  }

  getInitials(user: any): string {
    const firstNameInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
    const lastNameInitial = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
    return firstNameInitial + lastNameInitial;
  }
}