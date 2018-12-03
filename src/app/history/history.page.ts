import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, ItemSliding, ToastController} from '@ionic/angular';
import { TripService } from '../trip.service'
import { Archive } from '../archive';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  history: Archive[] = [];

  constructor(public tripService: TripService, public alertController: AlertController, private _ngZone: NgZone, public toastController: ToastController) {
  }

  ngOnInit() {
    this.tripService.getArchive().then((arr) => this.history = arr);
    if(this.history == null || this.history == undefined) this.history = [];
  }

  //This function deletes the current archive
  delete(item:ItemSliding, index: number) {
    this.history = [];  //REMOVE THIS WHEN SERVICE IS WORKING
    item.close().then(()=> this.tripService.deleteArchive(index));
  }

  //This function clears the trip history
  async clear() {
      const clearPrompt = await this.alertController.create(
          {
              header: 'Are you sure you want to clear the Trip History?',
              buttons: [
                  {
                      text: 'No',
                      role: 'cancel',
                      handler: () => {}
                  }, {
                      text: "Yes, I'm sure!",
                      handler: () => {
                        this.tripService.clear();
                        this.history = [];
                        this.presentToastWithOptions("Trip History Cleared");
                      }
                  }
              ]
          });
      await clearPrompt.present();
  }

  //This function handles the toasts that are displayed.
  async presentToastWithOptions(message: string) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Close',
      color: 'success',
      duration: 1000
    });
    toast.present();
  }

}
