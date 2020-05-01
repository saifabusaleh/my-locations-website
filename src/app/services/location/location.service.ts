import { LocationResponse, LocationStatusEnum } from '@models/location-response';
import { Injectable } from '@angular/core';
import { AppLocation } from '@models/location';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { UtilsService } from '@services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private localStorageService: LocalStorageService,
              private utilsService: UtilsService) {
  }

  public getLocations(): LocationResponse {
    const locationResponse = new LocationResponse();
    const locationsMap: Map<string, AppLocation> = this.localStorageService.getLocations();
    const locationsArr = this.utilsService.convertFromMapToArrayValues(locationsMap);
    locationResponse.locations = locationsArr;
    return locationResponse;
  }

  public getLocation(locationName: string): LocationResponse {
    const locationResponse = new LocationResponse();
    const locationsMap: Map<string, AppLocation> = this.localStorageService.getLocations();
    const location = locationsMap.get(locationName);
    if (!location) {
      locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND;
    } else {
      locationResponse.locations = [location];
    }
    return locationResponse;
  }

  public createLocation(location: AppLocation): LocationResponse {
    const locationResponse = new LocationResponse();
    const locationsMap: Map<string, AppLocation> = this.localStorageService.getLocations();
    locationsMap.set(location.name, location);
    this.localStorageService.setLocations(locationsMap);
    locationResponse.locations = this.utilsService.convertFromMapToArrayValues(locationsMap);
    return locationResponse;
  }

  public updateLocation(locationName: string, newLocation: AppLocation): LocationResponse {
    const locationResponse = new LocationResponse();
    const locationsMap: Map<string, AppLocation> = this.localStorageService.getLocations();
    if (!locationsMap.get(locationName)) {
      locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND;
      return locationResponse;
    }
    locationsMap.set(locationName, newLocation);
    this.localStorageService.setLocations(locationsMap);
    locationResponse.location = newLocation;
    return locationResponse;
  }

  public deleteLocation(locationName: string): LocationResponse {
    const locationResponse = new LocationResponse();
    const locationsMap: Map<string, AppLocation> = this.localStorageService.getLocations();
    if (!locationsMap.delete(locationName)) {
      locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND;
      return locationResponse;
    }
    this.localStorageService.setLocations(locationsMap);
    return locationResponse;
  }
}
