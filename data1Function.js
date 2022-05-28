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
    document.getElementById("incident").addEventListener("keyup", function () { searchincident(this.value); }, false);
    document.getElementById("desc").addEventListener("keyup", function () { searchdesc(this.value); }, false);
    document.getElementById("date").addEventListener("keyup", function () { searchdate(this.value); }, false);

    loadData();
}

function loadData() {


    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            dataSet = JSON.parse(xhr.responseText);
        }
    };
    xhr.open("GET", "https://data.calgary.ca/resource/35ra-9556.json",
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


function searchincident(incident) {
    setElementInnerHTML("searchItem", "Search by where the incident happened");
    toggleElementClass('output', 'hidden', false);
    clearCardCollection('cards');
    if (incident && incident.length > 0) {
        // create a card for output
        var searchincidentLocation;
        var matchNumber = 0;
        incident = incident.toLowerCase();
        for (var idx = 0; idx < dataSet.length; idx++) {
            var obj = dataSet[idx];
            searchincidentLocation = obj.incident_info;
            var foundAt = searchincidentLocation.toLowerCase().indexOf(incident);
            if (foundAt > -1) {
                var newCardid = `card-${matchNumber}`;
                var newCard = getNewCard('card-template', newCardid);
                var lat = obj.latitude;
                var long = obj.longitude;
                var locate = `<a href="https://www.google.ca/maps/place/${lat},${long}" target="_blank"> See the location</a>`;
                if (newCard) {
                    // Copy the template
                    setCardElementValue(newCard, 'card-id', (matchNumber + 1))
                    setCardElementValue(newCard, 'card-incident', obj.incident_info)
                    setCardElementValue(newCard, 'card-Desc', obj.description)
                    setCardElementValue(newCard, 'card-date', obj.start_dt)
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
            setElementInnerHTML('cards', `Failed to Find '${incident}'`);
        }
    }
}

function searchdesc(desc) {
    setElementInnerHTML("searchItem", "Search by a short description of the incident");
    toggleElementClass('output', 'hidden', false);
    clearCardCollection('cards');
    if (desc && desc.length > 0) {
        // create a card for output
        var searchbydesc;
        var matchNumber = 0;
        desc = desc.toLowerCase();
        for (var idx = 0; idx < dataSet.length; idx++) {
            var obj = dataSet[idx];
            searchbydesc = obj.description;
            var foundAt = searchbydesc.toLowerCase().indexOf(desc);
            if (foundAt > -1) {
                var newCardid = `card-${matchNumber}`;
                var newCard = getNewCard('card-template', newCardid);
                var lat = obj.latitude;
                var long = obj.longitude;
                var locate = `<a href="https://www.google.ca/maps/place/${lat},${long}" target="_blank"> See the location</a>`;
                if (newCard) {
                    // Copy the template
                    setCardElementValue(newCard, 'card-id', (matchNumber + 1))
                    setCardElementValue(newCard, 'card-incident', obj.incident_info)
                    setCardElementValue(newCard, 'card-Desc', obj.description)
                    setCardElementValue(newCard, 'card-date', obj.start_dt)
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
            setElementInnerHTML('cards', `Failed to Find '${desc}'`);
        }
    }
}

function searchdate(date) {
    setElementInnerHTML("searchItem", "Search by the date the incident took place");
    toggleElementClass('output', 'hidden', false);
    clearCardCollection('cards');
    if (date && date.length > 0) {
        // create a card for output
        var searchbydate;
        var matchNumber = 0;
        date = date.toLowerCase();
        for (var idx = 0; idx < dataSet.length; idx++) {
            var obj = dataSet[idx];
            searchbydate = obj.start_dt;
            var foundAt = searchbydate.toLowerCase().indexOf(date);
            if (foundAt > -1) {
                var newCardid = `card - ${matchNumber} `;
                var newCard = getNewCard('card-template', newCardid);

                var lat = obj.latitude;
                var long = obj.longitude;
                var locate = `<a href="https://www.google.ca/maps/place/${lat},${long}" target="_blank"> See the location</a>`;
                if (newCard) {
                    // Copy the template
                    setCardElementValue(newCard, 'card-id', (matchNumber + 1))
                    setCardElementValue(newCard, 'card-incident', obj.incident_info)
                    setCardElementValue(newCard, 'card-Desc', obj.description)
                    setCardElementValue(newCard, 'card-date', obj.start_dt)
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
            setElementInnerHTML('cards', `Failed to Find '${date}'`);
        }
    }
}




