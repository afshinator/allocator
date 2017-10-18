import React, { Component } from "react";

const RED = "#C0392B";
const BLACK = "#000";
const FADED = "#AAA";

class Containers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeState: false,
      activeContainerId: null
    };
    this.containerIsAssigned = this.containerIsAssigned.bind(this);
    this.handleContainerClick = this.handleContainerClick.bind(this);
  }

  // Check in the current plan and see if the container_id passed in is assigned to any vessels
  containerIsAssigned(container_id) {
    const currentPlan = this.props.currentPlan;
    return currentPlan.reduce((acc, current) => {
      return current.container_ids.includes(container_id) ? true : false;
    }, false);
  }

  handleContainerClick(e) {
    const container_id = e.target.id;
    this.setState(
      {
        activeState: true,
        activeContainerId: container_id
      }, () => {
        this.props.handleContainerClick(container_id);
      }
    );
  }

  render() {
    const props = this.props;

    return (
      <ul className="list pl0 measure center">
        {props.containersList.map((x, i) => {
          const containerAssigned = this.containerIsAssigned(x.id);

          const color = containerAssigned
            ? FADED // faded color for already assigned containers
            : (this.state.activeState && this.state.activeContainerId*1 === x.id*1) ? RED : BLACK;

          // only attach click handler if the container is not assigned to a vessel
          const markup = containerAssigned ? (
            <small>
              {x.id} - {x.container_number}
            </small>
          ) : (
            <small onClick={this.handleContainerClick} id={x.id}>
              {x.id} - {x.container_number}
            </small>
          );

          return (
            <li key={i} className="avenir lh-copy pv1 ba bl-0 bt-0 br-0 b--dotted b--black-30" style={{ color }}>
              {markup}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default Containers;
