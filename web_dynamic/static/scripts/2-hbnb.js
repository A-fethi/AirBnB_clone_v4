// Listens for changes to the checkboxes. When a checkbox is checked or unchecked,
// it updates the selected amenities and displays them in the h4 tag inside the Amenities div.
const $ = window.$;

$(document).ready(function () {
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
  const selectedAmenities = {};

  $('input[type="checkbox"]').click(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if ($(this).prop('checked')) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      delete selectedAmenities[amenityId];
    }

    const amenityList = Object.values(selectedAmenities).join(', ');
    // Prevents the text from overflowing or becoming too long.
    if (amenityList.length > 25) {
      $('.amenities h4').text(amenityList.substring(0, 24) + '...');
    } else {
      $('.amenities h4').text(amenityList);
    }
    if ($.isEmptyObject(selectedAmenities)) {
      $('.amenities h4').html('&nbsp;');
    }
  });
});
