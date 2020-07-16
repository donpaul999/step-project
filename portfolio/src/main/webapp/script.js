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

function showSection(idToShow) {
  var elem1 = document.getElementById("about");
  var elem2 = document.getElementById("skills");
  var elem3 = document.getElementById("contact");
  var elem4 = document.getElementById(idToShow);
  var statusOfElem4 = elem4.style.display;
  elem1.style.display = "none";
  elem2.style.display = "none";
  elem3.style.display = "none";
  if (statusOfElem4 === "none") {
    elem4.style.display = "block";
  } 
}

function testLogIn(){
  const params = new URLSearchParams();
  fetch('/home').then(response => response.json()).then((userStatus) => {
      console.log(userStatus);
      if(userStatus.propertyMap.email){
        document.getElementById("log-out").style.display = "block";
        document.getElementById("email-text").innerText = "Hi, " + userStatus.propertyMap.email + "!";
        document.getElementById("log-out-link").href = userStatus.propertyMap.link;
      }
      else{
        document.getElementById("log-in").style.display = "block";
        document.getElementById("log-in-link").href = userStatus.propertyMap.link;
      }
  });
}