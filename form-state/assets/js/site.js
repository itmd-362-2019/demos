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

  // Functions for working with form data and localStorage
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
    localStorage.setItem(prefix + '.' + item_data.id, JSON.stringify(item_data));
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

  // Restore input values from localStorage
  function restorePrefixedFormInputsFromLocalStorage(prefix) {
    // Get an array of all the prefixed stored keys
    var saved_keys = retrievePrefixedStorageItemKeys(prefix);
    // Loop through the array and use the stored object data to
    // restore the value of the corresponding form item
    for (var key of saved_keys) {
      var item = retrieveAndParseInputStorageItem(key);
      // Use old-school getElementById; no need to prefix with #
      var input_by_id = document.getElementById(item.id)
      if (input_by_id) {
        input_by_id.value = item.value;
      }
    }
  }

  // Destroy all localStorage items by key prefix
  function destroyPrefixedStorageItemKeys(prefix) {
    var keys_to_destroy = retrievePrefixedStorageItemKeys(prefix);
    for (var key of keys_to_destroy) {
      localStorage.removeItem(key);
    }
  }

})();
