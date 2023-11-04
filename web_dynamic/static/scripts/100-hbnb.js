// Listens for changes to the checkboxes. When a checkbox is checked or unchecked,
// it updates the selected amenities and displays them in the h4 tag inside the Amenities div.
const $ = window.$;

$(document).ready(function () {
  const selectedAmen = {};
  const selectedLoc = {};
  // Function to update the locations h4 tag
  function updateLocations () {
    const Locationli = Object.values(selectedLoc).join(', ');
    $('.locations h4').text(Locationli);
  }

  // Function to update the API status and add/remove the "available" class
  function updateApiStatus () {
    const statusUrl = 'http://0.0.0.0:5001/api/v1/status/';
    $.get(statusUrl, function (response) {
      if (response.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    });
  }

  // Initial call to update the API status
  updateApiStatus();

  $('input[type="checkbox"]').click(function () {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    const type = $(this).attr('data-type');

    if ($(this).prop('checked')) {
      if (type === 'amenity') {
        selectedAmen[id] = name;
      } else if (type === 'location') {
        selectedLoc[id] = name;
      }
    } else {
      if (type === 'amenity') {
        delete selectedAmen[id];
      } else if (type === 'location') {
        delete selectedLoc[id];
      }
    }
    updateLocations();
  });
  function fetchDisplayPlaces () {
    const amenities = Object.keys(selectedAmen);
    const locations = Object.keys(selectedLoc);
    const placeUrl = 'http://0.0.0.0:5001/api/v1/places_search/';
    const requestData = JSON.stringify({ amenities, locations });
    $.ajax({
      type: 'POST',
      url: placeUrl,
      contentType: 'application/json',
      data: requestData,
      success: function (places) {
        $('section.places').empty();
        places.forEach(function (place) {
          const article = $('<article></article>');
          const placeName = $('<h2></h2>').text(place.name);
          const placePrice = $('<div class="price_by_night"></div>').text('$' + place.price_by_night);
          const placeDescription = $('<div class="information"></div>').text(place.description);
          article.append(placeName, placePrice, placeDescription);
          $('section.places').append(article);
        });
      }
    });
  }

  $('button').click(function () {
    fetchDisplayPlaces();
  });

  fetchDisplayPlaces();
});
