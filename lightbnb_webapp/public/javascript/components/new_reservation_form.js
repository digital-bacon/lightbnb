$(() => {
  const $newReservationForm = $(`
  <form action="/api/reservations" method="post" id="new-reservation-form" class="new-reservation-form">

      <div class="new-reservation-form__field-wrapper">
          <label for="new-reservation-form__start">Start</label>
          <input type="text" id="datepicker-start">
        </div>

        <div class="new-reservation-form__field-wrapper">
            <button>Submit Reservation</button>
            <a id="reservation-form__cancel" href="#">Cancel</a>
        </div>
        
    </form>
  `);

  window.$newReservationForm = $newReservationForm;

  const $datepickerStart = $('#datepicker-start');
  const $datepickerEnd = $('#datepicker-end');
  $datepickerStart.datepicker({ minDate: 1 });
  $datepickerEnd.datepicker({ minDate: 2 });

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