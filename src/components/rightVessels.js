import React, { Component } from "react";

class RightVessels extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.vesselClickHandler = this.vesselClickHandler.bind(this);
    this.handleRightContainerClick = this.handleRightContainerClick.bind(this);
  }

  handleRightContainerClick(e) {
    const container_id = e.target.id;
  }

  // Get either a vessel or container details from its respective list
  getObjectFromListById(list, id) {
    let val = list.reduce((acc, current) => {
      if (current.id === id) {
        return current;
      } else return acc;
    }, {});

    return val;
  }

  // returns null if passed in vessel (by id) has no assigned containers
  // else returns the list of assigned containers for that vessel id from the plan
  vesselsContainers(vessel_id, plan) {
    return plan.reduce((acc, current) => {
      if (current.vessel_id === vessel_id) {
        return current.container_ids;
      } else return acc;
    }, null);
  }

  vesselClickHandler(e) {
    const vessel_id = e.target.id * 1;
    console.log("IN vessel click ", vessel_id);
    this.props.vesselClickHandler(vessel_id);
  }

  renderPlan() {
    const props = this.props;

    // Go through each vessel that the API told us is available and show it
    return props.vesselsList.map((vsl, i) => {
      const vesselsContainers = this.vesselsContainers(vsl.id, props.currentPlan);
      const vesselTitle = (
        <li key={i} className="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30" onClick={this.vesselClickHandler}>
          <small id={vsl.id}>
            {vsl.id} - {vsl.name}
          </small>
        </li>
      );

      if (!vesselsContainers) {
        // if no containers assigned to this vessel
        return vesselTitle;
      } else {
        return (
          <li key={i} className="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30" onClick={this.vesselClickHandler}>
            <small id={vsl.id}>
              {"   "}
              {vsl.id} - {vsl.name}
            </small>
            <ul>
              {vesselsContainers.map((ctr_id, j) => {
                const ctr_num = this.getObjectFromListById(props.containersList, ctr_id).container_number;
                return (
                  <li key={i * 10 + j} className="avenir lh-copy pv1">
                    <small id={"sometihng"}>
                      {ctr_id} - {ctr_num}
                    </small>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      }
    });
  }

  render() {
    const props = this.props;
    const readyForGetContainer = props.selectionStatus === 2;
    const border = readyForGetContainer
      ? { border: "1px dashed #2874A6", borderRadius: "5px", padding: "5px" }
      : { padding: "5px" };

    return (
      <ul className="list pl0 measure tl" style={border}>
        {this.renderPlan()}
      </ul>
    );
  }
}

export default RightVessels;
