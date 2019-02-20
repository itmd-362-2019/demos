(function(){
  // Browser sanity check:
  if (!('querySelector' in document && 'addEventListener' in document)) {
    // Old, old browser. Say buh-bye
    // console.log('Old browser');
    return;
  }

  // Library of comparison functions
  //
  // Unlike the raw operators these encapsulate, functions
  // can be passed around like any other value into other
  // functions.
  function eq(value,condition) {
    return value === condition;
  }
  function gt(value,condition) {
    return value > condition;
  }
  function gte(value,condition) {
    return value >= condition;
  }
  function lt(value,condition) {
    return value < condition;
  }
  function lte(value,condition) {
    return value <= condition;
  }

  // Data cleanup functions
  function clean_nonnumbers(value) {
    // returns value with all non-digits removed
    return value.replace(/\D/g,'');
  }
  function clean_whitespace(value) {
    // returns value with all whitespace characters removed
    return value.replace(/\s/g, '');
  }

  // Phone-specific santizier functions
  function strip_us_country_code(value) {
    return value.replace(/^1/,'');
  }

  // All purpose validate function. It takes a value,
  // along with either a regular expression pattern or
  // a simple function -- like the comparison functions
  // above -- and a condition. JavaScript doesn't char
  // if a function is called with more or fewer arguments
  // than described in the function definition, so it's
  // no problem at all to leave off the `condition`
  // argument when calling a check that's a regular expression
  function validate(value,check,condition) {
    if (eq(typeof(check.test),'function')) {
      // Handle a regular expression
      return check.test(value);
    } else if (eq(typeof(check),'function')) {
      // Handle a comparison function
      return check(value,condition);
    } else {
      return false;
    }
  }

  // Phone validity functions
  function validate_us_phone(value) {
    var phone_number = strip_us_country_code(clean_nonnumbers(value));
    return validate(phone_number.length,eq,10);
  }

  // Email validity function
  function validate_email(value) {
    var email = clean_whitespace(value);
    return validate(email,/^[^@\s]+@[^@\s]+$/g);
  }


  document.addEventListener('DOMContentLoaded',function(){
    // Select the necessary elements from the DOM
    var signup_form = document.querySelector('#signup-form');
    var signup_submit = document.querySelector('#signup');
    var contact_input = document.querySelector('#contact');
    var contact_hint = document.querySelector('#contact-input .hint');
    contact_hint.innerHTML += ' <b id="contact-error"></b>';
    // Disable the submit button until we are reasonable sure
    // that we have a ten-digit phone number
    signup_submit.setAttribute('disabled','disabled');

    // Listen for keyup event ANYWHERE in the form
    signup_form.addEventListener('keyup',function(){
      var contact_value = contact_input.value;
      // Check the likely validity of phone OR email
      if (validate_us_phone(contact_value) || validate_email(contact_value)) {
        signup_submit.removeAttribute('disabled');
      } else {
        // Show the users an error message
        var contact_error = document.querySelector('#contact-error');
        if(contact_value.length > 10 && contact_error.innerText.length === 0) {
          contact_error.innerText = 'You need a ten-digit phone or valid email address.';
        }
        // This will re-disable the submit button if the input changes to an invalid state
        signup_submit.setAttribute('disabled','disabled');
      }
    });

  // End of DOMContentLoaded
  });

// End of IIFE
}());
