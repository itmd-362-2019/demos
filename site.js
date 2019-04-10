(function(){
  // Browser sanity check:
  if (!('querySelector' in document && 'addEventListener' in document)) {
    // Old, old browser. Say buh-bye
    // console.log('Old browser');
    return;
  }

  // Function to be called later for determining localStorage support
  // Taken from discussion at https://gist.github.com/paulirish/5558557
  function storageAvailable(type) {
    try {
      var storage = window[type],
      x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return false;
    }
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

  // Functions for working with form data
  // Return all data-rich input elements
  function collectFormInputElements(form_selector) {
    var saved_input_elements = [];
    var input_elements = document.querySelector(form_selector).elements;
    for (var input of input_elements) {
      if(input.type !== 'submit') {
        saved_input_elements.push(input);
      }
    }
    return saved_input_elements;
  }

  // Get all interesting information about an input element
  function getInputData(input_element) {
    return {
      id: input_element.id,
      name: input_element.name,
      type: input_element.tagName.toLowerCase(),
      value: input_element.value
    }
  }

  // Store a prefixed storage item with input item data
  function storePrefixedInputStorageItem(prefix,input_element) {
    var item_data = getInputData(input_element);
    localStorage.setItem(prefix + item_data.id, JSON.stringify(item_data));
  }

  // Retrieve and parse an input storage item
  function retrieveAndParseInputStorageItem(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  // Retrieve all prefixed storage item keys
  function retrievePrefixedStorageItemKeys(prefix) {
    var saved_keys = [];
    for(var i = 0; i < localStorage.length; i++) {
      // Get only the items that begin with `prefix`
      var key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        saved_keys.push(key);
      }
    }
    return saved_keys;
  }



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

    if(storageAvailable('localStorage')) {

      // blog.title.value = localStorage.getItem('title');
      // blog.textarea.value = localStorage.getItem('post');

      // var dbStateTheValue = debounce(stateTheValue, 1000);
      // var dbStoreTheValue = debounce(storeTheValue, 1000);

      // blog.title.addEventListener('input', function() {
      //  dbStoreTheValue('title',blog.title);
      // });
      // blog.textarea.addEventListener('input', function() {
      //  dbStoreTheValue('post',blog.textarea);
      //});

      blog.form.addEventListener('input',function(){
        //console.log(blog.form.id);
        storePrefixedInputStorageItem(blog.form.id,event.target)
      });

    }


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
      blog.form.innerHTML = '<h2>Post Saved Successfully!</h2>';
      if(storageAvailable('localStorage')) {
        localStorage.removeItem('title');
        localStorage.removeItem('post');
      }
    })

  // End of DOMContentLoaded
  });

// End of IIFE
}());
