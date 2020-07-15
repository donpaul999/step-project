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

package com.google.sps.servlets;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import java.io.IOException;
import java.lang.Math; 
import java.util.List;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.datastore.FetchOptions;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    
    String stringNumberOfMessages = request.getParameter("nr");
    int numberOfMessages = Integer.parseInt(stringNumberOfMessages);
    
    if(numberOfMessages == 0){
        numberOfMessages = 100;
    }

    Query query = new Query("Message").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery preparedQuery = datastore.prepare(query);
    List<Entity> results = preparedQuery.asList(FetchOptions.Builder.withLimit(numberOfMessages));

    ArrayList<Entity> messages = new ArrayList<>();
    for (Entity entity : results) {
      String messageText = (String) entity.getProperty("content");
      long messageId = entity.getKey().getId();
      Entity newMessage = new Entity("Message");
      newMessage.setProperty("content", messageText);
      newMessage.setProperty("messageId", messageId);
      messages.add(newMessage);
    }

    String json = convertToJsonUsingGson(messages);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }
  
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String newMessage = getParameter(request, "text-input", "");
    if(newMessage != ""){
        long timestamp = System.currentTimeMillis();
        Entity messageEntity = new Entity("Message");
        messageEntity.setProperty("content", newMessage);
        messageEntity.setProperty("timestamp", timestamp);
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(messageEntity);
    }

    response.sendRedirect("/index.html");
  }

  private String convertToJsonUsingGson(ArrayList<Entity> messages) {
    Gson gson = new Gson();
    String json = gson.toJson(messages);
    return json;
  }

  private String getParameter(HttpServletRequest request, String name,  String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }
}
