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

function handleFunctionsOnLoad() {
  testLogIn();
  handleGetCommentsClick();
  stoppedTyping();
}

async function handleGetCommentsClick() {
  const messages = await getCommentsFromServer();
  renderComments(messages);
}

async function handleSendCommentClick() {
  await sendCommentToServer();
  const messages = await getCommentsFromServer();
  renderComments(messages);
}

async function handleDeleteCommentClick(buttonElement) {
  await deleteComment(buttonElement);
  const messages = await getCommentsFromServer();
  renderComments(messages);
}

async function handleTranslateComments() {
  var comments = await translateComments();
  renderComments(comments);
}

async function sendCommentToServer() {
  const params = new URLSearchParams();
  var messageContent = document.getElementById('textarea-add-comments').value;
  var email = document.getElementById('email-input').value;
  params.append('messageContent', messageContent);
  params.append('email', email);
  await fetch('/data', { method: 'POST', body: params });
}

async function getCommentsFromServer() {
  var numberOfComments = document.getElementById('comments-number').value;
  if (numberOfComments === '') {
    numberOfComments = 100;
  }
  var url = '/data?nr=' + numberOfComments;
  return fetch(url).then((response) => response.json());
}

function renderComments(messages) {
  const messagesListElement = document.getElementById('comments-container');
  if (messagesListElement.innerHTML !== '') {
    messagesListElement.innerHTML = '';
  }

  for (var i = 0; i < messages.length; ++i) {
    var domListElement = createDOMListElement();
    domListElement.appendChild(
      createDOMButton(messages[i].propertyMap.messageId),
    );
    domListElement.appendChild(createDOMSpan(messages[i].propertyMap.email));
    domListElement.appendChild(
      createDOMParagraph(messages[i].propertyMap.content),
    );
    messagesListElement.appendChild(domListElement);
  }

  if (messages.length === 0) {
    var content = 'No comments available!';
    var domListElement = createDOMListElement();
    domListElement.innerText = content;
    messagesListElement.appendChild(domListElement);
  }
}

function createDOMListElement() {
  const domListElement = document.createElement('li');
  domListElement.classList.add('list-group-item');
  return domListElement;
}

function createDOMSpan(email) {
  const emailSpan = document.createElement('span');
  emailSpan.classList.add('user');
  if (email !== '') {
    emailSpan.innerText = email;
  }
  return emailSpan;
}

function createDOMParagraph(text) {
  const domParagraphElement = document.createElement('p');
  if (text !== undefined) {
    domParagraphElement.innerText = text;
  }
  return domParagraphElement;
}

function createDOMButton(messageId) {
  const domButtonElement = document.createElement('button');
  domButtonElement.classList.add('delete-button');
  domButtonElement.classList.add('button-property');
  domButtonElement.id = messageId;
  domButtonElement.innerText = 'x';
  domButtonElement.setAttribute(
    'onClick',
    'javascript: handleDeleteCommentClick(this);',
  );
  return domButtonElement;
}

async function deleteComment(thisButton) {
  const params = new URLSearchParams();
  var messageId = thisButton.id;
  var liElementToDelete = thisButton.parentNode;
  var op = 1;
  var timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      liElementToDelete.style.display = 'none';
    }
    liElementToDelete.style.opacity = op;
    liElementToDelete.style.filter = 'alpha(opacity=' + op * 100 + ')';
    op -= op * 0.1;
  }, 50);
  params.append('messageId', messageId);
  await fetch('/delete-data', { method: 'POST', body: params });
}

function testLogIn() {
  const params = new URLSearchParams();
  fetch('/home')
    .then((response) => response.json())
    .then((userStatus) => {
      if (userStatus.propertyMap.email) {
        document.getElementById('comments').style.display = 'block';
        document.getElementById('log-out').style.display = 'flex';
        document.getElementById('email-input').value =
          userStatus.propertyMap.email;
        document.getElementById('log-out-link').href =
          userStatus.propertyMap.link;
      } else {
        document.getElementById('log-in').style.display = 'block';
        document.getElementById('log-in').style.textAlign = 'center';
        document.getElementById('log-in-link').href =
          userStatus.propertyMap.link;
      }
    });
}

async function translateComments() {
  const languageCode = document.getElementById('languages-list').value;
  var comments = await getCommentsFromServer();
  for (var i = 0; i < comments.length; ++i) {
    var params = new URLSearchParams();
    params.append('message', comments[i].propertyMap.content);
    params.append('languageCode', languageCode);
    comments[i].propertyMap.content = await fetch('/translate', {
      method: 'POST',
      body: params,
    })
      .then((response) => response.text())
      .then((translatedMessage) => {
        return translatedMessage;
      });
  }
  return comments;
}

function stoppedTyping(){
    if(document.getElementById('textarea-add-comments').value.length > 0) { 
        document.getElementById('submit-button').disabled = false; 
    } else { 
        document.getElementById('submit-button').disabled = true;
    }
}