---
---
export const thecurve = {
    currentLoc: {
        lat: '{{ site.lat }}',
        lng: '{{ site.lng }}'
    },
    startZoom: '{{ site.startzoom }}',
    maxZoom: 19,
    minZoom: 10,
    latlng: ['{{ site.lat }}','{{ site.lng }}'],
    popupimageurl: '{{ site.url }}{{ site.baseurl }}/assets/images/popup.jpg',
    description: '{{ site.description }}',
    debug: true
};

