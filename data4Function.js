/*jsonfilehandler.js*/

"use strict;"

// Declare some global variables
var xhr = new XMLHttpRequest();
var dataSet = [];

// Add the onload event handler that will be called when the web page is loaded and read
window.onload = initializeWebpage;

function initializeWebpage() {

    if (document.createElement("template").content) {
        console.log("Your browser supports templates!");
    } else {
        console.log("Your browser does not support templates!");
    }

    //event listeners for onkeyup

    document.getElementById("name").addEventListener("keyup", function () { searchname(this.value); }, false);
    document.getElementById("address").addEventListener("keyup", function () { searchaddress(this.value); }, false);
    document.getElementById("number").addEventListener("keyup", function () { searchphone(this.value); }, false);

    loadData();
}

function loadData() {


    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            dataSet = JSON.parse(xhr.responseText);
        }
    };
    xhr.open("GET", "https://data.calgary.ca/resource/ap4r-bav3.json",
        true);
    xhr.send();
}
// function SearchResultHeaders() {
// 	var htmlFragment = `
// 	<tr><th>Full Name</th><th>Phone</th><th>City </th><th>id Number</th><th>Company</th></tr>";
// 	`;
// 	return htmlFragment;
// }

function setElementInnerHTML(id, htmlFragment) {
    var element = document.getElementById(id);
    if (element && element.innerHTML !== undefined) {
        element.innerHTML = htmlFragment;
    }
    else {
        console.log(`Could not find element id='${id} on the web page`);
    }
    return element;
}

function toggleElementClass(id, className, force) {
    var element = document.getElementById(id);
    if (element && element.classList !== undefined) {
        element.classList.toggle(className, force);
    }
    else {
        console.log(`Could not find element id='${id} on the card`);
    }
    return element;
}

function clearCardCollection(id) {
    var element = document.getElementById(id);
    if (element) {
        element.innerHTML = "";
    }
}

function addCardToCollection(id, card) {
    var element = document.getElementById(id);
    if (element) {
        element.appendChild(card);
    }
}

function getNewCard(templateid, newCardid) {
    // see https://www.w3schools.com/tags/tag_template.asp
    var cardTemplate = document.getElementById(templateid);
    if (cardTemplate && cardTemplate.content !== undefined) {
        // Make a clone of the template
        var newCard = null;
        // Find the first child node that is and element (nodeType = 1) and clone it
        // see https://www.w3schools.com/jsref/prop_node_nodetype.asp
        for (let idx = 0; idx < cardTemplate.content.childNodes.length; idx++) {
            if (cardTemplate.content.childNodes[idx].nodeType === 1) {
                newCard = cardTemplate.content.childNodes[idx].cloneNode(true);
                if (newCard) {
                    // Populate the id
                    newCard.setAttribute('id', newCardid);
                    break;
                }
            }
        }
    }
    else {
        console.log(`Could not find template card id='card-template'`);
    }
    return newCard;
}

function setCardElementValue(card, className, htmlFragment) {
    var element = card.getElementsByClassName(className);
    if (element && element.length > 0) {
        element[0].innerHTML = htmlFragment;
    }
    else {
        console.log(`Could not find element id='${className}' on the card`);
    }
    return element;
}










function searchname(Sname) {
    setElementInnerHTML("searchItem", "Search by station name ");
    toggleElementClass('output', 'hidden', false);
    clearCardCollection('cards');
    if (Sname && Sname.length > 0) {
        // create a card for output
        var searchbySname;

        var matchNumber = 0;
        Sname = Sname.toLowerCase();
        for (var idx = 0; idx < dataSet.length; idx++) {
            var obj = dataSet[idx];
            searchbySname = obj.name;
            var foundAt = searchbySname.toLowerCase().indexOf(Sname);
            if (foundAt > -1) {
                var newCardid = `card-${matchNumber}`;
                var newCard = getNewCard('card-template', newCardid);
                var lat = obj.latitude;
                var long = obj.longitude;
                var locate = `<a href="https://www.google.ca/maps/place/${lat},${long}" target="_blank"> See the location</a>`;
                if (newCard) {
                    // Copy the template
                    setCardElementValue(newCard, 'card-id', (matchNumber + 1))
                    setCardElementValue(newCard, 'card-name', obj.name)
                    setCardElementValue(newCard, 'card-addr', obj.address)

                    setCardElementValue(newCard, 'card-phone', obj.info)
                    setCardElementValue(newCard, 'card-type', obj.station_ty)
                    setCardElementValue(newCard, 'card-locate', locate)

                    // Add the new card to the collection
                    addCardToCollection('cards', newCard);
                }
                else {
                    console.log(`Could not create new card template`);
                }
                matchNumber++;
            }
        }
        if (matchNumber == 0) {
            setElementInnerHTML('cards', `Failed to Find '${Sname}'`);
        }
    }
}


