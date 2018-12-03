import { Injectable } from '@angular/core';
import { Trip } from './trip';
import { Archive } from './archive';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private trips: Trip[] = [];
  private tripArchive: Archive[] = [];

  constructor(private storage: Storage) {
  }

  save() {
    this.storage.set('trips',this.trips);
    this.storage.set('archive',this.tripArchive);
  }

  getTrips() : Promise<Trip[]> {
    return this.storage.get('trips').then((arr) => {
      this.trips = arr;
      if(this.trips == null) this.trips = [];
      return this.trips;
    });
  }

  getArchive(): Promise<Archive[]> {
    return this.storage.get('archive').then((arr) => {
      if(this.tripArchive == null) this.tripArchive = [];
      else this.tripArchive = arr;
      return this.tripArchive;
    });
  }


  //FAVORITE TRIPS

  //This function adds a trip to our favorites
  add(trip: Trip) {
    this.trips.push(trip);
    this.save();
    console.log("Test");
  }

  //This function Edits a favorite Trip
  edit(trip: Trip, index: number) {
    this.trips[index] = trip;
    this.save();
  }

  //This function deletes a favorite trip
  delete(index: number) {
    this.trips.splice(index,1);
    this.save();
  }

  //ARCHIVING

  //This function clears all archived trips.
  clear() {
    this.storage.set('archive',[]);
  }

  //This function deletes an archive from our history.
  deleteArchive(index: number) {
    this.tripArchive.splice(index,1);
    this.save();
  }

  //This function archives a trip. (Called when we book a trip)
  archive(trip: Trip, lyftTaken: boolean, date: Date) {
    let format = '';
    let currentTime = new Date();
    let dayDifference = date.getDate() - currentTime.getDate();
    if(dayDifference == 0) {
      format = 'Today';
    } else {
      dayDifference + " day(s) ago";
    }
    
    let entry: Archive = {
      trip: trip,
      lyftTaken: lyftTaken,
      time: date,
      timeFormat: format
    }
    this.tripArchive.push(entry);
    this.save();
  }


}
