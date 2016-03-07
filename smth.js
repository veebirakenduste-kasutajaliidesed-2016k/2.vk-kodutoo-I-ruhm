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
            ++this.idCount;
            //console.log('lisab smth');
            //console.log(this.itemsArray);


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

var localdata = localStorage.getItem('item');
console.log(localdata);

if (typeof this.itemsArray == "undefined" || !(this.itemsArray instanceof Array)) {
    if (localdata === null) {
        console.log('olen siin');
        console.log(itemsArray);
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

    console.log('olen seal');
    var itemsArray = [];
    var data = JSON.parse(localdata);
    console.log(data[i]);
    for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        window.myItemList.add(data[i]);
        itemsArray.push(data[i]);


    }
    window.myItemList.add(this.data);

    console.log(this.itemsArray);
    //console.log('tyhi');
    }
}
