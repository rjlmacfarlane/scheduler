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

export { getAppointmentsForDay, getInterview };