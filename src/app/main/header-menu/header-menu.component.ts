import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CurrentUserService } from '../../services/current-user.service';
import { take } from 'rxjs';
import { User } from '../../interface/user';



@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss'
})
export class HeaderMenuComponent implements OnInit {
  currentUser: User | null = null;
  initials: string = '';
  isDropdownOpen = false;

  constructor(private router: Router, private authService: AuthService, private currentUserService: CurrentUserService) { }

  ngOnInit(): void {
    this.subCurrentUser();
  }

  subCurrentUser() {
    this.currentUserService.currentUser$.pipe(take(1)).subscribe(currentUser => {
      this.currentUser = currentUser;
      this.initials = this.getInitials(currentUser);
    }
    )
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.circle') && !target.closest('.dropdown-menu')) {
      this.closeDropdown();
    }
  }

  logout(event: MouseEvent) {
    event.stopPropagation();
    this.authService.logout();
  }

  navigateToPrivacyPolicy(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigateByUrl('main/privacy_policy')
    this.closeDropdown();
  }

  navigateToLegalNotice(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigateByUrl('main/legal_notice');
    this.closeDropdown();
  }


  getInitials(user: any): string {
    const firstNameInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
    const lastNameInitial = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
    return firstNameInitial + lastNameInitial;
  }


}
