(function(){
  // Browser sanity check:
  if (!('querySelector' in document && 'addEventListener' in document)) {
    // Old, old browser. Say buh-bye
    // console.log('Old browser');
    return;
  }

  var phone_submit = document.querySelector('#signup');

  document.addEventListener('DOMContentLoaded',function(){
    // console.log('OMG the DOM is loaded!!!1!');
    // var heading_text = document.querySelector('#content h1').innerText;
    // console.log('The heading text is:', heading_text);
    // Disable the submit button until we are reasonable sure
    // that we have a ten-digit phone number
    phone_submit.setAttribute('disabled','disabled');
  });

  var tel_input = document.querySelector('#telephone');
  tel_input.addEventListener('focus', function(){
    console.log('OMG somebody focused on the telephone input');
  });
  tel_input.addEventListener('blur', function(){
    console.log('OMG somebody navigated away from the telephone input');
  });

  tel_input.addEventListener('keyup',function(){
    // Remove all non-digit characters from the telephone input's value
    var clean_number = this.value.replace(/\D/g,'');
    // Remove any 1 apppearing at the start of the number
    var sanitized_number = clean_number.replace(/^1/,'');
    // Finally, check to see if the number is 10 digits long
    if (sanitized_number.length === 10) {
      console.log('That number looks great!');
      // If so, allow the form to be submitted
      phone_submit.removeAttribute('disabled');
    }

  });


}());
