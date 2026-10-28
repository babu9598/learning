import { Router } from 'express';
import { GoogleMapsController } from '../controllers/googleMapsController';

export const googleMapsRouter = Router();

googleMapsRouter.get('/distance', GoogleMapsController.getDrivingDistance);
googleMapsRouter.get('/geocode', GoogleMapsController.geocode);
googleMapsRouter.get('/reverse-geocode', GoogleMapsController.reverseGeocode);
googleMapsRouter.get('/directions', GoogleMapsController.getDirections);
googleMapsRouter.get('/autocomplete', GoogleMapsController.placesAutocomplete);
