import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AuthComponent {
  private readonly firebaseService = inject(FirebaseService);

  isLoginMode = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  toggleMode(): void {
    this.isLoginMode.update(v => !v);
    this.errorMessage.set(null);
    this.authForm.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.authForm.invalid) {
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.authForm.value;
    let result;

    if (this.isLoginMode()) {
      result = await this.firebaseService.signInWithEmailPassword({ email: email!, password: password! });
    } else {
      result = await this.firebaseService.signUpWithEmailPassword({ email: email!, password: password! });
    }

    if (typeof result === 'string') {
      this.errorMessage.set(result);
    }
    
    this.isLoading.set(false);
  }
  
  async onGoogleSignIn(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    await this.firebaseService.signInWithGoogle();
    this.isLoading.set(false);
  }
}