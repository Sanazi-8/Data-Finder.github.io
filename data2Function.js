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
    document.getElementById("treeName").addEventListener("keyup", function () { searchname(this.value); }, false);
    document.getElementById("rating").addEventListener("keyup", function () { searchrating(this.value); }, false);
    document.getElementById("commCode").addEventListener("keyup", function () { searchcode(this.value); }, false);

    loadData();
}

function loadData() {


    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            dataSet = JSON.parse(xhr.responseText);
        }
    };
    xhr.open("GET", "https://data.calgary.ca/resource/tfs4-3wwa.json",
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


function searchname(Tname) {
    setElementInnerHTML("searchItem", "Search by Tree Name");
    toggleElementClass('output', 'hidden', false);
    clearCardCollection('cards');
    if (Tname && Tname.length > 0) {
        // create a card for output
        var searchbyTname;

        var matchNumber = 0;
        Tname = Tname.toLowerCase();
        for (var idx = 0; idx < dataSet.length; idx++) {
            var obj = dataSet[idx];
            searchbyTname = obj.common_name;
            var foundAt = searchbyTname.toLowerCase().indexOf(Tname);
            if (foundAt > -1) {
                var newCardid = `card-${matchNumber}`;
                var newCard = getNewCard('card-template', newCardid);
                var lat = obj.latitude;
                var long = obj.longitude;
                var locate = `<a href="https://www.google.ca/maps/place/${lat},${long}" target="_blank"> See the location</a>`;
                if (newCard) {
                    // Copy the template
                    setCardElementValue(newCard, 'card-id', (matchNumber + 1))
                    setCardElementValue(newCard, 'card-name', obj.common_name)
                    setCardElementValue(newCard, 'card-rating', obj.rating)
                    setCardElementValue(newCard, 'card-code', obj.comm_code)
                    setCardElementValue(newCard, 'card-genus', obj.genus)
                    setCardElementValue(newCard, 'card-mat', obj.mature_size)
                    setCardElementValue(newCard, 'card-wamId', obj.wam_id)
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
            setElementInnerHTML('cards', `Failed to Find '${Tname}'`);
        }
    }
}

function searchrating(rate) {
    setElementInnerHTML("searchItem", "Search by rating");
    toggleElementClass('output', 'hidden', false);
    clearCardCollection('cards');
    if (rate && rate.length > 0) {
        // create a card for output
        var searchbyrate;

        var matchNumber = 0;
        rate = rate.toLowerCase();
        for (var idx = 0; idx < dataSet.length; idx++) {
            var obj = dataSet[idx];
            searchbyrate = obj.rating;
            var foundAt = searchbyrate.toLowerCase().indexOf(rate);
            if (foundAt > -1) {
                var newCardid = `card-${matchNumber}`;
                var newCard = getNewCard('card-template', newCardid);
                var lat = obj.latitude;
                var long = obj.longitude;
                var locate = `<a href="https://www.google.ca/maps/place/${lat},${long}" target="_blank"> See the location</a>`;
                if (newCard) {
                    // Copy the template
                    setCardElementValue(newCard, 'card-id', (matchNumber + 1))
                    setCardElementValue(newCard, 'card-name', obj.common_name)
                    setCardElementValue(newCard, 'card-rating', obj.rating)
                    setCardElementValue(newCard, 'card-code', obj.comm_code)
                    setCardElementValue(newCard, 'card-genus', obj.genus)
                    setCardElementValue(newCard, 'card-mat', obj.mature_size)
                    setCardElementValue(newCard, 'card-wamId', obj.wam_id)
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
            setElementInnerHTML('cards', `Failed to Find '${rate}'`);
        }
    }
}

function searchcode(code) {
    setElementInnerHTML("searchItem", "Search by community");
    toggleElementClass('output', 'hidden', false);
    clearCardCollection('cards');
    if (code && code.length > 0) {
        // create a card for output
        var searchbycode;

        var matchNumber = 0;
        code = code.toLowerCase();
        for (var idx = 0; idx < dataSet.length; idx++) {
            var obj = dataSet[idx];
            searchbycode = obj.comm_code;
            var foundAt = searchbycode.toLowerCase().indexOf(code);
            if (foundAt > -1) {
                var newCardid = `card-${matchNumber}`;
                var newCard = getNewCard('card-template', newCardid);
                var lat = obj.latitude;
                var long = obj.longitude;
                var locate = `<a href="https://www.google.ca/maps/place/${lat},${long}" target="_blank"> See the location</a>`;
                if (newCard) {
                    // Copy the template
                    setCardElementValue(newCard, 'card-id', (matchNumber + 1))
                    setCardElementValue(newCard, 'card-name', obj.common_name)
                    setCardElementValue(newCard, 'card-rating', obj.rating)
                    setCardElementValue(newCard, 'card-code', obj.comm_code)
                    setCardElementValue(newCard, 'card-genus', obj.genus)
                    setCardElementValue(newCard, 'card-mat', obj.mature_size)
                    setCardElementValue(newCard, 'card-wamId', obj.wam_id)
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
            setElementInnerHTML('cards', `Failed to Find '${code}'`);
        }
    }
}