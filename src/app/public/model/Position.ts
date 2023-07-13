import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

declare global {
  interface Position {
    coords: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
  }
  interface PositionError {
    code: number;
    message: string;
  }
}
