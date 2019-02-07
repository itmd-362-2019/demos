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
}());
