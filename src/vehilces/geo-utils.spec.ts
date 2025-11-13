// __tests__/transport-utils.test.ts
import { calculateVelocity, haversineDistanceInMeters } from './geo-utils';
import { WarsawVehiclePosition } from '../generated/public-transport-api';
import haversineDistance from 'haversine-distance';

jest.mock('haversine-distance', () => jest.fn());

describe('haversineDistanceInMeters', () => {
  it('should calculate distance using haversine-distance', () => {
    const historicalPosition: WarsawVehiclePosition = { Lat: 52.2297, Lon: 21.0122, Lines: '182', VehicleNumber: '1414', Time: '2025-11-13T10:00:00Z' };
    const currentPosition: WarsawVehiclePosition = { Lat: 52.2264, Lon: 21.0252, Lines: '182', VehicleNumber: '1414', Time: '2025-11-13T10:10:00Z' };

    // @ts-ignore
    haversineDistance.mockReturnValue(1000);

    const distance = haversineDistanceInMeters(historicalPosition, currentPosition);

    expect(distance).toBe(1000);
    expect(haversineDistance).toHaveBeenCalledWith(
      { lat: historicalPosition.Lat, lon: historicalPosition.Lon },
      { lat: currentPosition.Lat, lon: currentPosition.Lon }
    );
  });

});

describe('calculateVelocity', () => {
  it('should return 0 if historicalPosition is undefined', () => {
    const currentPosition: WarsawVehiclePosition = { Lat: 52.4064, Lon: 16.9252, Lines: '182', VehicleNumber: '1414', Time: '2025-11-13T10:10:00Z' };
    expect(calculateVelocity(undefined, currentPosition)).toBe(0);
  });

  it('should return 0 if deltaTimeInSeconds is 0', () => {
    const historicalPosition: WarsawVehiclePosition = { Lat: 52.2297, Lon: 21.0122, Lines: '182', VehicleNumber: '1414', Time: '2025-11-13T10:00:00Z' };
    const currentPosition: WarsawVehiclePosition = { Lat: 52.4064, Lon: 16.9252, Lines: '182', VehicleNumber: '1414', Time: '2025-11-13T10:00:00Z' };

    expect(calculateVelocity(historicalPosition, currentPosition)).toBe(0);
  });

  it('should calculate velocity correctly', () => {
    const historicalPosition: WarsawVehiclePosition = { Lat: 52.2297, Lon: 21.0122, Lines: '182', VehicleNumber: '1414', Time: '2025-11-13T10:00:00Z' };
    const currentPosition: WarsawVehiclePosition = { Lat: 52.4064, Lon: 16.9252, Lines: '182', VehicleNumber: '1414', Time: '2025-11-13T10:10:00Z' };

    // @ts-ignore
    haversineDistance.mockReturnValue(1200); // meters
    const velocity = calculateVelocity(historicalPosition, currentPosition);

    // 10 minutes = 600 seconds; 1200 / 600 = 2
    expect(velocity).toBe(2);
  });
});
