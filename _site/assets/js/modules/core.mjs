import { 
    Control,
    Map,
    Marker,
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
    thecurve.map = new Map('map', {
        zoom: thecurve.startZoom,
        center: [ thecurve.currentLoc.lat, thecurve.currentLoc.lng ],
        minZoom: thecurve.minZoom,
        maxZoom: thecurve.maxZoom
    });
    /* change leaflet attribution */
    thecurve.map.attributionControl.setPrefix( '<a href="https://leafletjs.com" target="external" title="A JavaScript library for interactive maps" aria-label="Leaflet - a JavaScript library for interactive maps"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8"><path fill="#4C7BE1" d="M0 0h12v4H0z"></path><path fill="#FFD500" d="M0 4h12v3H0z"></path><path fill="#E0BC00" d="M0 7h12v1H0z"></path></svg> Leaflet</a>' );
    thecurve.osm = new TileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: thecurve.maxZoom,
        attribution: '© <a target="external" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo( thecurve.map );
    thecurve.OpenCycleMap = new TileLayer('https://api.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=953b59eb91064cc1a54bc7fe78939685', {
        maxZoom: thecurve.maxZoom,
        attribution: 'Maps: &copy; <a href="https://www.thunderforest.com/">Thunmderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    });
    thecurve.Esri_WorldImagery = new TileLayer( 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: thecurve.maxZoom,
        attribution: 'Tiles © Esri - Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    let baseMaps = {
        "OpenStreetMap": thecurve.osm,
        "OpenCycleMap": thecurve.OpenCycleMap,
        "Esri WorldImagery": thecurve.Esri_WorldImagery
    };
    let overlayMaps = {};
    thecurve.layerControl = new Control.Layers(baseMaps, overlayMaps, { position: 'bottomleft' }).addTo(thecurve.map);
    thecurve.fullscreencontrol = new FullScreen({
        position: 'topleft'
    }).addTo(thecurve.map);
    thecurve.locateControl = new LocateControl({
        position: 'topleft',
        strings: {
            title: "Show me where I am!"
        },
        locateOptions: {
            watch: true,
            enableHighAccuracy: true
        }
    }).addTo(thecurve.map);
    thecurve.map.on('locationfound', function(e){
        thecurve.user.lat = e.latitude;
        thecurve.user.lng = e.longitude;
        console.log(thecurve.user);
    });
    thecurve.map.on('locateactivate', e => { thecurve.locationactive = true });
    thecurve.map.on('locatedeactivate', e => { thecurve.locationactive = false; thecurve.user.lat = null; thecurve.user.lng = null });
    thecurve.map.on( 'click', e => { console.log( e.latlng ); });
    thecurve.mapLoaded = true;

    // load the curve popup and open
    thecurve.marker = new Marker(thecurve.latlng).addTo(thecurve.map);
    thecurve.popup = '<section><header class="popup-header"><img src="' + thecurve.popupimageurl + '" alt="The Curve"></header><div class="popup-body"><p>' + thecurve.address + '</p><p><a target="_blank" class="button" href="https://www.google.com/maps/dir/?api=1&destination=' + thecurve.latlng.join(',') + '">Get directions</a></p></div></section>';
    thecurve.marker.bindPopup( thecurve.popup, {'width':300,'className':'thecurve-popup'} ).openPopup();
    document.dispatchEvent( new Event( 'maploaded' ) );
}