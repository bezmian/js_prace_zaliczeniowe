let map;
let marker;

function initMap() {
    const cracow = {lat: 50.0646501, lng: 19.9449799};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: 'none',
        center: cracow
    });

    marker = new google.maps.Marker({
        position: cracow,
        map: map,
        icon: "https://maps.google.com/mapfiles/kml/shapes/heliport.png"
    });

    map.addListener('center_changed', function () {
        marker.setPosition(map.center);
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            marker.setPosition(pos);
            map.setCenter(pos);
            map.setZoom(12)
        }, function () {
            handleLocationError(true);
        });
    } else {
        handleLocationError(false);
    }
}

function handleLocationError(browserHasGeolocation) {
    alert(browserHasGeolocation ?
        'Nie można zlokalizować użytkownika' :
        'Przeglądarka nie wspiera geolokalizacji');
}

let url = 'ws://91.121.6.192:8010';
let ws = new WebSocket(url);
ws.addEventListener('message', receiveMessage);

function receiveMessage(e) {
    let div = document.createElement("div");
    div.className = "incomingMessage";
    let message = document.createElement("p");
    message.appendChild(document.createTextNode(e.data));
    div.appendChild(message);
    console.log(e.data);

    document.getElementById("chat").appendChild(div);
}

document.getElementById('sendMessageButton').addEventListener("click", () => {
    let value = document.getElementById('message').value;
    if (value) {
        ws.send(value);
    }
});