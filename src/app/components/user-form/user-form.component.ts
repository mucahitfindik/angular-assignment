// src/app/components/user-form/user-form.component.ts

import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { User } from '../../models/user.model'
import { UserService } from '../../services/user-service.service'
import { CommonModule } from '@angular/common'
import {combineLatest, startWith} from "rxjs";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup
  loading = false;
  error: string | null = null;
  full_name: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email /*Validators.pattern(/^[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/)*/]],
      time:[''],
    })
  }

  ngOnInit() {
    this.loadUserData()
    combineLatest([
      this.userForm.get('first_name')!.valueChanges.pipe(startWith(this.userForm.get('first_name')!.value)),
      this.userForm.get('last_name')!.valueChanges.pipe(startWith(this.userForm.get('last_name')!.value))]
    ).subscribe(([first, last]) => {
      this.full_name = `${first} ${last}`
    });
  }

  loadUserData() {
    this.loading = true
    this.userService.getUser()
      .subscribe({
        next: (user) => {
          this.userForm.patchValue(user)
          this.loading = false
        },
        error: () => {
          this.error = 'Failed to load user data'
          this.loading = false
        }
      })
  }

  onSave() {
    if (this.userForm.valid) {
      this.userService.updateUser(this.userForm.value as User)
        .subscribe({
          next: () => alert('User updated successfully'),
          error: () => alert('Error updating user')
        })
    }
  }

  // Error handling methods for the form fields
  getErrorMessage(controlName: string): string | null {
    const control = this.userForm.get(controlName)
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'This field is required'
      } else if (control.errors['email']) {
        return 'Enter a valid email'
      } else if(control.errors['min']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be greater than 0`
      }/* else if (control.errors['pattern'] && controlName === 'email') {
        return 'Enter a valid email'
      }*/
    }
    return null
  }
}
