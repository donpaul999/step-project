// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.

function addRandomGreeting() {
  const greetings =
      ['Buna ziua!', 'Neata!', 'Buna seara！'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}


async function getRandomNameUsingAsync() {
  const response = await fetch('/data');
  const name = await response.text();
  document.getElementsByTagName('body').innerText = name; 
}
*/


function getMessagesFromServer() {
  var numberOfComments = document.getElementById("messages-number").value;
  if(numberOfComments == null){
      numberOfComments = 0;
  }
  
  var url = '/data?nr=' + numberOfComments;
  fetch(url).then(response => response.json()).then((messages) => {
    const messagesListElement = document.getElementById('messages-container');
    if(messagesListElement.innerHTML !== ''){
        messagesListElement.innerHTML = '';
    }

    for(i = 0; i < messages.length; ++i){
        childToAppend = createListElement(messages[i].propertyMap.content);
        childToAppend.appendChild(createButton(messages[i].propertyMap.messageId));
        messagesListElement.appendChild(childToAppend);
    }
    
    if(messages.length === 0){
        var content = "No messages available!";
        childToAppend = createListElement(content);
        messagesListElement.appendChild(childToAppend);
    }
  });
}


function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  liElement.classList.add('list-group-item');
  return liElement;
}

function createButton(messageId) {
  const buttonElement = document.createElement('button');
  buttonElement.classList.add('delete-button');
  buttonElement.textContent = "Delete";
  buttonElement.id = messageId;
  buttonElement.setAttribute( "onClick", "javascript: deleteMessage(this);" );
  return buttonElement;
}


function deleteMessage(thisButton) {
  const params = new URLSearchParams();
  var messageId = thisButton.id;
  var liElementToDelete = thisButton.parentNode;
  params.append('messageId', messageId);
  deleteLi(liElementToDelete);
  fetch('/delete-data', {method: 'POST', body: params});
}

function deleteLi(liToDelete) {
  var listWhereToRemove = liToDelete.parentNode;
  listWhereToRemove.removeChild(liToDelete);
}

function showAbout() {
  var elem1 = document.getElementById("about");
  var elem2 = document.getElementById("skills");
  var elem3 = document.getElementById("contact");

  if (elem1.style.display === "none") {
    elem1.style.display = "block";
    elem2.style.display = "none";
    elem3.style.display = "none";
  } else {
    elem1.style.display = "none";
  }
}

function showSkills() {
  var elem1 = document.getElementById("skills");
  var elem2 = document.getElementById("about");
  var elem3 = document.getElementById("contact");

  if (elem1.style.display === "none") {
    elem1.style.display = "block";
    elem2.style.display = "none";
    elem3.style.display = "none";
  } else {
    elem1.style.display = "none";
  }
}

function showContact() {
  var elem1 = document.getElementById("contact");
  var elem2 = document.getElementById("skills");
  var elem3 = document.getElementById("about");

  if (elem1.style.display === "none") {
    elem1.style.display = "block";
    elem2.style.display = "none";
    elem3.style.display = "none";
  } else {
    elem1.style.display = "none";
  }

}