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


async function getCommentsFromServer() {
  var numberOfComments = document.getElementById("comments-number").value;
  if(numberOfComments === ""){
      numberOfComments = 100;
  }
  var url = '/data?nr=' + numberOfComments;
  return fetch(url).then(response =>response.json());
}

async function handleGetCommentsClick(){
   const messages = await getCommentsFromServer();
   renderComments(messages);
}

function renderComments(messages){
    const messagesListElement = document.getElementById('comments-container');
    if(messagesListElement.innerHTML !== ''){
        messagesListElement.innerHTML = '';
    }

    for(var i = 0; i < messages.length; ++i){
        var domListElement = createDOMListElement(messages[i].propertyMap.email, messages[i].propertyMap.content);
        domListElement.appendChild(createDOMButton(messages[i].propertyMap.messageId));
        messagesListElement.appendChild(domListElement);
    }
    
    if(messages.length === 0){
        var content = "No comments available!";
        var domListElement = createDOMListElement(content);
        messagesListElement.appendChild(domListElement);
    }
}

function createDOMListElement(email, text) {
  const domListElement = document.createElement('li');
  if(email != "")
   domListElement.innerText = email + ": ";
  domListElement.innerText += text;
  domListElement.classList.add('list-group-item');
  return domListElement;
}

function createDOMButton(messageId) {
  const domButtonElement = document.createElement('button');
  domButtonElement.classList.add('delete-button');
  domButtonElement.textContent = "Delete";
  domButtonElement.id = messageId;
  domButtonElement.setAttribute( "onClick", "javascript: handleDeleteCommentClick(this);" );
  return domButtonElement;
}

function handleDeleteCommentClick(buttonElement){
   deleteComment(buttonElement);
   const messages = getCommentsFromServer();
   renderComments(messages);
}

function deleteComment(thisButton) {
  const params = new URLSearchParams();
  var messageId = thisButton.id;
  var liElementToDelete = thisButton.parentNode;
  params.append('messageId', messageId);
  fetch('/delete-data', {method: 'POST', body: params});
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
      if(userStatus.propertyMap.email){
        document.getElementById("comments").style.display = "block";
        document.getElementById("log-out").style.display = "block";
        document.getElementById("email-input").value = userStatus.propertyMap.email;
        document.getElementById("email-text").innerText = "Hi, " + userStatus.propertyMap.email + "!";
        document.getElementById("log-out-link").href = userStatus.propertyMap.link;
      }
      else{
        document.getElementById("log-in").style.display = "block";
        document.getElementById("log-in-link").href = userStatus.propertyMap.link;
      }
  });
}

async function translateComments(){
    const languageCode = document.getElementById('languages-list').value;
    const params = new URLSearchParams();
    params.append('languageCode', languageCode);
    params.append('messages', await getCommentsFromServer());
    fetch('/translate', {
        method: 'POST',
        body: params
    }).then(response => response.json())
        .then((messages) => {
          console.log(messages);
          renderComments(messages);
        }); 
}