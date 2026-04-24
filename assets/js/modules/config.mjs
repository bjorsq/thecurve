---
---
export const thecurve = {
    currentLoc: {
        lat: {{ site.lat }},
        lng: {{ site.lng }}
    },
    startZoom: 14,
    maxZoom: 19,
    minZoom: 10,
    imagesURL: '{{ site.url }}{{ site.baseurl }}/assets/images/',
    debug: true
};

