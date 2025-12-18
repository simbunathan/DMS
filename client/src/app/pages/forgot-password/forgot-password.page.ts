import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/login"></ion-back-button>
        </ion-buttons>
        <ion-title>Forgot Password</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="forgot-container" *ngIf="!otpSent">
        <h1>Forgot Password</h1>
        <p>Enter your email to receive an OTP</p>

        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input type="email" [(ngModel)]="email"></ion-input>
        </ion-item>

        <ion-button expand="block" (click)="sendOTP()" class="ion-margin-top">
          Send OTP
        </ion-button>
      </div>

      <div class="reset-container" *ngIf="otpSent">
        <h1>Verify OTP</h1>
        <p>Enter the 6-digit code and your new password</p>

        <ion-item>
          <ion-label position="floating">OTP</ion-label>
          <ion-input type="text" [(ngModel)]="resetData.otp"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">New Password</ion-label>
          <ion-input type="password" [(ngModel)]="resetData.newPassword"></ion-input>
        </ion-item>

        <ion-button expand="block" (click)="onReset()" class="ion-margin-top">
          Reset Password
        </ion-button>
      </div>
    </ion-content>
  `,
    styles: [`
    .forgot-container, .reset-container {
      margin-top: 50px;
      text-align: center;
    }
  `],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule]
})
export class ForgotPasswordPage {
    email = '';
    otpSent = false;
    resetData = { otp: '', newPassword: '' };

    constructor(
        private auth: AuthService,
        private nav: NavController,
        private loading: LoadingController,
        private toast: ToastController
    ) { }

    async sendOTP() {
        const loader = await this.loading.create({ message: 'Sending OTP...' });
        await loader.present();

        this.auth.forgotPassword(this.email).subscribe({
            next: () => {
                loader.dismiss();
                this.otpSent = true;
            },
            error: async (err) => {
                loader.dismiss();
                const t = await this.toast.create({
                    message: err.error.message || 'Error occurred',
                    duration: 2000,
                    color: 'danger'
                });
                t.present();
            }
        });
    }

    async onReset() {
        const loader = await this.loading.create({ message: 'Resetting password...' });
        await loader.present();

        this.auth.resetPassword({ email: this.email, ...this.resetData }).subscribe({
            next: async () => {
                loader.dismiss();
                const t = await this.toast.create({
                    message: 'Password reset successful!',
                    duration: 2000,
                    color: 'success'
                });
                t.present();
                this.nav.navigateRoot('/login');
            },
            error: async (err) => {
                loader.dismiss();
                const t = await this.toast.create({
                    message: err.error.message || 'Reset failed',
                    duration: 2000,
                    color: 'danger'
                });
                t.present();
            }
        });
    }
}
