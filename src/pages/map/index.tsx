import React, { useEffect, useRef } from 'react';
import { init } from './loadModel';
import styles from './index.less';

const Map = () => {
  const mapRef = useRef();

  useEffect(() => {
    console.log(mapRef, 'mapRef');
    if (mapRef && mapRef.current) {
      init(mapRef.current);
    }
  }, []);

  return <div className={styles['map-wrapper']} ref={mapRef}></div>;
};
export default Map;
