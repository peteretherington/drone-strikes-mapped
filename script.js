
const droneApp = {};

droneApp.droneURL = 'http://api.dronestre.am/data/';

// GET the data
droneApp.getDroneStrikesInfo = () => {
    $.ajax({
        url: droneApp.droneURL,
        method: 'GET',
        dataType: 'jsonp'
    
    // THEN pass the data through the filter, display, and plot-strikes functions
    }).then( (data) => {
            
        let droneStrikesObject = data.strike;
        droneApp.filterStrikes(droneStrikesObject);
        droneApp.plotStrikesOnMap(filteredDroneStrikes);

        $('#droneInfo').empty();
        if (filteredDroneStrikes.length !== 0) {
            droneApp.displayDroneStrikesInfo(filteredDroneStrikes);
        } 
        else {
            let noData = $('<p>').addClass('noData').text('No data matches your search. Try changing the year or country.')
            $('#droneInfo').append(noData);
        }
    }); 
}


// Click event for form inputs
droneApp.events = () => {
    $('#form').on('click', () => {
        droneApp.getDroneStrikesInfo();
        google.maps.Map.prototype.clearOverlays();
    });
}

// Show the year currently selected on the input slider
droneApp.updateYearInput = (val) => document.getElementById('inputYear').value = val

// Filter drone strike data by year and country
droneApp.filterStrikes = (data) => {
    
    let yearValue = $('#yearSelection input').val();
    let countryValue = $('#countrySelection input:checked').attr('id');
    if (countryValue === 'all') {
        countryValue = undefined;
    }

    let searchInput;

    if (yearValue !== undefined && countryValue !== undefined) {
        searchInput = (value) => value.date.substring(0,4) === yearValue && value.country === countryValue;
    }
    else if (yearValue !== undefined) {
        searchInput = (value) => value.date.substring(0,4) === yearValue;
    }
    else {
        searchInput = (value) => value.country === countryValue;
    }

    filteredDroneStrikes = data.filter(searchInput);
}


// Gmaps Key: AIzaSyBPTUF5UBBbiSrVI6Y-zzsNoQ1M9Mgmn1w

// Google Maps API
droneApp.initMap = () => {

    let pakistan = {lat: 30.3753, lng: 69.3451};
    let yemen = {lat: 15.5527, lng: 48.5164};
    let somalia = {lat: 5.1521, lng: 46.1996};
    
    let middleEast = {lat: 19, lng: 58};
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: middleEast
        // mapTypeId: 'terrain'
    });

    let markers = [];
    droneApp.strikeCoordinates = (strike) => {
        
        let coordinates = {
            lat: strike.lat, 
            lng: strike.lon
        };
        let latLng = new google.maps.LatLng(coordinates.lat, coordinates.lng);
        let marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
        markers.push(marker);
        google.maps.Map.prototype.clearOverlays = () => {
            for(i=0; i<markers.length; i++){
                markers[i].setMap(null);
            }
            markers.length = 0;
        }

        let infowindow = new google.maps.InfoWindow({
            content: `<p style="font-weight: bold;">Strike Log #${strike.number}</p><p>Date: ${strike.date.replace('T00:00:00.000Z', '')}</p><p>Location: ${strike.location}</p><p>Death Estimate: ${strike.deaths}</p><p style="font-style: italic;">For more info check the results below.</p>`
        });
        google.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
        });
            
        // google.maps.event.addDomListener(window, 'load', initialize);
    }

    droneApp.plotStrikesOnMap = (strikes) => {
        strikes.forEach(droneApp.strikeCoordinates);
    }
}


droneApp.strikeInfo = (strike) => {

    let post = strike.number;
    let country = strike.country;
    let date = strike.date.replace('T00:00:00.000Z', '');
    let town = strike.town;
    if (town === '') {
        town = 'no data'
    }
    let location = strike.location;
    if (location === '') {
        location = 'no data'
    }
    let deaths = strike.deaths;
    if (deaths === '') {
        deaths = 'no data'
    }
    let child = strike.children;
    if (child === '') {
        child = 'no data'
    }
    let civilian = strike.civilians;
    if (civilian === '') {
        civilian = 'no data'
    }
    let injuries = strike.injuries;
    if (injuries === '') {
        injuries = 'no data'
    }
    let summary = strike.bij_summary_short;
    if (summary === '') {
        summary = 'no data'
    }
    let narrative = strike.narrative;
    if (narrative === '') {
        narrative = 'no data'
    }
    let target = strike.target;
    if (target === '') {
        target = 'no data'
    }
    let names = strike.names;
    if (names == '') {
        names = 'no data'
    }
    let latitude = strike.lat;
    if (latitude == '') {
        latitude = 'no data'
    }
    let longitude = strike.lon;
    if (longitude == '') {
        longitude = 'no data'
    }

    let postEl = $('<p>').addClass('post').text( `Strike Log #${post}` );
    let countryEl = $('<p>').html( `<span class="property">Country:</span> ${country}` );
    let dateEl = $('<p>').html( `<span class="property">Date:</span> ${date}` );
    let townEl = $('<p>').html( `<span class="property">Town:</span> ${town}` );
    let locationEl = $('<p>').html( `<span class="property">Location:</span> ${location}` )
    let deathsEl = $('<p>').html( `<span class="property">Death Estimate:</span> <span class="red">${deaths}</span>` );
    let childEl = $('<p>').html( `<span class="property">Child Deaths:</span> <span class="red">${child}</span>` );
    let civilianEl = $('<p>').html( `<span class="property">Civilian Deaths:</span> <span class="red">${civilian}</span>` );
    let injuriesEl = $('<p>').html( `<span class="property">Injuries:</span> ${injuries}` )
    let summaryEl = $('<p>').html( `<span class="property">Summary:</span> ${summary}` );
    let narrativeEl = $('<p>').html( `<span class="property">Narrative:</span> ${narrative}` );
    let targetEl = $('<p>').html( `<span class="property">Target:</span> ${target}` )
    let namesEl = $('<p>').html( `<span class="property">Names:</span> ${names}` );
    let latitudeEl = $('<p>').html( `<span class="property">Latitude:</span> ${latitude}` );
    let longitudeEl = $('<p>').html( `<span class="property">Longitude:</span> ${longitude}` );

    let droneStrikeInfo = $('<div>').addClass('strike').append(postEl, countryEl, dateEl, townEl, locationEl, deathsEl, childEl, civilianEl, injuriesEl, summaryEl, narrativeEl, targetEl, namesEl, latitudeEl, longitudeEl);
    $('#droneInfo').append(droneStrikeInfo);
}

// Display drone strike information
droneApp.displayDroneStrikesInfo = (strikes) => {
    $('#droneInfo').empty();
    strikes.forEach(droneApp.strikeInfo);
}


// Call initial function
droneApp.init = () => {
    droneApp.initMap();
    droneApp.events();
};

// Document Ready
$( () => droneApp.init() );




// PSEUDO CODE
   
    // Display a clicked marker's info near the top of the page [!!]
    // Close info window (marker) when another is opened [!!]
    // Center the map based on the country selected [!]
    // Create a results counter and display it on the page [!]