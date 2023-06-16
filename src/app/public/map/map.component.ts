import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements AfterViewInit {
  private map:any;
   ngAfterViewInit(): void {
    this.initMap();
    this.addAreas()
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
    const casablancaPolygon = L.polygon(casablancaCoords, { color: 'red' }).addTo(this.map);
    
    // Zoom the map to show both polygons
    const polygonsGroup = L.featureGroup([casablancaPolygon]);
    this.map.fitBounds(casablancaPolygon.getBounds());
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
    var southWest = L.latLng(33.561399, -7.628533); // Example coordinates for the southwest corner
    var northEast = L.latLng(33.561399, -7.628533); // Example coordinates for the northeast corner
    var bounds = L.latLngBounds(coordinates);
    // var bounds = L.latLngBounds(southWest, northEast);
   
   
    this.map = L.map('map', {
      center: [33.593006, -7.608878],
      minZoom:10,
      // maxZoom:40,
      maxBounds: bounds,
      maxBoundsViscosity: 3.0
    }).setView([33.439726, -7.622525],11);
    
    this.map.panInsideBounds(bounds, { animate: false });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; Hamza'
    });
    
  //   var greenIcon = L.icon({
  //     iconUrl: 'leaf-green.png',
  //     shadowUrl: 'leaf-shadow.png',
  
  //     iconSize:     [38, 95], // size of the icon
  //     shadowSize:   [50, 64], // size of the shadow
  //     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  //     shadowAnchor: [4, 62],  // the same for the shadow
  //     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  // });
  L.marker([33.563402, -7.690374]).addTo(this.map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();
  
    L.marker([33.559683, -7.736036]).addTo(this.map)
    .bindPopup('300 bus',{
      closeOnClick: false,
      autoClose: false
    })
    
    .openPopup();

    tiles.addTo(this.map);
  }

}
