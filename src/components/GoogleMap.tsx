import { ReactNode, useEffect, useRef, useState } from 'react';
import MapContext from '../context/map-context';

const GoogleMap = ({
  center,
  zoom,
  children,
  onLoad,
  onUnmount,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  children?: ReactNode | undefined;
  onLoad?: ((map: google.maps.Map) => void | Promise<void>) | undefined;
  onUnmount?: ((map: google.maps.Map) => void | Promise<void>) | undefined;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const map =
      ref.current === null
        ? null
        : new window.google.maps.Map(ref.current, {
            center,
            zoom,
          });

    setMap(map);

    if (map !== null && onLoad) {
      onLoad(map);
    }

    return () => {
      if (map !== null) {
        if (onUnmount) {
          onUnmount(map);
        }
      }
    };
  }, []);

  return (
    <div ref={ref} id="map" style={{ height: '400px' }}>
      <MapContext.Provider value={map}>
        {map !== null ? children : <></>}
      </MapContext.Provider>
    </div>
  );
};

export default GoogleMap;
