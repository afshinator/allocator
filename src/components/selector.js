import React, { Component } from "react";
import Containers from "./containers";

class Selector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      containerActive: false // true when user clicks on a container from the list on the left
    };
    this.renderPlan = this.renderPlan.bind(this);
    this.handleContainerClick = this.handleContainerClick.bind(this);
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

  renderPlan() {
    const props = this.props;

    // Go through each vessel that the API told us is available and show it
    return props.vesselsList.map((vsl, i) => {
      const vesselsContainers = this.vesselsContainers(vsl.id, props.currentPlan);
      const vesselTitle = (
        <li key={i} className="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
          <small>
            {vsl.id} - {vsl.name}
          </small>
        </li>
      );

      if (!vesselsContainers) {
        // if no containers assigned to this vessel
        return vesselTitle;
      } else {
        return (
          <li key={i} className="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
            <small>
              {vsl.id} - {vsl.name}
            </small>
            <ul>
              {vesselsContainers.map((ctr_id, j) => {
                const ctr_num = this.getObjectFromListById(props.containersList, ctr_id).container_number;
                return (
                  <li key={i * 10 + j} className="avenir lh-copy pv1">
                    <small>
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



  handleContainerClick(container_id) {
    this.setState({ containerActive: true });
    console.log('selector click on ', container_id);
  }


  renderVesselDesignator() {
    return (
      <div>
      </div>
    )
  }

  render() {
    const props = this.props;

    if (!props.containersList) {
      return null;
    }

    const vesselDesignator = this.renderVesselDesignator();
    const vesselsAndContainers = this.renderPlan();

    return (
      <section>
        { vesselDesignator }
        <article className="cf">
          <div className="fl w-50 bg-near-white tc">
            <div className="pa3 pa4-ns">
              <strong>Containers</strong>
              <Containers containersList={props.containersList} currentPlan={props.currentPlan}
                handleContainerClick={this.handleContainerClick}/>
            </div>
          </div>
          <div className="fl w-50 bg-light-gray tc">
            <div className="pa3 pa4-ns">
              <strong>Vessels and assigned containers</strong>
              <ul className="list pl0 measure tl">{vesselsAndContainers}</ul>
            </div>
          </div>
        </article>
      </section>
    );
  }
}

export default Selector;
