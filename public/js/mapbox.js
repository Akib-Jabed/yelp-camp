/* eslint-disable no-undef */
console.log('loaded');
console.log(campground);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [campground.longitude, campground.latitude],
    zoom: 10,
});

new mapboxgl.Marker()
    .setLngLat([campground.longitude, campground.latitude])
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(`${campground.title}`))
    .addTo(map);
