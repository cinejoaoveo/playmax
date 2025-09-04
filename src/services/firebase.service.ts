import { Injectable, signal, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth,
} from 'firebase/auth';
import { AuthCredential } from '../models/media.model';

const firebaseConfig = {
  apiKey: "AIzaSyA1ekfeDxqE03lpAQcc1zN-QmsBtIktG44",
  authDomain: "playmaxk.firebaseapp.com",
  projectId: "playmaxk",
  storageBucket: "playmaxk.appspot.com",
  messagingSenderId: "459657528568",
  appId: "1:459657528568:web:afc17a0aebcbf19ecb670d"
};

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);

  private auth: Auth;
  currentUser = signal<User | null>(null);

  constructor() {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    this.auth = getAuth();

    onAuthStateChanged(this.auth, user => {
      this.ngZone.run(() => {
        this.currentUser.set(user);
        if (user) {
          // console.log('User is signed in:', user);
        } else {
          // console.log('User is signed out.');
        }
      });
    });
  }

  async signInWithGoogle(): Promise<User | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      this.router.navigate(['/home']);
      return result.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return null;
    }
  }

  async signUpWithEmailPassword({ email, password }: AuthCredential): Promise<User | string> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/home']);
      return userCredential.user;
    } catch (error: any) {
      return this.getFirebaseErrorMessage(error.code);
    }
  }

  async signInWithEmailPassword({ email, password }: AuthCredential): Promise<User | string> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
       this.router.navigate(['/home']);
      return userCredential.user;
    } catch (error: any) {
      return this.getFirebaseErrorMessage(error.code);
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/home']);
  }

  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'O formato do e-mail é inválido.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
         return 'E-mail ou senha incorretos.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está em uso.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      default:
        return 'Ocorreu um erro. Tente novamente.';
    }
  }
}