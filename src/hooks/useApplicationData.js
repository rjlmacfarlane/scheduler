import { useEffect, useState } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({

    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
    
  });

  const dayIdentifier = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4
  }

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const weekday = dayIdentifier[state.day]

    let spotsAvailable = {
      ...state.days[weekday],
      spots: state.days[weekday].spots
    }

    if (!state.appointments[id].interview) {

      spotsAvailable = {
        ...state.days[weekday],
        spots: state.days[weekday].spots - 1
      }
    } 

    let spots = state.days;
    spots[weekday] = spotsAvailable;

    setState({ ...state, appointments, spots });
    
    return axios.put(`/api/appointments/${id}`, { interview });
     
  }

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const weekday = dayIdentifier[state.day];

    const spotsAvailable = {
      ...state.days[weekday],
      spots: state.days[weekday].spots + 1
    }

    let spots = state.days;
    spots[weekday] = spotsAvailable;
    
    setState({ ...state, appointments, spots });

    return axios.delete(`/api/appointments/${id}`);
    
  };

  useEffect(() => {

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]
    ).then((all) => {

      setState(prev => ({...prev, 
        days:         all[0].data, 
        appointments: all[1].data, 
        interviewers: all[2].data}));

    })
  }, [])


  return { state, setDay, bookInterview, cancelInterview };

}