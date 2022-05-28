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
    document.getElementById("address").addEventListener("keyup", function () { searchaddress(this.value); }, false);
    document.getElementById("community").addEventListener("keyup", function () { searchname(this.value); }, false);
    document.getElementById("day").addEventListener("keyup", function () { searchday(this.value); }, false);

    loadData();
}

function loadData() {


    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            dataSet = JSON.parse(xhr.responseText);
        }
    };
    xhr.open("GET", "https://data.calgary.ca/resource/jq4t-b745.json",
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
                    setCardElementValue(newCard, 'card-name', obj.community)
                    setCardElementValue(newCard, 'card-day', obj.collection_day)
                    setCardElementValue(newCard, 'card-commo', obj.commodity)
                    setCardElementValue(newCard, 'card-quad', obj.quadrant)
                    setCardElementValue(newCard, 'card-code', obj.clect_day_code)
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






function searchname(Cname) {
    setElementInnerHTML("searchItem", "Search by community name ");
    toggleElementClass('output', 'hidden', false);
    clearCardCollection('cards');
    if (Cname && Cname.length > 0) {
        // create a card for output
        var searchbyCname;

        var matchNumber = 0;
        Cname = Cname.toLowerCase();
        for (var idx = 0; idx < dataSet.length; idx++) {
            var obj = dataSet[idx];
            searchbyCname = obj.community;
            var foundAt = searchbyCname.toLowerCase().indexOf(Cname);
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
                    setCardElementValue(newCard, 'card-name', obj.community)
                    setCardElementValue(newCard, 'card-day', obj.collection_day)
                    setCardElementValue(newCard, 'card-commo', obj.commodity)
                    setCardElementValue(newCard, 'card-quad', obj.quadrant)
                    setCardElementValue(newCard, 'card-code', obj.clect_day_code)
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
            setElementInnerHTML('cards', `Failed to Find '${Cname}'`);
        }
    }
}

function searchday(day) {
    setElementInnerHTML("searchItem", "Search by day");
    toggleElementClass('output', 'hidden', false);
    clearCardCollection('cards');
    if (day && day.length > 0) {
        // create a card for output
        var searchbyday;

        var matchNumber = 0;
        day = day.toLowerCase();
        for (var idx = 0; idx < dataSet.length; idx++) {
            var obj = dataSet[idx];
            searchbyday = obj.collection_day;
            var foundAt = searchbyday.toLowerCase().indexOf(day);
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
                    setCardElementValue(newCard, 'card-name', obj.community)
                    setCardElementValue(newCard, 'card-day', obj.collection_day)
                    setCardElementValue(newCard, 'card-commo', obj.commodity)
                    setCardElementValue(newCard, 'card-quad', obj.quadrant)
                    setCardElementValue(newCard, 'card-code', obj.clect_day_code)
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
            setElementInnerHTML('cards', `Failed to Find '${day}'`);
        }
    }
}
