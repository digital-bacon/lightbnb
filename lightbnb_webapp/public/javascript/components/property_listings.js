$(() => {

  const $propertyListings = $(`
  <section class="property-listings" id="property-listings">
      <p>Loading...</p>
    </section>
  `);
  window.$propertyListings = $propertyListings;

  window.propertyListings = {};

  function addListing(listing) {
    $propertyListings.append(listing);
  }
  function clearListings() {
    $propertyListings.empty();
  }
  window.propertyListings.clearListings = clearListings;

  function addProperties(properties, isReservation = false) {
    clearListings();
    for (const propertyId in properties) {
      const property = properties[propertyId];
      const user = getUser();
      const listing = propertyListing.createListing(property, isReservation, user);
      addListing(listing);
    }
  }

  function getUser() {
    return getMyDetails()
    .then((json) => json.user);
  }

  window.propertyListings.addProperties = addProperties;

  $propertyListings.on('click', function(event) {
    if (event.target.name === 'property-listing__reserve') {
      const propertyId = $(event.target)
        .closest('article')
        .attr('id')
        .replace('property_', '');
      views_manager.show('newReservation', { propertyId: Number(propertyId) });
    };
  });

});