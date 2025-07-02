import { AfterViewInit, OnInit, Component } from '@angular/core';
import * as L from 'leaflet';

interface Bus {
  id: string;
  name: string;
  position: L.LatLngExpression;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  private circle?: L.Circle;
  private busMarkers: L.Marker[] = [];
  private readonly defaultCoords: L.LatLngExpression = [34.020882, -6.841650]; // Rabat, Morocco
  private readonly defaultZoom = 13;

  // Example static bus data; replace with API data as needed
  buses: Bus[] = [
    { id: 'bus1', name: 'Bus 1', position: [34.025, -6.84] },
    { id: 'bus2', name: 'Bus 2', position: [34.018, -6.85] },
    { id: 'bus3', name: 'Bus 3', position: [34.022, -6.845] }
  ];

  ngOnInit(): void {
    // Nothing here, move map init to ngAfterViewInit for DOM readiness
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.watchLocation();
    this.showBuses();
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
   * Show all buses as markers on the map.
   */
  private showBuses(): void {
    // Remove old markers
    this.busMarkers.forEach(marker => this.map.removeLayer(marker));
    this.busMarkers = [];
    // Add new markers
    this.buses.forEach(bus => {
      const marker = L.marker(bus.position, {
        icon: L.icon({
          iconUrl: 'assets/position-icon.png', // Use your bus icon here
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      }).addTo(this.map);
      marker.bindPopup(`<b>${bus.name}</b>`);
      this.busMarkers.push(marker);
    });
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
            color: 'red',
            fillColor: '#f03',
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


