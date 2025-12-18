import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { DocService } from '../../services/doc.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>My Documents</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon name="log-out-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="fileInput.click()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <input type="file" #fileInput style="display: none" (change)="onFileSelected($event)">

      <ion-searchbar (ionInput)="handleSearch($event)"></ion-searchbar>

      <ion-list>
        <ion-item-sliding *ngFor="let doc of filteredDocs">
          <ion-item>
            <ion-icon slot="start" [name]="getIcon(doc.type)"></ion-icon>
            <ion-label>
              <h2>{{ doc.name }}</h2>
              <p>{{ doc.uploadDate | date:'medium' }}</p>
            </ion-label>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="deleteDoc(doc._id)">
              <ion-icon slot="icon-only" name="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div *ngIf="filteredDocs.length === 0" class="ion-text-center ion-padding">
        <p>No documents found.</p>
      </div>
    </ion-content>
  `,
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class DashboardPage implements OnInit {
    docs: any[] = [];
    filteredDocs: any[] = [];

    constructor(
        private docService: DocService,
        private auth: AuthService,
        private nav: NavController,
        private loading: LoadingController,
        private alert: AlertController,
        private toast: ToastController
    ) { }

    ngOnInit() {
        this.loadDocuments();
    }

    async loadDocuments() {
        const loader = await this.loading.create({ message: 'Loading docs...' });
        await loader.present();
        this.docService.getDocuments().subscribe({
            next: (data) => {
                this.docs = data;
                this.filteredDocs = data;
                loader.dismiss();
            },
            error: () => loader.dismiss()
        });
    }

    handleSearch(event: any) {
        const query = event.target.value.toLowerCase();
        this.filteredDocs = this.docs.filter(d => d.name.toLowerCase().includes(query));
    }

    async onFileSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        const loader = await this.loading.create({ message: 'Uploading...' });
        await loader.present();

        const formData = new FormData();
        formData.append('document', file);
        formData.append('name', file.name);

        this.docService.uploadDocument(formData).subscribe({
            next: () => {
                loader.dismiss();
                this.loadDocuments();
            },
            error: () => loader.dismiss()
        });
    }

    async deleteDoc(id: string) {
        this.docService.deleteDocument(id).subscribe({
            next: () => this.loadDocuments()
        });
    }

    getIcon(type: string) {
        if (type.includes('pdf')) return 'document-text-outline';
        if (type.includes('image')) return 'image-outline';
        return 'document-outline';
    }

    logout() {
        this.auth.logout();
        this.nav.navigateRoot('/login');
    }
}
