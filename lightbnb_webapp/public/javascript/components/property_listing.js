$(() => {
  window.propertyListing = {};

  function getReservationOption(user, propertyId) {
    if (!user) {
      return `
      <button disabled>Log In to Reserve</button>
      `
    }
    return `
      <form action="/api/reservations" method="post" id="new-reservation-form" class="new-reservation-form">
    
        <div class="new-reservation-form__field-wrapper">
          <label for="new-reservation-form__start" required>Start</label>
          <input type="date" id="start" name="start_date">
        </div>
        
        <div class="new-reservation-form__field-wrapper">
          <label for="new-reservation-form__end">End</label>
          <input type="date" id="end" name="end_date" required>
        </div>

        <div class="new-reservation-form__field-wrapper">
            <button>Make Reservation</button>
            <input type="hidden" name="id" value="${propertyId}">
        </div>
        
      </form>
      `;
  } 

  function createListing(property, isReservation, user) { 
    return `
    <article class="property-listing">
        <section class="property-listing__preview-image">
          <img src="${property.thumbnail_photo_url}" alt="house">
        </section>
        <section class="property-listing__details">
          <h3 class="property-listing__title">${property.title}</h3>
          <ul class="property-listing__details">
            <li>number_of_bedrooms: ${property.number_of_bedrooms}</li>
            <li>number_of_bathrooms: ${property.number_of_bathrooms}</li>
            <li>parking_spaces: ${property.parking_spaces}</li>
          </ul>
          ${isReservation ? 
            `<p>${moment(property.start_date).format('ll')} - ${moment(property.end_date).format('ll')}</p>` 
            : ``}
          <footer class="property-listing__footer">
            <div class="property-listing__rating">${Math.round(property.average_rating * 100) / 100}/5 stars</div>
            <div class="property-listing__price">$${property.cost_per_night/100.0}/night</div>
            ${getReservationOption(user, property.id)}
          </footer>
        </section>
      </article>
    `;
  }

  window.propertyListing.createListing = createListing;

});