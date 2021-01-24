import React, { useState, useEffect } from "react";
import axios from "axios";
import DayList from "components/DayList";
import Appointment from "components/Appointment"
import "components/Application.scss";

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors"


// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//     interview: {
//       student: "Mahsa",
//       interviewer: {
//         id: 2,
//         name: "Tori Malcolm",
//         avatar: "https://i.imgur.com/Nmx0Qxo.png",
//       }
//     }
//   },
//   {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Mason",
//       interviewer: {
//         id: 3,
//         name: "Mildred Nazir",
//         avatar: "https://i.imgur.com/T2WwVfS.png",
//       }
//     }
//   },
//   {
//     id: 5,
//     time: "4pm",
//     interview: {
//       student: "Ryan",
//       interviewer: {
//         id: 4,
//         name: "Cohana Roy",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   }
// ];



// const days = [
//   {
//     id: 1,
//     name: "Monday",
//     spots: 2,
//   },
//   {
//     id: 2,
//     name: "Tuesday",
//     spots: 5,
//   },
//   {
//     id: 3,
//     name: "Wednesday",
//     spots: 0,
//   },
// ];

export default function Application(props) {

  // const [day, setDay]= useState("");
  // const [days, setDays]= useState([]);

  const [state, setState] = useState({

    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
    
  });

  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));
  // const setInterviewers = interviewers => setState(prev => ({...prev, interviewers}));
  // const setAppointments = appointments => setState(prev => ({...prev, appointments}));

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]
    ).then((all) => {
      console.log("all", all);
      setState(prev => ({...prev, 
        days:         all[0].data, 
        appointments: all[1].data, 
        interviewers: all[2].data}));
    })
  }, [])

  const interviewers = getInterviewersForDay(state, state.day);
  const appointments = getAppointmentsForDay(state, state.day);
  
  function bookInterview(id, interview) {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    setState(prev => ({...prev, appointments}));

    return axios.put(`/api/appointments/${id}`, { interview })

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

    setState(prev => ({...prev, appointments}));

    return axios.delete(`/api/appointments/${id}`)
  
  };

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

      return (
        <Appointment
          key             = {appointment.id}
          id              = {appointment.id}
          time            = {appointment.time}
          interview       = {interview}
          interviewers    = {interviewers}
          bookInterview   = {bookInterview}
          cancelInterview = {cancelInterview}
        />
      );

  });
  
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">

          <DayList days={state.days} day={state.day} setDay={setDay} />

        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">

        {schedule}

        <Appointment key="last" time="5pm" />
        
      </section>
    </main>
  );

}