function searchaddress(addr) {
    setElementInnerHTML("searchItem", "Search by address");
    toggleElementClass('output', 'hidden', false);
    clearCardCollection('cards');
    if (addr && addr.length > 0) {
        // create a card for output
        var searchbyaddr;

        var matchNumber = 0;
        addr = addr.toLowerCase();
        for (var idx = 0; idx < dataSet.length; idx++) {
            var obj = dataSet[idx];
            searchbyaddr = obj.address;
            var foundAt = searchbyaddr.toLowerCase().indexOf(addr);
            if (foundAt > -1) {
                var newCardid = `card-${matchNumber}`;
                var newCard = getNewCard('card-template', newCardid);
                var lat = obj.latitude;
                var long = obj.longitude;
                var locate = `<a href="https://www.google.ca/maps/place/${lat},${long}" target="_blank"> See the location</a>`;
                if (newCard) {
                    // Copy the template
                    setCardElementValue(newCard, 'card-id', (matchNumber + 1))
                    setCardElementValue(newCard, 'card-addr', obj.address)
                    setCardElementValue(newCard, 'card-name', obj.name)
                    setCardElementValue(newCard, 'card-phone', obj.info)
                    setCardElementValue(newCard, 'card-type', obj.station_ty)
                    setCardElementValue(newCard, 'card-locate', locate)

                    // Add the new card to the collection
                    addCardToCollection('cards', newCard);
                }
                else {
                    console.log(`Could not create new card template`);
                }
                matchNumber++;
            }
        }
        if (matchNumber == 0) {
            setElementInnerHTML('cards', `Failed to Find '${addr}'`);
        }
    }
}


function searchphone(phone) {
    setElementInnerHTML("searchItem", "Search by Phone number");
    toggleElementClass('output', 'hidden', false);
    clearCardCollection('cards');
    if (phone && phone.length > 0) {
        // create a card for output
        var searchbyphone;

        var matchNumber = 0;
        phone = phone.toLowerCase();
        for (var idx = 0; idx < dataSet.length; idx++) {
            var obj = dataSet[idx];
            searchbyphone = obj.info;
            var foundAt = searchbyphone.toLowerCase().indexOf(phone);
            if (foundAt > -1) {
                var newCardid = `card-${matchNumber}`;
                var newCard = getNewCard('card-template', newCardid);
                var lat = obj.latitude;
                var long = obj.longitude;
                var locate = `<a href="https://www.google.ca/maps/place/${lat},${long}" target="_blank"> See the location</a>`;
                if (newCard) {
                    // Copy the template
                    setCardElementValue(newCard, 'card-id', (matchNumber + 1))
                    setCardElementValue(newCard, 'card-addr', obj.address)
                    setCardElementValue(newCard, 'card-name', obj.name)
                    setCardElementValue(newCard, 'card-phone', obj.info)
                    setCardElementValue(newCard, 'card-type', obj.station_ty)
                    setCardElementValue(newCard, 'card-locate', locate)

                    // Add the new card to the collection
                    addCardToCollection('cards', newCard);
                }
                else {
                    console.log(`Could not create new card template`);
                }
                matchNumber++;
            }
        }
        if (matchNumber == 0) {
            setElementInnerHTML('cards', `Failed to Find '${phone}'`);
        }
    }
}