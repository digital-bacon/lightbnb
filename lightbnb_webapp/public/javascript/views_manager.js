$(() => {
  
  const $main = $('#main-content');

  window.views_manager = {};

  window.views_manager.show = function(item, options) {
    $newPropertyForm.detach();
    $propertyListings.detach();
    $newReservationForm.detach();
    $searchPropertyForm.detach();
    $logInForm.detach();
    $signUpForm.detach();

    switch (item) {
      case 'listings':
        $propertyListings.appendTo($main);
        break;
      case 'listing':
        $propertyListings.appendTo($main);
        break;
      case 'newProperty':
        $newPropertyForm.appendTo($main);
        break;
      case 'newReservation':
        $newReservationForm.find("input[name='property_id']").val(options.propertyId);
        $newReservationForm.appendTo($main);
        break;
      case 'searchProperty':
        $searchPropertyForm.appendTo($main);
        break;
      case 'logIn':
        $logInForm.appendTo($main);
        break;
      case 'signUp':
        $signUpForm.appendTo($main);
        break;
      case 'error': {
        const $error = $(`<p>${arguments[1]}</p>`);
        $error.appendTo('body');
        setTimeout(() => {
          $error.remove();
          views_manager.show('listings');
        }, 2000);
        
        break;
      }
    }
  }
  
});