(function(){
  "use strict";

  var Meelespea = function(){
    if(Meelespea.instance){
      return Meelespea.instance;
    }
    Meelespea.instance = this;
    this.routes = Meelespea.routes;
    this.currentRoute = null;
    this.clock_year = document.querySelector("#clock_year");
    this.clock_month = document.querySelector("#clock_month");
    this.clock_date = document.querySelector("#clock_date");
    this.clock_day = document.querySelector("#clock_day");
    this.clock_hour = document.querySelector("#clock_hour");
    this.clock_minute = document.querySelector("#clock_minute");
    this.clock_second = document.querySelector("#clock_second");
    this.rundown = document.querySelector("#rundown");
    this.alert = document.querySelector("#error");
    this.events = [];
    this.init();
  };

  window.Meelespea = Meelespea;

  Meelespea.routes = {
    'home-view': {
      'render': function(){}
    },
    'insert-view': {
      'render': function(){}
    },
    'list-view': {
      'render': function(){}
    }
  };

  Meelespea.prototype = {

    init: function(){
      this.writeTime();
      this.writeRunDown();
      window.setInterval(this.writeTime.bind(this), 1000);
      window.setInterval(this.writeRunDown.bind(this), 1000);
      window.addEventListener('hashchange', this.routeChange.bind(this));
      if(!window.location.hash){
        window.location.hash = 'home-view';
      }else{
        this.routeChange();
      }
      if(localStorage.events){
        this.events = JSON.parse(localStorage.events);
        this.events.forEach(function(event){
          var new_event = new Event(event.event_date, event.event_description);
          var li = new_event.createHtmlElement();
          document.querySelector('#list_of_events').appendChild(li);
        });
      }
      this.clickOnButton();
    },

    clickOnButton: function(){
      document.querySelector('#add_new_event').addEventListener('click', this.newClick.bind(this));
    },

    newClick: function(event){
      var event_date = document.querySelector('#event_time').value;
      var event_description = document.querySelector('#event_description').value;
      /* Siin kontrollitakse ära, et väärtused on sisestatud ja et sisestatud kell ja kuupäev on käesolevast suurem */
      if(event_date && event_description && Date.parse(event_date) > Date.parse(Date())){
        var new_event = new Event(event_date, event_description);
        this.events.push(new_event);
        console.log(JSON.stringify(this.events));
        localStorage.setItem('events', JSON.stringify(this.events));
        var li = new_event.createHtmlElement();
        document.querySelector('#list_of_events').appendChild(li);
        error.innerHTML = "";
      }else if(Date.parse(event_date) < Date.parse(Date())){
        error.innerHTML = "Kuupäev peab olema tulevikus!";
      }else{
        error.innerHTML = "Tekst või kuupäev puudub!";
      }
    },

    writeTime: function(){

      clock_year.innerHTML = "";
      clock_month.innerHTML = "";
      clock_date.innerHTML = "";
      clock_hour.innerHTML = "";
      clock_minute.innerHTML = "";
      clock_second.innerHTML = "";

      for(var i = 1; i < 13; i++){
        if(i%2 === 0){
          clock_month.innerHTML += this.showCurrentTime(this.setZeroBefore(i), "select_month") + "<br>";
        }else{
          clock_month.innerHTML += this.showCurrentTime(this.setZeroBefore(i), "select_month");
        }
      }

      for(i = 1; i < 37; i++){
        if(i > 31){
          clock_date.innerHTML += "00";
        }else if(i%6 === 0){
          clock_date.innerHTML += this.showCurrentTime(this.setZeroBefore(i), "select_date") + "<br>";
        }else{
          clock_date.innerHTML += this.showCurrentTime(this.setZeroBefore(i), "select_date");
        }
      }

      for(i = 1; i < 25; i++){
        if(i === 24){
          clock_year.innerHTML += this.showCurrentTime(2024, "select_year");
          clock_hour.innerHTML += this.showCurrentTime(this.setZeroBefore(0), "select_hour");
        }else if(i%4 === 0){
          clock_year.innerHTML += this.showCurrentTime(i + 2000, "select_year") + "<br>";
          clock_hour.innerHTML += this.showCurrentTime(this.setZeroBefore(i), "select_hour") + "<br>";
        }else{
          clock_year.innerHTML += this.showCurrentTime(i + 2000, "select_year");
          clock_hour.innerHTML += this.showCurrentTime(this.setZeroBefore(i), "select_hour");
        }
      }

      for(i = 1; i < 61; i++){
        if(i === 60){
          clock_minute.innerHTML += this.showCurrentTime(this.setZeroBefore(0), "select_minute");
          clock_second.innerHTML += this.showCurrentTime(this.setZeroBefore(0), "select_second");
        }else if(i%10 === 0){
          clock_minute.innerHTML += this.showCurrentTime(this.setZeroBefore(i), "select_minute") + "<br>";
          clock_second.innerHTML += this.showCurrentTime(this.setZeroBefore(i), "select_second") + "<br>";
        }else{
          clock_minute.innerHTML += this.showCurrentTime(this.setZeroBefore(i), "select_minute");
          clock_second.innerHTML += this.showCurrentTime(this.setZeroBefore(i), "select_second");
        }
      }
    },

    showCurrentTime: function(number, format){

      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth() + 1;
      var date = today.getDate();
      var day = today.getDay();
      var hour = today.getHours();
      var minute = today.getMinutes();
      var second = today.getSeconds();

      if(format === "select_year" && number === year){
          number = "<font color='black'><b>" + number + "</font></b>";
      }else if(format === "select_month" && number === this.setZeroBefore(month)){
          number = "<font color='black'><b>" + number + "</font></b>";
      }else if(format === "select_date" && number === this.setZeroBefore(date)){
          number = "<font color='black'><b>" + number + "</font></b>";
      }else if(format === "select_hour" && number === this.setZeroBefore(hour)){
          number = "<font color='black'><b>" + number + "</font></b>";
      }else if(format === "select_minute" && number === this.setZeroBefore(minute)){
          number = "<font color='black'><b>" + number + "</font></b>";
      }else if(format === "select_second" && number === this.setZeroBefore(second)){
          number = "<font color='black'><b>" + number + "</font></b>";
      }
      return number;
    },

    setZeroBefore: function(number){
      if(number < 10){
        number = '0' + number;
      }
      return number;
    },

    writeRunDown: function(){
      if(localStorage.events){
        /* Leian ajaliselt lähima sündmuse */
        var closestDate = "2100-01-01 01:00";
        var closestEvent = "";
        for(var i = 0; i < JSON.parse(localStorage.events).length; i++){
          if(Date.parse(JSON.parse(localStorage.events)[i].event_date) > Date.parse(Date()) && JSON.parse(localStorage.events)[i].event_date < closestDate){
            closestDate = JSON.parse(localStorage.events)[i].event_date;
            closestEvent = JSON.parse(localStorage.events)[i].event_description;
          }
        }
        /* Leian vahe sündmuse ja hetkeaja vahel ning prindin selle välja */
        if(closestDate != "2100-01-01 01:00"){
          var today = new Date();
          var minute = today.getMinutes();
          var seconds = ((Date.parse(closestDate) - Date.parse(today))/1000);
          var minutes = Math.floor(seconds/60);
          var hours = Math.floor(minutes/60);
          minutes = minutes - (hours*60);
          seconds = seconds - (minutes*60) - (hours*60*60);
          rundown.innerHTML = this.setZeroBefore(hours) + ":" + this.setZeroBefore(minutes) + ":" + this.setZeroBefore(seconds);
          if(hours === 0 && minutes === 0 && seconds === 1){
            alert(closestEvent);
          }
        }else{
          rundown.innerHTML = "Kõik sündmused on möödas";
        }
      }else{
        rundown.innerHTML = "Ühtegi sündmust pole sisestatud";
      }
    },

    routeChange: function(){
      this.currentRoute = location.hash.slice(1);
      if(this.routes[this.currentRoute]){
        this.updateMenu();
        this.routes[this.currentRoute].render();
      }
    },

    updateMenu: function(){
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');
       document.querySelector('.'+this.currentRoute).className += ' active-menu';
    }

  };

  var Event = function(new_event_date, new_event_description){
    this.event_date = new_event_date;
    this.event_description = new_event_description;
  };

  Event.prototype = {
    createHtmlElement: function(){
      var li = document.createElement('li');
      var span_with_content = document.createElement('span');
      span_with_content.className = 'content';
      var content = document.createTextNode(this.event_date + ' | ' + this.event_description);
      span_with_content.appendChild(content);
      li.appendChild(span_with_content);
      return li;
    }

  };

  window.onload = function(){
    var app = new Meelespea();
  };

})();
