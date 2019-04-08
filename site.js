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

  // ZIP code validity function
  function validate_us_zip(value) {
    var zip = clean_nonnumbers(value);
    return validate(zip.length,eq,5);
  }

  // Debounce function to limit calls on repeated events
  // See for e.g., https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
  var debounce = function debounce(func, delay) {
    var inDebounce;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(function () {
        return func.apply(context, args);
      }, delay);
    };
  };

  document.addEventListener('DOMContentLoaded',function(){
    // Select the necessary elements from the DOM
    var blog = {
      // TODO: implement get syntax to avoid repeating document.querySelector so dang much
      form: document.querySelector('#blog-form'),
      get textarea() {
        return this.form.querySelector('#body');
      },
      get title() {
        return this.form.querySelector('#title');
      },
      submit_area: document.querySelector('#submit-area'),
      submit_button: document.querySelector('#share'),
      eh_submit_button: document.createElement('a')
    };

    // Store Post Title leveraging the `input` event
    // https://developer.mozilla.org/en-US/docs/Web/Events/input

    function stateTheValue() {
      console.log('The title is now:', blog.title.value);
    }

    var dbStateTheValue = debounce(stateTheValue, 1000);

    blog.title.addEventListener('input', dbStateTheValue);



    // Set up details on the order.eh_submit_button element
    blog.eh_submit_button.href = '#null';
    blog.eh_submit_button.id = 'eh-submit';
    blog.eh_submit_button.setAttribute('role','button');
    blog.eh_submit_button.innerText = blog.submit_button.getAttribute('value');

    // Replace the submit button with `<a role="button">`
    blog.submit_button.classList.add('hidden');
    blog.submit_area.appendChild(blog.eh_submit_button);

    // Listen for click events on new submit button, and submit
    // the form when it's clicked
    blog.eh_submit_button.addEventListener('click', function(event) {
      // Submit the form
      event.preventDefault();
      blog.submit_button.click();
    })

    // Listen for the form's submit event, intercept it and
    // display a confirmation where the form once was
    blog.form.addEventListener('submit',function(e){
      e.preventDefault();
      console.log('Caught the submit event on JS refactor');
    })

  // End of DOMContentLoaded
  });

// End of IIFE
}());
