import React, { Component } from "react";

const RED = "#C0392B";

class RightVessels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeState: false,
      activeContainerId: null
    };

    this.vesselClickHandler = this.vesselClickHandler.bind(this);
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
    const props = this.props;
    const id = e.target.id;
    let vessel_id;

    // sometimes the click is on a border or otherwise ill defined
    if (!id) return;

    if (id.indexOf("_") === -1) {
      // no underline in id, so a click on a vessel
      vessel_id = id * 1;
      if (props.selectionStatus === 2) {
        // we must be adding a new container
        this.props.vesselClickHandler(vessel_id);
      }
      return;
    } else {
      // click was on a container
      vessel_id = id.replace(/(^\d+)(.+$)/i, "$1") * 1; // grab first number
      const container_id = id.substring(id.indexOf("_") + 1) * 1;
      if ( props.selectionStatus === 2 ) {
        this.props.vesselClickHandler(vessel_id);
        return;
      }
      this.setState({ activeState: true, activeContainerId : container_id })
      props.removeHandler(vessel_id, container_id);
    }
  }

  renderPlan() {
    const props = this.props;

    // Go through each vessel that the API told us is available and show it
    return props.vesselsList.map((vsl, i) => {
      const vesselsContainers = this.vesselsContainers(vsl.id, props.currentPlan);
      const vesselTitle = (
        <li
          key={i}
          className="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30 pointer"
          onClick={this.vesselClickHandler}
        >
          <small id={vsl.id}>
            {vsl.id} - {vsl.name}
          </small>
        </li>
      );

      if (!vesselsContainers) {
        // if no containers assigned to this vessel
        return vesselTitle;
      } else {
        const isInMiddleOfDeletion = (props.selectionStatus === 3);
        return (
          <li
            key={i}
            className="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30 pointer"
            onClick={this.vesselClickHandler}
          >
            <small id={vsl.id}>
              {"   "}
              {vsl.id} - {vsl.name}
            </small>
            <ul>
              {vesselsContainers.map((ctr_id, j) => {
                const ctr_num = this.getObjectFromListById(props.containersList, ctr_id).container_number;
                const color =  ( isInMiddleOfDeletion && ctr_id === props.selectionData )
                  ? { color: RED }
                  : { };

                return (
                  <li key={i * 10 + j} className="avenir lh-copy pv1">
                    <small id={vsl.id + "_" + ctr_id} style={color}>
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
