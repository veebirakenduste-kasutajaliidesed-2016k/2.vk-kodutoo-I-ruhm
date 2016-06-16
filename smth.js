var ItemList = function (selectorID) {
    return{

        itemsArray: [],
        listEl: document.getElementById(selectorID),
        idCount: 0,

        add: function(newItem){

            var id = 'myitem-' + this.idCount;
            var id2 = 'input-' +this.idCount;
            this.itemsArray.push({
                id: id,
                id2: id2,
                item: newItem
            });
            var itemSmth = document.createElement('div'),
                itemText = document.createTextNode(newItem);
            var itemSmth2 = document.createElement('input');
                itemSmth2.type = "text";
                itemSmth2.value = newItem;
                itemSmth2.setAttribute('id', id2);
                itemSmth2.setAttribute('class', 'editing');
            itemSmth.setAttribute('id', id);
            itemSmth.setAttribute('class', 'anItem');
            itemSmth.appendChild(itemText);
            itemSmth.appendChild(itemSmth2);
            this.listEl.appendChild(itemSmth);
            localStorage.setItem("item", JSON.stringify(this.itemsArray));
            console.log(this.itemsArray);
            console.log(JSON.parse(localStorage.getItem('item')));
            ++this.idCount;
            //console.log('lisab smth');

        },

        remove: function(itemID) {
            console.log(itemID);
            for(var f in this.itemsArray){
                if (this.itemsArray[f].id === itemID){
                    delete this.itemsArray[f];
                    var delItem = document.getElementById(itemID);
                    this.listEl.removeChild(delItem);
                    //console.log('kustutatud');
                }
            }
            localStorage.setItem("item", JSON.stringify(this.itemsArray));
        },

        edit: function(itemID){
            //console.log(itemID);
            for(var f in this.itemsArray){
                if (this.itemsArray[f].id2 === itemID){
                    var editItemValue = document.getElementById(itemID).value;
                    var edittext = document.getElementById(this.itemsArray[f].id);
                    edittext.firstChild.data = editItemValue;
                    this.itemsArray[f].item = editItemValue;

                    console.log(this.itemsArray[f].item);
                    console.log(editItemValue);
                    localStorage.setItem("item", JSON.stringify(this.itemsArray));

                }
            }
        },

        getstuff: function(){
            //this.itemsArray = JSON.parse(localStorage.getItem("item"));

        }
    };
};




//ronib toimetama kõike asju, mis ülal on
window.myItemList = new ItemList('items');

var localdatain = JSON.parse(localStorage.getItem('item'));
console.log(localdatain);

if (typeof this.itemsArray == "undefined" || !(this.itemsArray instanceof Array)) {
    if (localdatain === null) {
        console.log('olen siin');
        console.log(this.itemsArray);
        document.getElementById('eventBinder').addEventListener('click', function (e){
            if (e.target.id === 'addItemButton'){
                var item = document.getElementById('addItem').value;
                window.myItemList.add(item);
                console.log('lisame');
            }else if(e.target.className === 'anItem'){
                window.myItemList.remove(e.target.id);
                console.log('eemaldame');
            }else if(e.target.className ==='editing'){
                window.myItemList.edit(e.target.id);
                console.log('muudame');
            }


        }, false );

        }else{
            var localdata = (localdatain);
            console.log(this.localdata);
            //for ( var i = 0, len = localdata.length; i < len; ++i ) {
            //    //console.log( localdata.getItem( 'item' ) );
            //    console.log('oleme nüüd siin');
            //    console.log(localdata);
            //}
            this.itemsArray = JSON.parse(localStorage.getItem('item'));
            console.log(this.itemsArray[0]);
            for (var i = 0; i < this.itemsArray.length; ++i) {
               //for (var j = 0; j < this.itemsArray[i].length; ++j) {
                   var datasmth = this.itemsArray[i];
                   console.log(datasmth.item);
                   //console.log(this.itemsArray[i]);
                   console.log('mina siin');
               //}
                console.log(this.itemsArray[i]);
            }
            for(var i = 0; i < localStorage.length; i++){
                console.log(localStorage.key(i));
            }
            for(var i=0, len=localStorage.length; i<len; i++) {
                var key = localStorage.key(i);
                var value = localStorage[key];
                console.log(value);
               //if(value.equals("item"))
               console.log(key + " => " + value);
           }


            console.log('olen seal');
            console.log(this.localdata);
            console.log(this.itemsArray);
    }











}
