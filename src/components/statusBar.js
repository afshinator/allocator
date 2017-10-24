import React, { Component } from "react";

const statusMessages = [
  'Click a container in the left column to assign it, or click a container on the right to remove it from that vessel',
  '<not used>',
  'Now click on a vessel in the right column to assign the container.',
  'Confirm to remove the container from this vessel.',
  'Saved current plan.',
];

class StatusBar extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {}

  render() {
    const props = this.props;

    // Fetching from one of the API's threw an error
    if (props.fetchError) {
      return (
        <section className="bg-light-red dt-ns dt--fixed-ns">
          <div className="dtc-ns tc pv12 bg-black-10">
            <p>Uh oh, problems fetching from the API</p>
          </div>
        </section>
      );
    }

    // No Error (yet), so we're either in the middle of loading data or all loading finished
    const allFetchingDone = props.fetchedContainers && props.fetchedVessels && props.fetchedPlans;
    const containerCount = props.fetchedContainers ? props.containersList.length : 0;
    const vesselCount = props.fetchedVessels ? props.vesselsList.length : 0;
    const planText = props.fetchedPlans && props.currentPlan.length ? "loaded" : "none saved";

    if (!allFetchingDone) {
      return (
        <section className="dt-ns dt--fixed-ns">
          <div className="dtc-ns tc pv4 bg-black-10">Containers:{containerCount}</div>
          <div className="dtc-ns tc pv4 bg-black-05">Vessels:{vesselCount}</div>
          <div className="dtc-ns tc pv4 bg-black-10">Plan:{planText}</div>
        </section>
      );
    } else {
      const statusMsg = props.selectionStatus < 2
          ? statusMessages[0]
          : statusMessages[ props.selectionStatus ];

      return (
        <section className="dt-ns dt--fixed-ns">
          <div className="dtc-ns tc pv12 bg-black-10">
            <p>
              <em>All API data successfully loaded.  </em>
              Containers: {containerCount}, Vessels: {vesselCount}, Plan:{planText}
            </p>
            <p>{ statusMsg }</p>
          </div>
        </section>
      );
    }

  }
}

export default StatusBar;
