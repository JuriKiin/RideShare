import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  lyftURL: string = ''
  lyftAccessToken: string = '6lAS4nbjgjVj'
  uberAccessToken: string = 'Usx6I4dPzxOs_l4e8Ij-MIR0sSXe6rAQ'


  constructor(private http: HttpClient) { }


  getData(url: string) {
    return this.http.get(url);
  }
  
  callLyft(location: any, destination: any) {
    console.log(location,destination);
    let url = 'https://lyft.com/ride?id=lyft&';
      url += 'pickup[latitude]=' + location.lat + '&pickup[longitude]=' + location.lng;
      url += '&partner=' + this.lyftAccessToken;
      url += '&destination[latitude]=' + destination.lat + '&destination[longitude]=' + destination.lng;

    this.getData(url)
    .subscribe(function(data){return data});
  }

  callUber(location: any, locationName: string, destinationName: string, destination: any) {
    let url = 'https://m.uber.com/ul/?client_id=' + this.uberAccessToken;
      url + '&action=setPickup&pickup[latitude]=' + location.lat + '&pickup[longitude]=' + location.lng;
      url += '&pickup[nickname]=' + locationName;
      url += '&dropoff[latitude]=' + destination.lat + '&dropoff[longitude]=' + destination.lng;
      url += '&dropoff[nickname]=' + destinationName;

    this.getData(url)
    .subscribe(function(data){return data});
  }
  
  callRide(location: string,destination: string, locationName: string, destinationName: string, isLyft: boolean): any {
    let loc,des;
    let that = this;

    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + 
      location + '&key=AIzaSyDmSFZhmNHdayIaH40Ib-S9O23fC-HZbeM').subscribe(function(data: any) {
      loc = data.results[0].geometry.location;

      that.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + 
        destination + '&key=AIzaSyDmSFZhmNHdayIaH40Ib-S9O23fC-HZbeM').subscribe(function(desData: any) {

        des = desData.results[0].geometry.location;
        console.log(loc,des);
        if(isLyft) that.callLyft(loc,des);
        else that.callUber(loc,locationName,destinationName,des);
        return data.results[0].geometry.location;
      });
    });

    console.log(loc,des);

  }

  async getDestination(address: string) {
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + 
      address + '&key=AIzaSyDmSFZhmNHdayIaH40Ib-S9O23fC-HZbeM').subscribe(function(data: any) {
      return data.results[0].geometry.location;
    });
  }



}
