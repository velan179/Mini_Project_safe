import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useState(null);       // { lat, lng }
  const [locationError, setLocationError] = useState(null);   // string | null
  const [locationLoading, setLocationLoading] = useState(false);
  const [permissionState, setPermissionState] = useState(null);

  const resolveLocationDetails = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve location details");
      }

      const data = await response.json();
      const address = data.address || {};

      return {
        street:
          address.road ||
          address.pedestrian ||
          address.cycleway ||
          address.footway ||
          address.neighbourhood ||
          address.suburb ||
          "",
        city:
          address.city ||
          address.town ||
          address.village ||
          address.county ||
          address.state_district ||
          "",
        postcode: address.postcode || "",
        displayName: data.display_name || "",
      };
    } catch (error) {
      return {
        street: "",
        city: "",
        postcode: "",
        displayName: "",
      };
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const details = await resolveLocationDetails(lat, lng);

        setLocation({
          lat,
          lng,
          ...details,
        });
        setLocationError(null);
        setLocationLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError(
              "Location access denied. Please enable location services in your browser settings to use safety features."
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable. Please try again.");
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out. Please try again.");
            break;
          default:
            setLocationError("An unknown error occurred while retrieving your location.");
        }
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [resolveLocationDetails]);

  const enableLocationAccess = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    // Trigger the browser permission flow and fetch the live coordinates
    // as soon as the user allows access.
    if (!navigator.permissions?.query) {
      requestLocation();
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      setPermissionState(permission.state);

      if (permission.state === "denied") {
        setLocationError(
          "Location access is blocked. Please enable location permission for this site in your browser settings. Your current location will load automatically once access is allowed."
        );
        return;
      }

      requestLocation();
    } catch (error) {
      requestLocation();
    }
  }, [requestLocation]);

  useEffect(() => {
    if (!isAuthenticated || location || locationLoading) {
      return;
    }

    if (permissionState === "denied") {
      setLocationError(
        "Location access is blocked. Please enable location permission for this site in your browser settings. Your current location will load automatically once access is allowed."
      );
      return;
    }

    setLocationError(null);
    enableLocationAccess();
  }, [isAuthenticated, location, locationLoading, permissionState, enableLocationAccess]);

  useEffect(() => {
    if (!navigator.permissions?.query) {
      return undefined;
    }

    let permissionStatus;

    const syncPermission = async () => {
      try {
        permissionStatus = await navigator.permissions.query({
          name: "geolocation",
        });
        setPermissionState(permissionStatus.state);

        permissionStatus.onchange = () => {
          setPermissionState(permissionStatus.state);

          if (permissionStatus.state === "granted") {
            requestLocation();
          } else if (permissionStatus.state === "denied") {
            setLocationError(
              "Location access is blocked. Please enable location permission for this site in your browser settings. Your current location will load automatically once access is allowed."
            );
          }
        };
      } catch (error) {
        permissionStatus = null;
      }
    };

    syncPermission();

    return () => {
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, [requestLocation]);

  return (
    <LocationContext.Provider
      value={{
        location,
        locationError,
        locationLoading,
        requestLocation,
        enableLocationAccess,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
