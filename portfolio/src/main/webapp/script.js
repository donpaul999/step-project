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

$('.carousel').carousel({
    interval:60000
})

function getMessagesFromServer() {
  var numberOfComments = document.getElementById("messages-number").value;
  if(numberOfComments === null){
      numberOfComments = 0;
  }
  
  var url = '/data?nr=' + numberOfComments;
  console.log(numberOfComments);
  fetch(url).then(response => response.json()).then((messages) => {
    const messagesListElement = document.getElementById('messages-container');
    if(messagesListElement.innerHTML !== ''){
        messagesListElement.innerHTML = '';
    }
    for(i = 0; i < messages.length; ++i){
        messagesListElement.appendChild(createListElement(messages[i]));
    }
  });
}

function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  liElement.classList.add('list-group-item');
  return liElement;
}
