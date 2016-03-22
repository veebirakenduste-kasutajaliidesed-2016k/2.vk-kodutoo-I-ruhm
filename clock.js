(function(){
  "use strict";

  var Kell = function(){

    //Singleton Pattern
    if(Kell.instance){
      return Kell.instance;
    }
    //This viitab Moosipurk funktsioonile
    Kell.instance = this;
    this.today = null;
    this.memos = [];
    this.deadline = document.getElementById("dateTime");
    this.clockEl = document.getElementById('clock');

    //document.getElementById('color').addEventListener('click', this.randcolor());

    //window.addEventListener("load", setTimeout(this.clockTime(), 1000));
    this.clockTime();
    document.querySelector('#color').addEventListener('click', Kell.instance.randcolor.bind(this));
    document.querySelector('#memoAdd').addEventListener('click', Kell.instance.addMemo.bind(this));
    document.querySelector('#deleteMemo').addEventListener('click', Kell.instance.deleteMemo.bind(this));
    document.querySelector('#changeMemo').addEventListener('click', Kell.instance.changeMemo.bind(this));


    //setInterval(this.clockTime(this), 1000);
    this.counter = 0;
    if(localStorage.memos){
        //võtan stringi ja teen tagasi objektideks
        //this.jars = JSON.parse(localStorage.jars);
        //console.log('laadisin localStorageist massiiivi ' + this.jars.length);

        console.log('laadisin localStorageist');
        this.createListFromArray(JSON.parse(localStorage.memos));


    }else{

      //ei olnud localStorageit olemas, teen päringu serverisse

      var xhttp = new XMLHttpRequest();

      // vahetub siis kui toimub muutus ühenduses
      xhttp.onreadystatechange = function() {

        //console.log(xhttp.readyState);

        //fail jõudis tervenisti kohale
        if (xhttp.readyState == 4 && xhttp.status == 200) {

          var result =JSON.parse(xhttp.responseText);
          //console.log(result);

          // NB ! saab viidata MOOSIPURGILE ka Moosipurk.instance

          Kell.instance.createListFromArray(result);

          console.log('laadisin serverist');

        }
      };

      //päringu tegemine
      xhttp.open("GET", "saveData.php", true);
      xhttp.send();


    }
  };

  Kell.prototype = {
//http://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
    getTimeRemaining:  function getTimeRemaining(endtime){
      var t = Date.parse(endtime) - Date.parse(new Date());
      var seconds = Math.floor( (t/1000) % 60 );
      var minutes = Math.floor( (t/1000/60) % 60 );
      var hours = Math.floor( (t/(1000*60*60)) % 24 );
      var days = Math.floor( t/(1000*60*60*24) );
      return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
      };
    },
    initializeClock: function(id, endtime){
      var clock = document.getElementById(id);
      var timeinterval = setInterval(function(){
        var t = Kell.instance.getTimeRemaining(endtime);
        clock.innerHTML = 'days: ' + t.days + ' ' +
                          'hours: '+ t.hours + ' ' +
                          'minutes: ' + t.minutes + ' ' +
                          'seconds: ' + t.seconds;
        if(t.total<=0){
          clearInterval(timeinterval);
        }
      },1000);
    },

    clockTime: function(){setInterval(function(){
      this.today = new Date();


      var H = Kell.instance.checkTime(this.today.getHours());
      var M = Kell.instance.checkTime(this.today.getMinutes());
      var S = Kell.instance.checkTime(this.today.getSeconds());

      Kell.instance.clockEl.innerHTML = H + ' : ' + M + ' : ' + S;

      Kell.instance.textSize();




    }, 1000);},


    textSize: function(){

      var textSizee = Kell.instance.clockEl.offsetWidth/8;

      Kell.instance.clockEl.style.fontSize = textSizee + "pt";

    },

    checkTime: function(i)  {
      if (i < 10) {i = "0" + i;}
      return i;
    },

    randcolor: function(){

      Kell.instance.clockEl.style.color = "#"+((1<<12)*Math.random()|0).toString(16);
    },

    createListFromArray: function(arrayOfObjects){

      this.memos = arrayOfObjects;
      console.log(this.memos);
      //tekitan loendi htmli
      this.memos.forEach(function(memo){

        var new_memo = new memo_Jar(memo.title, memo.memo, memo.dateTime);
        //console.log(new_memo);
        var li = new_memo.createHtmlElement(Kell.instance.counter);

        document.querySelector('#memos').appendChild(li);
        console.log('clockdiv'+Kell.instance.counter);
        Kell.instance.initializeClock('clockdiv'+Kell.instance.counter, memo.dateTime);
        Kell.instance.counter ++;
      });

    },

    addMemo: function(){
      var memo = document.querySelector('#memoInput').value;
      //console.log(memo);
      var title = document.querySelector('#memoTitleInput').value;
      var dateTime = document.querySelector('#dateTime').value;
      var new_memo = new memo_Jar(title, memo, dateTime);

      console.log(Kell.instance.counter);

      //lisan massiiivi purgi
      this.memos.push(new_memo);
      console.log(JSON.stringify(this.memos));
      // JSON'i stringina salvestan localStorage'isse
      localStorage.setItem('memos', JSON.stringify(this.memos));

      //salvestan serverisse
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

          console.log('salvestas serverisse');

        }
      };

      xhttp.open("GET", "saveData.php?title="+title+"&memo=" +memo+"&dateTime=" +dateTime, true);
      xhttp.send();
      var li = new_memo.createHtmlElement(Kell.instance.counter);

      document.querySelector('#memos').appendChild(li);
      Kell.instance.initializeClock('clockdiv'+Kell.instance.counter, dateTime);

      Kell.instance.counter ++;
    },
    deleteMemo: function(){
      var memoNR = document.querySelector('#deleteMemoInput').value;
      console.log(memoNR);
      memoNR--;
      console.log(memoNR);
      console.log(this.memos);
      localStorage.removeItem('memos');
      this.memos.splice(memoNR,1);
      console.log(this.memos);
      localStorage.setItem('memos', JSON.stringify(this.memos));
    },

    changeMemo: function(){
      var memoNR = document.querySelector('#changeMemoID').value;
      var memo = document.querySelector('#changeMemoInput').value;
      var title = document.querySelector('#changeMemoTitle').value;
      var dateTime = document.querySelector('#changeDateTime').value;

      var changeMemo = new memo_Jar(title, memo, dateTime);

      memoNR--;

      localStorage.removeItem('memos');
      this.memos.splice(memoNR,1, changeMemo);
      localStorage.setItem('memos', JSON.stringify(this.memos));
    }

  };
  var memo_Jar = function(new_title, new_memo, new_date){
    this.title = new_title;
    this.memo = new_memo;
    this.dateTime = new_date;

  };

  memo_Jar.prototype = {
    createHtmlElement: function(counter){

      var li = document.createElement('li');

      var span_with_content = document.createElement('span');
      span_with_content.className = 'content';
      var content = document.createTextNode(this.title + ' | ' + this.memo + ' ');
      span_with_content.appendChild(content);

      var clockdiv = document.createElement("div");
      clockdiv.id = "clockdiv"+counter;
      span_with_content.appendChild(clockdiv);

      li.appendChild(span_with_content);

      return li;

    }
  };

  window.onload = function(){
    var app = new Kell();

  };
})();
