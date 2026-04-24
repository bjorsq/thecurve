import { 
    Control,
    Map,
    TileLayer
} from 'leaflet';
import { LocateControl } from 'locatecontrol';
import { FullScreen } from 'fullscreencontrol';
import { thecurve } from './config.mjs';

/**
 * Initialise map and set listeners to set up markers when loaded
 */
export function initMap() {
    if ( document.getElementById( 'map' ) === null ) {
        return;
    }
    thecureve.map = new Map('map', {
        zoom: thecureve.startZoom,
        center: [ thecureve.currentLoc.lat, thecureve.currentLoc.lng ],
        minZoom: thecureve.minZoom,
        maxZoom: thecureve.maxZoom
    });
    /* change leaflet attribution */
    thecureve.map.attributionControl.setPrefix( '<a href="https://leafletjs.com" target="external" title="A JavaScript library for interactive maps" aria-label="Leaflet - a JavaScript library for interactive maps"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8"><path fill="#4C7BE1" d="M0 0h12v4H0z"></path><path fill="#FFD500" d="M0 4h12v3H0z"></path><path fill="#E0BC00" d="M0 7h12v1H0z"></path></svg> Leaflet</a>' );
    thecureve.osm = new TileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: thecureve.maxZoom,
        attribution: '© <a target="external" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo( thecureve.map );
    thecureve.OpenCycleMap = new TileLayer('https://api.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=953b59eb91064cc1a54bc7fe78939685', {
        maxZoom: thecureve.maxZoom,
        attribution: 'Maps: &copy; <a href="https://www.thunderforest.com/">Thunmderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    });
    thecureve.Esri_WorldImagery = new TileLayer( 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: thecureve.maxZoom,
        attribution: 'Tiles © Esri - Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    let baseMaps = {
        "OpenStreetMap": thecureve.osm,
        "OpenCycleMap": thecureve.OpenCycleMap,
        "Esri WorldImagery": thecureve.Esri_WorldImagery
    };
    let overlayMaps = {};
    thecureve.layerControl = new Control.Layers(baseMaps, overlayMaps, { position: 'bottomleft' }).addTo(thecureve.map);
    thecureve.fullscreencontrol = new FullScreen({
        position: 'topleft'
    }).addTo(thecureve.map);
    thecureve.locateControl = new LocateControl({
        position: 'topleft',
        strings: {
            title: "Show me where I am!"
        },
        locateOptions: {
            watch: true,
            enableHighAccuracy: true
        }
    }).addTo(thecureve.map);
    thecureve.map.on('locationfound', function(e){
        thecureve.user.lat = e.latitude;
        thecureve.user.lng = e.longitude;
        console.log(thecureve.user);
    });
    thecureve.map.on('locateactivate', e => { thecureve.locationactive = true });
    thecureve.map.on('locatedeactivate', e => { thecureve.locationactive = false; thecureve.user.lat = null; thecureve.user.lng = null });
    thecureve.map.on( 'click', e => { console.log( e.latlng ); });
    thecureve.mapLoaded = true;

    document.dispatchEvent( new Event( 'maploaded' ) );
    thecureve.featureSelecter = new FeatureSelecter().addTo(thecureve.map);
}