
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  private map!: L.Map;
  private circle!: L.Circle;

  ngOnInit(): void {
    // Initialize the map
    this.map = L.map('map'); // Default view set to Rabat, Morocco
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Watch the device's location in real-time
   
    //   while (this.watchLocation()>10) {
    //     if (this.watchLocation()>10) {
    //     this.watchLocation();
    //     setTimeout(() => {
    //       // Code to execute after the delay
    //     }, 500);
    //   }
    //   else{
    //     break
    //   }
    // }
    this.watchLocation();
  }


  private watchLocation(): void {
    if (navigator.geolocation) {
      
      navigator.geolocation.watchPosition(
        (position) => {
          console.log(position);  
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Update the map view to the current location
          this.map.setView([latitude, longitude], 12);

          // Update or create a red circle at the current location
          if (this.circle) {
            this.circle.setLatLng([latitude, longitude]);
          } else {
            this.circle = L.circle([latitude, longitude], {
              color: 'red',      // Set the color of the circle to red
              fillColor: '#f03', // Set the fill color
              fillOpacity: 0.5,  // Set the fill opacity
              radius: 2,        // Set the radius (in meters)
              
            }).addTo(this.map);

            this.circle.bindTooltip('8', {
              permanent: true,
              className: 'circle-tooltip', // Add custom styling if needed
              direction: 'center',
              offset: [0, 0]
            }).openTooltip();
          }
          // return position.coords.accuracy;
        },
        (error) => {
          console.error('Error getting location', error);
        },
        {
          enableHighAccuracy: true,timeout:200
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  
}
