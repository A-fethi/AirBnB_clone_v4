// Listens for changes to the checkboxes. When a checkbox is checked or unchecked.
// Updates the selected amenities and displays them in the h4 tag inside the Amenities div.
const $ = window.$;

$(document).ready(function () {
  const selectedAmenities = {};

  $('input[type="checkbox"]').click(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if ($(this).prop('checked') === true) {
      selectedAmenities[amenityId] = amenityName;
    } else if ($(this).prop('checked') === false) {
      delete selectedAmenities[amenityId];
    }

    const amenityList = Object.values(selectedAmenities).join(', ');
    // Prevents the text overflow or becoming too long.
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
