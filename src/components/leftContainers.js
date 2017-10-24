import React, { Component } from "react";

const RED = "#C0392B";
const BLACK = "#000";
const FADED = "#ccc";

class LeftContainers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeState: false,
      activeContainerId: null
    };
    this.containerIsAssigned = this.containerIsAssigned.bind(this);
    this.handleLeftContainerClick = this.handleLeftContainerClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectionStatus === 0) {
      this.setState({ activeState: false, activeContainerId: null });
    }
  }

  // Check in the current plan and see if the container_id passed in is assigned to any vessels
  containerIsAssigned(container_id) {
    const currentPlan = this.props.currentPlan;
    const result = currentPlan.reduce((acc, current) => {
      return current.container_ids.includes(container_id) ? true : acc;
    }, false);

    return result;
  }

  handleLeftContainerClick(e) {
    const container_id = e.target.id * 1; // multiply by 1 is a shortcut to turn string into a number in js

    this.setState(
      {
        activeState: true,
        activeContainerId: container_id
      },
      () => {
        this.props.handleLeftContainerClick(container_id);
      }
    );
  }

  render() {
    const props = this.props;
    const readyForClick = false; // props.selectionStatus < 2;
    const border = readyForClick
    ? { border: "1px dashed blue", borderRadius: "5px", cursor: 'pointer' }
    : {};

    return (
      <ul className="list pl0 measure center" style={border}>
        {props.containersList.map((x, i) => {
          const containerAssigned = this.containerIsAssigned(x.id);

          const color = containerAssigned
            ? FADED // faded color for already assigned containers
            : this.state.activeState && this.state.activeContainerId * 1 === x.id * 1 ? RED : BLACK;

          // only attach click handler if the container is not assigned to a vessel
          const markup = containerAssigned ? (
            <small>
              {x.id} - {x.container_number}
            </small>
          ) : (
            <small onClick={this.handleLeftContainerClick} id={x.id} className="pointer">
              {x.id} - {x.container_number}
            </small>
          );

          return (
            <li style={{ color }} key={i} className="avenir lh-copy pv1 ba bl-0 bt-0 br-0 b--dotted b--black-30">
              {markup}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default LeftContainers;
