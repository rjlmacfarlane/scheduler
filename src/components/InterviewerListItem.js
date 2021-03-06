import React from "react";
import classnames from "classnames";

import "components/InterviewerListItem.scss";

export default function InterviewerListItem(props) {

  const interviewerClass = classnames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });

  const interviewerImgClass = classnames("interviewers__item-image", {
    "interviewers__item--selected-image": props.selected
  });

  return (
    
    <li className={interviewerClass} data-testid="interview-item" onClick={props.setInterviewer}>
      <img
        className={interviewerImgClass}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>

  );
}