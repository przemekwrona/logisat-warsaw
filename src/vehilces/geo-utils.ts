import haversineDistance from 'haversine-distance';
import { WarsawVehiclePosition } from '../generated/public-transport-api';
import moment from 'moment/moment';

export const haversineDistanceInMeters = (
  historicalPosition: WarsawVehiclePosition,
  currentPosition: WarsawVehiclePosition,
): number => {
  return Math.floor(haversineDistance(
    {
      lat: historicalPosition.Lat || 0,
      lon: historicalPosition.Lon || 0,
    },
    {
      lat: currentPosition.Lat,
      lon: currentPosition.Lon,
    }
  ));
};

export const calculateVelocity = (
  historicalPosition: WarsawVehiclePosition | undefined,
  currentPosition: WarsawVehiclePosition,
): number => {

  if(!historicalPosition) {
    return 0;
  }
  const historicalTime = moment(historicalPosition.Time);
  const currentTime = moment(currentPosition.Time);

  const deltaTimeInSeconds = currentTime.diff(historicalTime, 'seconds');

  if (deltaTimeInSeconds === 0) {
    return 0;
  }

  const distanceInMeters = haversineDistanceInMeters(historicalPosition, currentPosition,);
  return  Math.floor(distanceInMeters / deltaTimeInSeconds);
};
