import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-container">
        <h1>Welcome Back</h1>
        <p>Login to manage your documents</p>

        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input type="email" [(ngModel)]="credentials.email"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input type="password" [(ngModel)]="credentials.password"></ion-input>
        </ion-item>

        <ion-button expand="block" (click)="onLogin()" class="ion-margin-top">
          Login
        </ion-button>

        <ion-button expand="block" fill="clear" (click)="goToForgot()">
          Forgot Password?
        </ion-button>

        <ion-button expand="block" fill="clear" (click)="goToRegister()">
          Don't have an account? Register
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-container {
      margin-top: 50px;
      text-align: center;
    }
    h1 { font-weight: bold; }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginPage {
  credentials = { email: '', password: '' };

  constructor(
    private auth: AuthService,
    private nav: NavController,
    private loading: LoadingController,
    private toast: ToastController
  ) { }

  async onLogin() {
    const loader = await this.loading.create({ message: 'Logging in...' });
    await loader.present();

    this.auth.login(this.credentials).subscribe({
      next: () => {
        loader.dismiss();
        this.nav.navigateRoot('/dashboard');
      },
      error: async (err) => {
        loader.dismiss();
        const t = await this.toast.create({
          message: err.error.message || 'Login failed',
          duration: 2000,
          color: 'danger'
        });
        t.present();
      }
    });
  }

  goToRegister() {
    this.nav.navigateForward('/register');
  }

  goToForgot() {
    this.nav.navigateForward('/forgot-password');
  }
}
