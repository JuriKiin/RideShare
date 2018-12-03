import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, ItemSliding, ToastController} from '@ionic/angular';
import { TripService } from '../trip.service'
import { ApiService } from '../api.service'
import { Trip } from '../trip';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

  trips: Trip[] = [];
  map: GoogleMap;

  constructor(public tripService: TripService, public apiService: ApiService, public alertController: AlertController, private _ngZone: NgZone, public toastController: ToastController) {
  }

  ngOnInit() {
    this.tripService.getTrips().then((tripArr) => this.trips = tripArr);
    this.setPrices();
  }


  //API FUNCTIONS

  //This function calls the Lyft and Uber API and returns data that we display to the user.
  setPrices() {
    // for(let i = 0; i < this.trips.length; i++) {
    //   //Make API Call From Service

    //   //Set Object Value
    //   this.trips[i].lyftPrice = lyftData.price;
    //   this.trips[i].uberPrice = uberData.price;
    // }
  }
  //This function calls Lyft API for a ride
  async orderLyft(trip: Trip) {
    //Display Popup

    this.apiService.callRide(trip.location,trip.destination,trip.locationName,trip.destinationName,true);

    //this.apiService.callLyft(loc,des);
    //this.tripService.archive(trip,true,new Date());
  }

  //This function calls Uber API for a ride
  async orderUber(trip: Trip) {
    //Display Popup
    this.apiService.callRide(trip.location,trip.destination,trip.locationName,trip.destinationName,false);
  }

  //LIST ITEM FUNCTIONS

  //Delete a favorited Trip from our list
  delete(itemSliding: ItemSliding, index: number) {
    itemSliding.close().then(() => this.tripService.delete(index));
    this.presentToastWithOptions("Trip Deleted!");
  }

  //This function edits an item currently in the favorites
  async edit(item: ItemSliding, index: number) {
    const editTodoAlert = await this.alertController.create(
        {
            header: 'Edit Task',
            inputs: [
                {
                  type: 'text',
                  name: 'locationName',
                  value: this.trips[index].locationName
                },
                {
                  type: 'text',
                  name: 'destinationName',
                  value: this.trips[index].destinationName
                },
                {
                    type: 'text',
                    name: 'location',
                    value: this.trips[index].location
                },
                {
                  type: 'text',
                  name: 'destination',
                  value: this.trips[index].destination
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {item.close();}
                }, {
                    text: 'Update',
                    handler: (inputData) => {
                        if (inputData.locationName && inputData.destinationName && inputData.location && inputData.destination) {
                          let trip: Trip = {
                            locationName: inputData.locationName,
                            destinationName: inputData.destinationName,
                            location: inputData.location,
                            destination: inputData.destination,
                            lyftPrice: '--',
                            uberPrice: '--'
                          }
                          this._ngZone.run(() => {
                            this.tripService.edit(trip,index);
                            this.presentToastWithOptions("Trip Changed!");
                          });
                        } else {}
                        item.close();
                        return;
                    }
                }
            ]
        });
    await editTodoAlert.present();
  }

  //This function adds an item to the favorites
  async add() {
    const addTrip = await this.alertController.create(
        {
            header: 'Add Trip',
            inputs: [
              {
                type: 'text',
                name: 'locationName',
                placeholder: 'Location Name'
              },
              {
                type: 'text',
                name: 'destinationName',
                placeholder: 'Destination Name'
              },
              {
                  type: 'text',
                  name: 'location',
                  placeholder: 'Location Address'
              },
              {
                type: 'text',
                name: 'destination',
                placeholder: 'Destination Address'
              }
          ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {}
                }, {
                    text: 'Create',
                    handler: (inputData) => {
                        let trip;
                        if (inputData.locationName && inputData.destinationName && inputData.location && inputData.destination) {
                          let trip: Trip = {
                            locationName: inputData.locationName,
                            destinationName: inputData.destinationName,
                            location: inputData.location,
                            destination: inputData.destination,
                            lyftPrice: '--',
                            uberPrice: '--'
                          }
                          this._ngZone.run(() => {
                            this.tripService.add(trip);
                            this.presentToastWithOptions("Trip Added!");
                          });
                        } else {}
                        return trip;
                    }
                }
            ]
        });
    await addTrip.present();
  }

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





  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
