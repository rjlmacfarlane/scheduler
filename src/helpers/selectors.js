function getAppointmentsForDay(state, day) {

  const apptArray = [];
  const stateData = state.days.filter(d => d.name === day)

  if (!stateData[0]) return apptArray;

  for (const appt of stateData[0].appointments) {
    apptArray.push(state.appointments[appt]);
  }

  return apptArray;
};


function getInterview(state, interview) {

  if (interview) {

    const interviewer = state.interviewers[interview.interviewer];
    return { ...interview, interviewer };

  }

  return null;

};


function getInterviewersForDay(state, day) {

  const interviewerArray = [];
  const dayData = state.days.filter(d => d.name === day)

  if (!dayData[0]) return interviewerArray;

    for (const interviewer of dayData[0].interviewers) {
      interviewerArray.push(state.interviewers[interviewer]);
    }
  
  return interviewerArray;
};

export { getAppointmentsForDay, getInterview, getInterviewersForDay };