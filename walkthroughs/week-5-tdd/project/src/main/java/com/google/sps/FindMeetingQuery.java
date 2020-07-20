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
      Collection<TimeRange> result;
      Collection<String> requestAttendees = request.getAttendees();
      Collection<String> requestOptionalAttendees = request.getOptionalAttendees();
      
      ArrayList<TimeRange> resultList = new ArrayList<TimeRange>();
      ArrayList<TimeRange> resultWithOptional = new ArrayList<TimeRange>();
      
      int previousEventEndTime = TimeRange.START_OF_DAY;
      int previousEventTimeOptionalAttendees = TimeRange.START_OF_DAY;
      long requestedTime = request.getDuration();

      result = Arrays.asList();
      
      if(TimeRange.END_OF_DAY < requestedTime){
            return result;
      }

      if(events.size() == 0){
          result = Arrays.asList(TimeRange.WHOLE_DAY);
          return result;
      }
      

     for (Event event : events) {
         Collection<String> eventAttendees = event.getAttendees();
         TimeRange eventInterval = event.getWhen();
         int eventStartTime = eventInterval.start();
         if(requestAttendees.containsAll(eventAttendees)){
            if(previousEventEndTime + requestedTime <= eventStartTime){
                    resultList.add(TimeRange.fromStartEnd(previousEventEndTime, eventStartTime, false));
            }
            if(previousEventEndTime <  eventInterval.end())
                previousEventEndTime =  eventInterval.end();

            if(previousEventTimeOptionalAttendees + requestedTime <= eventStartTime){
                resultWithOptional.add(TimeRange.fromStartEnd(previousEventTimeOptionalAttendees, eventStartTime, false));
                }
            if(previousEventTimeOptionalAttendees <  eventInterval.end())
                previousEventTimeOptionalAttendees =  eventInterval.end();
            } 

         if(requestOptionalAttendees.containsAll(eventAttendees)){
            if(previousEventTimeOptionalAttendees + requestedTime <= eventStartTime){
                    resultWithOptional.add(TimeRange.fromStartEnd(previousEventTimeOptionalAttendees, eventStartTime, false));
                }
            if(previousEventTimeOptionalAttendees <  eventInterval.end())
                    previousEventTimeOptionalAttendees =  eventInterval.end();      
            }
        }

     if(previousEventEndTime <= TimeRange.END_OF_DAY)
        resultList.add(TimeRange.fromStartEnd(previousEventEndTime, TimeRange.END_OF_DAY, true));
     
     if(previousEventTimeOptionalAttendees < TimeRange.END_OF_DAY)
            resultWithOptional.add(TimeRange.fromStartEnd(previousEventTimeOptionalAttendees, TimeRange.END_OF_DAY, true));

     if(resultWithOptional.size() == 0)
        result = resultList;
     else
        result = resultWithOptional; 

      return result;
  }
}
