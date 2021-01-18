import React from "react";
import classnames from 'classnames/bind';
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const itemStyles = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  })

  const formatSpots = function(spots) {
    switch (spots) {
      case (0): return 'No spots remaining';
      case (1): return `${spots} spot remaining`;
      default : return `${spots} spots remaining`;
    }
  }

  return (
    <li className={itemStyles} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}