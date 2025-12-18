import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/login"></ion-back-button>
        </ion-buttons>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="register-container">
        <h1>Create Account</h1>
        <p>Join us to start managing your documents</p>

        <ion-item>
          <ion-label position="floating">Username</ion-label>
          <ion-input type="text" [(ngModel)]="user.username"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input type="email" [(ngModel)]="user.email"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input type="password" [(ngModel)]="user.password"></ion-input>
        </ion-item>

        <ion-button expand="block" (click)="onRegister()" class="ion-margin-top">
          Register
        </ion-button>
      </div>
    </ion-content>
  `,
    styles: [`
    .register-container {
      margin-top: 50px;
      text-align: center;
    }
  `],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule]
})
export class RegisterPage {
    user = { username: '', email: '', password: '' };

    constructor(
        private auth: AuthService,
        private nav: NavController,
        private loading: LoadingController,
        private toast: ToastController
    ) { }

    async onRegister() {
        const loader = await this.loading.create({ message: 'Creating account...' });
        await loader.present();

        this.auth.register(this.user).subscribe({
            next: async () => {
                loader.dismiss();
                const t = await this.toast.create({
                    message: 'Account created! Please login.',
                    duration: 2000,
                    color: 'success'
                });
                t.present();
                this.nav.navigateRoot('/login');
            },
            error: async (err) => {
                loader.dismiss();
                const t = await this.toast.create({
                    message: err.error.error || 'Registration failed',
                    duration: 2000,
                    color: 'danger'
                });
                t.present();
            }
        });
    }
}
