function getAppointmentsForDay(state, day) {
  const apptArray = [];
  const stateData = state.days.filter(d => d.name === day)

  if (!stateData[0]) return apptArray;

  for (const appt of stateData[0].appointments) {
    apptArray.push(state.appointments[appt]);
  }

  return apptArray;
};

export { getAppointmentsForDay };