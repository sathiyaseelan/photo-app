$(document).ready(function() {
  var show_error, stripeResponseHandler, submitHandler, clear_card_details;

  clear_card_details = function(){
    $("[data-stripe=number]").remove();
    $("[data-stripe=cvv]").remove();
    $("[data-stripe=exp-year]").remove();
    $("[data-stripe=exp-month]").remove();
    $("[data-stripe=label]").remove();
  }
  submitHandler = function (event){
      var $form = $(event.target);
      $form.find("input[type=submit]").prop('disable',true);
      if(Stripe){
        Stripe.card.createToken($form, stripeResponseHandler);
      } else {
        show_error("Failed to load credit card processing functionality. Pleae try reload this page.")
      }
      return false;
  };

  $('.cc_form').on('submit', submitHandler);

  stripeResponseHandler = function (status, response) {
    var token,$form;
    $form = $('.cc_form');
    if (response.error) {
      console.log(response.error.message);
      show_error(response.error.message);
      $form.find('input[type=submit]').prop('disabled', false);
    } else {
      token = response.id;
      $form.append($("<input type='hidden' name='payment[token]' />").val(token));
      clear_card_details();
      $form.get(0).submit();
    }
    return false;
  };

  show_error = function(message) {
    if($("#flash-messages").size() < 1){
      console.log('flash-messages <1');
      $('div.container div.row').prepend("<div id='flash-messages'></div>");
    }
    $('#flash-messages').html('<div class="alert alert-danger"><a class="close" data-dismiss="alert">x</a><div id="flash_alert">'+ message + '</div></div>');
    // $('.alert').delay(5000).fadeOut(3000);
     return false;
  }
});
