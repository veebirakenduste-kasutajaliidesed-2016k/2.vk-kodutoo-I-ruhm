var FunList = function (selectorID){
    return{
        //määrame muutujad aga saame aru, et siit ta itemsList-i kaasa ei võta
        idCount: 0,
        itemsList: ( typeof itemsList != 'undefined' && itemsList instanceof Array ) ? itemsList : [],
        listEl: document.getElementById(selectorID),
        //localdataloading123: localStorage.setItem("item", JSON.stringify([])),
        localdataloading: JSON.parse(localStorage.getItem("item")),

        read: function (){
            //console.log('siin olen');

            //reading from localstorage
            if(this.itemsList === null){

                itemsList = ( typeof itemsList != 'undefined' && itemsList instanceof Array ) ? itemsList : [];
                this.itemsList = itemsList;
                localStorage.setItem("item", JSON.stringify(this.itemsList));
                this.localdataloading = JSON.parse(localStorage.getItem("item"));
                console.log('kui itemislist on null');


            }




            if(this.localdataloading === null){
                localStorage.setItem("item", JSON.stringify([]));
                console.log('sätib localStorage paika');
            }
            //console.log(this.localdataloading);
            this.itemsList = this.localdataloading;

            if (this.localdataloading[0] !== null && this.localdataloading[0] !== undefined){


                //juhul, kui esmalugemisel localStorage ei ole tühi
                console.log('localStorage ei ole tühi');
                //lahendab selle jama, et oleks kellelgi sama id
                var lastidname = this.itemsList[this.itemsList.length -1].id;
                console.log(lastidname);
                var lastitemid = lastidname.replace("itemno-", "");
                console.log(lastitemid);
                //console.log(lastitemid);
                this.idCount = parseInt(lastitemid) +1;
                console.log(this.idCount);
                //kukub joonistama välja localstorageist tulnud manti
                for (var i = 0; i < this.itemsList.length; i++) {
                    window.myItemList.draw(this.itemsList[i].id, this.itemsList[i].item);
                }
            }else{
                //juhul, kui esmalugemisel localStorage on tühi
                console.log('localStorage on tühi');
                //taaskord ei leia ta itemsList i ülesse
                itemsList = ( typeof itemsList != 'undefined' && itemsList instanceof Array ) ? itemsList : [];
                this.itemsList = itemsList;
                this.itemsList = JSON.parse(localStorage.getItem("item"));
                //console.log(this.itemsList);

            }


            console.log('Loeme localStorage - i');
            console.log(this.itemsList);
            console.log('Localstorage listi pikkus on- ' + this.idCount );
        },
        add: function (newItem){
            // adding to localstorage and on page

            var id = 'itemno-' + this.idCount;
            var item = newItem;
            //console.log('lisame-' + newItem);
            itemsList = this.localdataloading;
            console.log(this.itemList);
            console.log(itemsList);
            //see siin oli probleemiga kui itemsList ei defininud ennast ära
            if (this.itemsList !== null){

                //kui itemsList ei ole tühi
                console.log('itemsList on tühi ja lisame uue');

                this.itemsList.push({
                    id: id,
                    item: newItem
                });
            }else{
                console.log('itemsLis-is on midagi ja lisame juurde id-'+id+' item-i '+item );
                //kui itemsList on tühi
                itemsList = ( typeof itemsList != 'undefined' && itemsList instanceof Array ) ? itemsList : [];
                itemsList.push({
                    id: id,
                    item: newItem
                });
                this.itemsList = itemsList;
            }
            console.log(this.itemsList);
            //et oleks localStorage ka ajaga kursis
            localStorage.setItem("item", JSON.stringify(this.itemsList));
            window.myItemList.draw(id, item);
            console.log(this.idCount);
            ++this.idCount;

        },
        draw: function(itemid, itemtext){
            //joonistab välja kogu manti, mis on
            console.log(itemid, itemtext);
            var output = document.createElement('div');
                output.setAttribute('id', itemid);
                output.setAttribute('class', 'midagi');
            var itemText = document.createElement('p');
                itemText.setAttribute('class','itemText');
                textOutput = document.createTextNode(itemtext);
                itemText.appendChild(textOutput);

            var deletebutton = document.createElement("BUTTON"),
                deletebuttontext = document.createTextNode('Delete');
                deletebutton.appendChild(deletebuttontext);
                deletebutton.setAttribute('class', 'deletebutton');
                deletebutton.setAttribute('id', itemid);
            var editbutton = document.createElement("BUTTON"),
                editbuttontext = document.createTextNode('Edit');
                editbutton.appendChild(editbuttontext);
                editbutton.setAttribute('class', 'editbutton');
                editbutton.setAttribute('id', itemid);
            output.appendChild(deletebutton);
            output.appendChild(editbutton);
            output.appendChild(itemText);
            this.listEl.appendChild(output);

        },
        remove: function(itemid){
            //kustutab nii localStorage kui lehelt ära valitud asja
            //vastavalt siis delete buttonile
            //console.log(this.itemsList);
            //console.log('kustutame-' + itemid);
            for(var f in this.itemsList){
                if(this.itemsList[f].id === itemid){
                    this.itemsList.splice([f] , 1);
                    var deleteItem = document.getElementById(itemid);
                    this.listEl.removeChild(deleteItem);
                    console.log('kustutatud '+ itemid);
                }
            }

            //console.log(JSON.stringify(this.itemsList));
            localStorage.setItem("item", JSON.stringify(this.itemsList));
        },
        edit: function(itemid){
            //console.log(itemid);

            for(var f in this.itemsList){
                if(this.itemsList[f].id === itemid){
                    var editbox = document.createElement("INPUT");
                        editbox.type = "text";
                        editbox.setAttribute('class', 'input');
                        var value = document.getElementById(itemid).className;
                        console.log(document.getElementById(itemid).childNodes[2].innerHTML);
                        editbox.value = document.getElementById(itemid).childNodes[2].innerHTML;
                        editbox.setAttribute('id', itemid);
                        //editbox.setAttribute('class', 'editbox');
                        //console.log(document.getElementById(itemid).textContent);

                        var savebutton = document.createElement("BUTTON"),
                            savebuttontext = document.createTextNode('Save');
                            savebutton.appendChild(savebuttontext);
                            savebutton.setAttribute('class', 'savebutton');
                            savebutton.setAttribute('id', itemid);
                            console.log(document.getElementById(itemid).childNodes.length);
                            if(document.getElementById(itemid).childNodes.length <4){
                                console.log("pole olemas");

                                document.getElementById(itemid).appendChild(editbox);
                                document.getElementById(itemid).appendChild(savebutton);
                            }else{
                                console.log("on olemas");
                            }


            }


            }
        },
        save: function(itemid){
            console.log(itemid);
            var list = document.getElementById(itemid);
                console.log(list.childNodes[3].value);

                console.log(this.itemsList);

                for (var i = 0; i < this.itemsList.length; i++) {
                    if(this.itemsList[i].id == itemid){

                        this.itemsList[i].item = list.childNodes[3].value;
                        console.log(this.itemsList[i].item);
                        list.childNodes[2].innerHTML = list.childNodes[3].value;
                        localStorage.setItem("item", JSON.stringify(this.itemsList));
                    }
                }


                list.removeChild(list.childNodes[4]);
                list.removeChild(list.childNodes[3]);

        }


    };
};
window.myItemList = new FunList('items');


//console.log('sorage.js');

// on loading start with localstorage
document.getElementById('eventBinder').addEventListener("load", window.myItemList.read());
document.getElementById('eventBinder').addEventListener("click",function(e){
    if(e.target.id === 'addItemButton'){
        itemsList = ( typeof itemsList != 'undefined' && itemsList instanceof Array ) ? itemsList : [];
        var item = document.getElementById('addItem').value;
        window.myItemList.add(item);
    }else if(e.target.className ==='deletebutton'){
        window.myItemList.remove(e.target.id);
    }else if(e.target.className ==='editbutton'){
        window.myItemList.edit(e.target.id);
    }else if(e.target.className ==='savebutton'){
        window.myItemList.save(e.target.id);
    }
});
document.getElementById('eventBinder').addEventListener("click",function(e){

}

);
