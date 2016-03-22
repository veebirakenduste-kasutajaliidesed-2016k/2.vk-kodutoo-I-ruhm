window.onload = function () {

  var clock = document.getElementById('clock');
  var dateyear = document.getElementById('date');
  writeDate();

//millisekundid
  window.setInterval(function(){
//ooteaja järgi uuendatakse
  writeDate();
  }, 1000);

};

function writeDate(){
  //tänane kuupäev
  var today = new Date();

  var date = today.getDate();
  var month = today.getMonth();
  var year = today.getFullYear();


  var hours = today.getHours();
  var minutes  = today.getMinutes();
  var seconds = today.getSeconds();
  clock.innerHTML = ' Time:' +  setZeroBefore (hours) + ':' + setZeroBefore(minutes) +':'+ setZeroBefore(seconds) +
  ' Date:' + setZeroBefore(date) + '.' + setZeroBefore(month+1) + '.' + year;
}

function setZeroBefore(number) {
  if(number < 10){
    number="0"+number;
  }
  return number;
  }

  function myFunctionSmall() {
      document.getElementById("clock").style.fontSize = '50px';
  }
  function myFunctionLarge() {
      document.getElementById("clock").style.fontSize = '100px';
  }
  function myFunctionInitial() {
      document.getElementById("clock").style.fontSize = '150px';
  }


//http://www.w3schools.com/jsref/prop_style_fontsize.asp
