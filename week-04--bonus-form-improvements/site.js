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
    var signup_form = document.querySelector('#emergencyalerts')
    var signup_submit = document.querySelector('#signup');
    var tel_input = document.querySelector('#telephone');
    // Disable the submit button until we are reasonable sure
    // that we have a ten-digit phone number
    signup_submit.setAttribute('disabled','disabled');

    // Listen for keyup event ANYWHERE in the form
    signup_form.addEventListener('keyup',function(){
      if (validate_us_phone(tel_input.value)) {
        // If so, allow the form to be submitted
        signup_submit.removeAttribute('disabled');
      }
    });

  // End of DOMContentLoaded
  });

// End of IIFE
}());
