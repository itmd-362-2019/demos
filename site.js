(function(){
  // Browser sanity check:
  if (!('querySelector' in document && 'addEventListener' in document)) {
    // Old, old browser. Say buh-bye
    // console.log('Old browser');
    return;
  }

  document.addEventListener('DOMContentLoaded',function(){
    // console.log('OMG the DOM is loaded!!!1!');
    // var heading_text = document.querySelector('#content h1').innerText;
    // console.log('The heading text is:', heading_text);
  });

  var tel_input = document.querySelector('#telephone');
  tel_input.addEventListener('focus', function(){
    console.log('OMG somebody focused on the telephone input');
  });
  tel_input.addEventListener('blur', function(){
    console.log('OMG somebody navigated away from the telephone input');
  tel_input.addEventListener('keyup',function(){
    console.log('The value of #telephone is', this.value);
  });


}());
