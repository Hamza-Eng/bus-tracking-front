import { AfterViewInit, OnInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements AfterViewInit, OnInit {

  marker!: L.Marker;
  location: any;
  corord!: number[];
  retryCount: any;
  ngOnInit(): void {
    this.getLocation()
  }
  private map: any;
  ngAfterViewInit(): void {
    this.initMap();
    this.addAreas();
  }
  getLocation(desiredAccuracy : number  =100) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        
       
        if (position.coords.accuracy>=desiredAccuracy) {
          
          
          // Retry with an increasing delay
          const retryDelay = 1000; // exponential backoff
          setTimeout(() => {
            this.retryCount++;
            this.getLocation(desiredAccuracy);
          }, retryDelay);
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const circle = L.circle([latitude, longitude], {
            radius: position.coords.accuracy, // use the accuracy from the geolocation position
            color: 'blue',
            fillColor: '#C1E9FB',
            fillOpacity: 0.1,
          }).addTo(this.map);
        }
        else{
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.showLocationOnMap(latitude, longitude);
          const circle = L.circle([latitude, longitude], {
            radius: position.coords.accuracy, // use the accuracy from the geolocation position
            color: 'blue',
            fillColor: '#C1E9FB',
            fillOpacity: 0.1,
          }).addTo(this.map);
          console.log(position)
        }
        
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  private addAreas(): void {
    // Define the coordinates for Casablanca and Bouskoura polygons
    const casablancaCoords: L.LatLngExpression[] = [
      [33.622601, -7.657072], // Coordinates for Casablanca polygon vertices
      [33.760287, -7.385160],
      [33.584856, -7.229978],
      [33.445169, -7.373487],
      [33.317308, -7.564375],
      [33.374668, -7.757322],
      [33.358038, -7.801267],

      [33.463502, -7.989408],

    ];

    // Create polygons for Casablanca and Bouskoura
    // const casablancaPolygon = L.polygon(casablancaCoords, { color: 'red' }).addTo(this.map);

    // Zoom the map to show both polygons
    // const polygonsGroup = L.featureGroup([casablancaPolygon]);
    // this.map.fitBounds(casablancaPolygon.getBounds());
  }


  private initMap(): void {
    const coordinates: L.LatLngExpression[] = [
      [33.622601, -7.657072], // Coordinates for Casablanca polygon vertices
      [33.760287, -7.385160],
      [33.584856, -7.229978],
      [33.445169, -7.373487],
      [33.317308, -7.564375],
      [33.374668, -7.757322],
      [33.463502, -7.989408],
      // Add more coordinates as needed
    ];
    var bounds = L.latLngBounds(coordinates);



    this.map = L.map('map', {
      center: [33.593006, -7.608878],
      minZoom: 10,
      // maxZoom:40,
      maxBounds: bounds,
      maxBoundsViscosity: 3.0
    }).setView([33.439726, -7.622525], 11);

    this.map.panInsideBounds(bounds, { animate: false });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; Hamza'
    });


    // L.marker(location[0], location[1]).addTo(this.map)
    //   .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    //   .openPopup();




    tiles.addTo(this.map);
  }
  showLocationOnMap(latitude: number, longitude: number) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([latitude, longitude]).addTo(this.map);
    const icon = L.icon({
      iconUrl: 'assets/position-icon.png',
      iconSize: [32, 32], // Adjust the icon size as needed
      iconAnchor: [16, 32] // Adjust the icon anchor point as needed
    });

    const markerOptions = {
      icon: icon
    };
    this.map.setView([latitude, longitude], 13);
     L.marker([latitude, longitude]).addTo(this.map)
      .bindPopup('my position.')
      .openPopup();
  }
// ==========================================
getMostAccuratePosition(desiredAccuracy: number, markerOptions: any, attempts = 0): void {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position: any) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        if (accuracy <= desiredAccuracy) {
          L.marker([latitude, longitude], markerOptions)
            .addTo(this.map)
            .bindPopup('My Position')
            .openPopup();
          this.map.setView([latitude, longitude], 13);
        } else {
          // Retry with an increasing delay
          const retryDelay = Math.pow(2, attempts) * 1000; // exponential backoff
          setTimeout(() => {
            this.getMostAccuratePosition(desiredAccuracy, markerOptions, attempts + 1);
          }, retryDelay);
        }
      },
      // (error: PositionError) => {
      //   console.log('Geolocation error:', error.message);
      // }
    );
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}
}


