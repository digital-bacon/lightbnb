$(() => {

  const $newReservationForm = $(`
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
        <input type="hidden" name="property_id">
    </div>
    
  </form>
  `);

  window.$newReservationForm = $newReservationForm;

  $newReservationForm.on('submit', function (event) {
    event.preventDefault();
    
    views_manager.show('none');

    const data = $(this).serialize();
    submitReservation(data)
    .then(() => {
      views_manager.show('listings');
    })
    .catch((error) => {
      console.error(error);
      views_manager.show('listings');
    })
  });

  $('body').on('click', '#reservation-form__cancel', function() {
    views_manager.show('listings');
    return false;
  });
  
});