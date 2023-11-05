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
 // Function to fetch and display reviews
  $(document).on('click', 'span.review_span', function () {
    if ($(this).text() === 'Show') {
      fetchReviews($(this));
    } else {
      removeReviews($(this));
    }
  });

  // Function to fetch reviews from the API
  function fetchReviews(spanElement) {
    const placeId = spanElement.data('id');
    $.ajax({
      url: `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`,
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
        spanElement.text('Hide');
        const reviewList = $('<ul></ul>');
        data.forEach(function (review) {
          const reviewItem = $('<li></li>');
          const reviewTitle = $('<h4></h4>');
          const userName = review.user.first_name + ' ' + review.user.last_name;
          const formattedDate = new Date(review.created_at).toLocaleString();
          reviewTitle.text(`From ${userName} on ${formattedDate}`);
          const reviewDescription = $('<p></p>').html(review.text);
          reviewItem.append(reviewTitle, reviewDescription);
          reviewList.append(reviewItem);
        });
        spanElement.parent().next('.reviews').append(reviewList);
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  // Function to remove reviews from the display
  function removeReviews(spanElement) {
    spanElement.text('Show');
    spanElement.parent().next('.reviews').empty();
  }
});

