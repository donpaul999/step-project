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

package com.google.sps;
import java.io.*; 
import java.util.Collection;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Arrays;


public final class FindMeetingQuery {

  /*
  * Receive events and a request and returns all the available time intervals
  */  
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
     long duration = request.getDuration();

     if(TimeRange.END_OF_DAY < duration){
            return Collections.<TimeRange>emptyList();
      }

     if(events.size() == 0){
          return Collections.singletonList(TimeRange.WHOLE_DAY);
      }

     Collection<TimeRange> result;
     result = Arrays.asList();

     ArrayList<String> requestAttendees = new ArrayList<String>(request.getAttendees());
     ArrayList<String> requestAllAttendees = new ArrayList<String>(request.getOptionalAttendees());
     requestAllAttendees.addAll(requestAttendees);

     ArrayList<TimeRange> resultList = 
        generateFreeTimeIntervals(requestAttendees, events, duration);
     ArrayList<TimeRange> resultWithOptional = 
        generateFreeTimeIntervals(requestAllAttendees, events, duration);

     if(resultWithOptional.size() == 0) result = resultList;
     else result = resultWithOptional; 

     return result;
   
  }
  
  /*
  * Creats a time range with the start time and event's start time sent as parameter.
  * Returns the time range if its duration is >= than the requested one
  */
  public TimeRange getSlot(int startTime, Event event, long duration){
    TimeRange freeTimeInterval = TimeRange.fromStartEnd(startTime, event.getWhen().start(), false);
    if(freeTimeInterval.duration() >= duration){
        return freeTimeInterval;                   
    }
    return null;  
  }

  /*
  * Returns all time ranges available for scheduling meetings for the given atendees.
  */
  public ArrayList<TimeRange> generateFreeTimeIntervals(ArrayList<String> atendees, Collection<Event> events, long duration){
     int currentStartTime = TimeRange.START_OF_DAY;
     ArrayList<TimeRange> resultList = new ArrayList<TimeRange>();
     for (Event event : events) {
         if(!atendees.containsAll(event.getAttendees())) continue;

         TimeRange eventInterval = event.getWhen();
         TimeRange slot = getSlot(currentStartTime, event, duration);
         if(slot != null){
            resultList.add(slot);
         }
         if(currentStartTime <  eventInterval.end()){
            currentStartTime = eventInterval.end();      
         }
     }

     if(TimeRange.END_OF_DAY - currentStartTime >= duration){
        resultList.add(TimeRange.fromStartEnd(currentStartTime, TimeRange.END_OF_DAY, true));
     }
    return resultList;
  }
}

