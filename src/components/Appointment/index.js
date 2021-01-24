import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import useVisualMode from "../../hooks/useVisualMode";

import "./styles.scss";

export default function Appointment(props) {

  const EMPTY        = "EMPTY";
  const SHOW         = "SHOW";
  const CREATE       = "CREATE";
  const SAVING       = "SAVING";
  const DELETE       = "DELETING";
  const CONFIRM      = "CONFIRM"
  const EDIT         = "EDIT";
  const ERROR_SAVE   = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {

    const interview = {
      student: name,
      interviewer
    };
    
    transition(SAVING)

    Promise.resolve(props.bookInterview(props.id, interview))
      .then(() => transition(SHOW))
      .catch(error => {
        transition(ERROR_SAVE, true)
        console.log(error)
      });

  };

  function deleteAppt() {

    transition(DELETE, true);

    Promise.resolve(props.cancelInterview(props.id))
      .then(() => transition(EMPTY))
      .catch(error => {
        transition(ERROR_SAVE, true)
        console.log(error)
      });

  };

  return ( 
  
  <article className="appointment">
    <Header time={props.time} />
    { mode === EMPTY && <Empty onAdd={() => transition(CREATE)} /> }
    { mode === SHOW  && (
    
    <Show
      student     = {props.interview.student}
      interviewer = {props.interview.interviewer}
      onDelete    = {() => transition(CONFIRM)}
      onEdit      = {() => transition(EDIT)}
    />

    )}

    {mode === CREATE && (
      <Form 
        interviewers = {props.interviewers}
        onCancel     = {back}
        onSave       = {save}
      />
    )}
    
    {mode === SAVING && (
      <Status 
        message = "Saving.."
      />
      )}
    
    {mode === DELETE && (
      <Status 
        message = "Deleting.."
      />
    )}
    
    {mode === CONFIRM && (
      <Confirm 
        message   = "Do you really want to delete this appointment?"
        onConfirm = {deleteAppt}
        onCancel  = {back}
      />
    )}

    {mode === EDIT && (
      <Form 
        name         = {props.interview.student}
        interviewer  = {props.interview.interviewer.id}
        interviewers = {props.interviewers}
        onCancel     = {back}
        onSave       = {save}
      />
    )}

    {mode === ERROR_SAVE && (
        <Error 
          message="Failed to save. Please try again."
          onClose={back}
        />
      )}

    {mode === ERROR_DELETE && (
      <Error 
        message="Failed to delete. Please try again."
        onClose={back}
      />
    )}

  </article> 

  );
}