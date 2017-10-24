import React, { Component } from "react";
import Header from "./components/header";
import StatusBar from "./components/statusBar";
import Selector from "./components/selector";

class App extends Component {
  constructor(props) {
    super(props);
    this.leftColClickHandler = this.leftColClickHandler.bind(this);
    this.vesselClickHandler = this.vesselClickHandler.bind(this);
    this.addContainerToVessel = this.addContainerToVessel.bind(this);
    this.resetClickHandler = this.resetClickHandler.bind(this);

    this.state = {
      fetchedContainers: false, // did we get containers api data?
      fetchedVessels: false, // did we get vessels api data?
      fetchedPlans: false, // did we get plans api data?
      fetchError: false, // true when there was any api error

      containersList: null, // api data
      vesselsList: null,
      plansList: null,

      currentPlan: [], // users modified plan

      selectionData: null, // When user selects something, this keeps track of it
      selectionStatus: 0 /* 0 - initial state,
                           1 - api's loaded data without error, nothing selected by user yet
                           2 - container on the left clicked to be moved to a vessel
                           3 - container on right clicked to be removed from a vessel
                           4 - save currentPlan button clicked
                        */
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/containers")
      .then(resp => resp.json()) // Transform the data into json
      .then(data => {
        console.log("containers ", data);
        this.setState({ containersList: data }, () => {
          this.setState({ fetchedContainers: true });
        });
      })
      .catch(err => {
        this.setState({ fetchError: true });
      });

    fetch("http://localhost:8000/vessels")
      .then(resp => resp.json()) // Transform the data into json
      .then(data => {
        console.log("vessels ", data);
        this.setState({ vesselsList: data }, () => {
          this.setState({ fetchedVessels: true });
        });
      })
      .catch(err => {
        this.setState({ fetchError: true });
      });

    fetch("http://localhost:8000/vessel_plans")
      .then(resp => resp.json()) // Transform the data into json
      .then(data => {
        const fakeDataForNow = [
          {
            vessel_id: 1,
            container_ids: [1, 2, 3]
          },
          {
            vessel_id: 2,
            container_ids: [4, 5, 6]
          }
        ];
        console.log("vessels_plans ", data, fakeDataForNow);
        this.setState({ plansList: fakeDataForNow, currentPlan: fakeDataForNow }, () => {
          // this.setState({ plansList: data, currentPlan: data }, () => {
          this.setState({ fetchedPlans: true });
        });
      })
      .catch(err => {
        this.setState({ fetchError: true });
      });
  }

  leftColClickHandler(container_id) {
    console.log("in app told about left container click ", container_id);
    this.setState({ selectionStatus: 2, selectionData: container_id });
  }

  vesselClickHandler(container_id) {
    const state = this.state;
    console.log("in app told about VESSEL click ", container_id);
    if (state.selectionStatus === 2) {
      this.addContainerToVessel(state.selectionData, container_id);
    }
  }

  // If user clicks off app area, reset state
  resetClickHandler(e) {
    console.log('CLICK ON RESET ', e.target.id );
    const targetId = e.target.id;
    if ( !targetId ) {
      this.setState({ selectionStatus: 0, selectionData: null });
    }
  }

  addContainerToVessel(ctr, vsl) {
    const state = this.state;

    // find the index in the data structure where vessel_id vsl exists
    const vsl_index = state.currentPlan.reduce((acc, current, i) => {
      console.log("checking ", typeof current.vessel_id, typeof vsl);
      return current.vessel_id === vsl * 1 // multiply by 1 turns a string into a digit
        ? i
        : acc;
    }, null);

    let newCurrentPlan = Object.assign( [], state.currentPlan );

    // if currentPlan doesnt have any containers for this vessel
    if (vsl_index === null) {
      const newEntry = { vessel_id: vsl, container_ids: [ctr] };
      newCurrentPlan.push( newEntry );
    }
    else {
      newCurrentPlan[vsl_index].container_ids.push(ctr);
    }
    this.setState({ selectionStatus: 0, currentPlan: newCurrentPlan });
    console.log("adding container to vessel", ctr, vsl, vsl_index, this.state.currentPlan);
  }

  render() {
    const allFetchingDone = this.state.fetchedContainers && this.state.fetchedVessels && this.state.fetchedPlans;

    return (
      <div className="app" onClick={ this.resetClickHandler }>
        <Header />
        <StatusBar {...this.state} />
        {allFetchingDone ? (
          <Selector
            {...this.state}
            leftColClickHandler={this.leftColClickHandler}
            vesselClickHandler={this.vesselClickHandler}
          />
        ) : null}
      </div>
    );
  }
}

export default App;
