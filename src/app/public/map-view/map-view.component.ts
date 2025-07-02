import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  private circle?: L.Circle;
  private readonly defaultCoords: L.LatLngExpression = [34.020882, -6.841650]; // Rabat, Morocco
  private readonly defaultZoom = 13;

  ngOnInit(): void {
    // No-op, move map init to ngAfterViewInit for DOM readiness
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.watchLocation();
  }

  /**
   * Initialize the Leaflet map with default settings.
   */
  private initMap(): void {
    this.map = L.map('map', {
      center: this.defaultCoords,
      zoom: this.defaultZoom,
      zoomControl: true,
      attributionControl: true
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  /**
   * Watch the user's geolocation and update the map in real-time.
   */
  private watchLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.map.setView([latitude, longitude], this.defaultZoom);
        if (this.circle) {
          this.circle.setLatLng([latitude, longitude]);
        } else {
          this.circle = L.circle([latitude, longitude], {
            color: 'blue',
            fillColor: '#30f',
            fillOpacity: 0.5,
            radius: 8
          }).addTo(this.map);
          this.circle.bindTooltip('You', {
            permanent: true,
            className: 'circle-tooltip',
            direction: 'center',
            offset: [0, 0]
          }).openTooltip();
        }
      },
      (error) => {
        alert('Error getting location: ' + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }
}
