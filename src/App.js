import React, { Component } from "react";
import Header from "./components/header";
import StatusBar from "./components/statusBar";
import Selector from "./components/selector";

const API_HOST = "http://localhost:8000";

class App extends Component {
  constructor(props) {
    super(props);
    this.leftColClickHandler = this.leftColClickHandler.bind(this);
    this.vesselClickHandler = this.vesselClickHandler.bind(this);
    this.addContainerToVessel = this.addContainerToVessel.bind(this);
    this.resetClickHandler = this.resetClickHandler.bind(this);
    this.removeContainerClickHandler = this.removeContainerClickHandler.bind(this);
    this.removeContainerFromVessel = this.removeContainerFromVessel.bind(this);
    this.savePlanButtonHandler = this.savePlanButtonHandler.bind(this);
    this.apiCall = this.apiCall.bind(this);

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
                           2 - container on the left clicked to be moved to a vessel
                           3 - container on right clicked to be removed from a vessel
                           4 - save currentPlan button clicked
                        */
    };
  }

  componentDidMount() {
    this.apiCall( 'GET', '/containers',
      (data)=> {
        console.log("containers ", data);
        this.setState({ containersList: data }, () => {
          this.setState({ fetchedContainers: true });
        });
      },
      (err) => { this.setState({ fetchError: true }); }
    );

    this.apiCall( 'GET', '/vessels',
      (data)=> {
        console.log("vessels ", data);
        this.setState({ vesselsList: data }, () => {
          this.setState({ fetchedVessels: true });
        });
      },
      (err) => { this.setState({ fetchError: true }) }
    );

    this.apiCall( 'GET', '/vessel_plans',
      (data)=> {
        console.log("vessel_plans ", data);

        // const fakeDataForNow = [
        //   {
        //     vessel_id: 1,
        //     container_ids: [1, 2, 3]
        //   },
        //   {
        //     vessel_id: 2,
        //     container_ids: [4, 5, 6]
        //   }
        // ];
        // this.setState({ plansList: fakeDataForNow, currentPlan: fakeDataForNow }, () => {

        this.setState({ currentPlan: data}, () => {
          this.setState({ fetchedPlans: true });
        });
      },
      (err) => { this.setState({ fetchError: true }) }
    );
  }

  savePlanButtonHandler() {
    fetch(API_HOST + "/vessel_plans", {
      method: "POST",
      body: JSON.stringify(this.state.currentPlan[0]),
      mode: "no-cors",
      redirect: "follow",
      // headers: new Headers({
      //   "Content-Type": "text/plain"
      // })
    })
      // .then(resp => resp.json())
      .then(data => {
        console.log("SAVE DATA ", data);
      })
      .catch(err => {
        console.log("caught POST error ", err);
      });
  }

  apiCall( method, endpoint, success, failure ) {
    const url = API_HOST + endpoint;
    if ( method !== 'POST' ) {
      fetch( url )
        .then( resp => resp.json() )
        .then( success )
        .catch( failure );
    }
  }

  leftColClickHandler(container_id) {
    this.setState({ selectionStatus: 2, selectionData: container_id });
  }

  vesselClickHandler(vessel_id) {
    const state = this.state;
    if (state.selectionStatus === 2) {
      this.addContainerToVessel(state.selectionData, vessel_id);
    }
  }

  removeContainerClickHandler(vessel_id, container_id) {
    console.log("in app told about REMOVAL click ", container_id);
    this.setState(
      { selectionStatus: 3, selectionData: container_id },
      () => {
        let confirmDelete;
        setTimeout(() => {
          confirmDelete = window.confirm("Ready to remove containter " + container_id + " from vessel id " + vessel_id);
          if (confirmDelete) {
            this.removeContainerFromVessel(container_id);
          }
          this.setState({ selectionStatus: 0, selectionData: null });
        });
      },
      500
    ); // without this delay, I saw state was not propogating in time!
  }

  // If user clicks off app area, reset state
  resetClickHandler(e) {
    const validTarget = e.target.id;

    if (!validTarget) {
      this.setState({ selectionStatus: 0, selectionData: null });
    }
  }

  removeContainerFromVessel(ctr) {
    let newCurrentPlan = Object.assign([], this.state.currentPlan);

    for (var i = 0; i < newCurrentPlan.length; i++) {
      const index = newCurrentPlan[i].container_ids.indexOf(ctr);
      if (index > -1) {
        newCurrentPlan[i].container_ids.splice(index, 1);
      }
    }
    this.setState({ currentPlan: newCurrentPlan });
  }

  addContainerToVessel(ctr, vsl) {
    const state = this.state;

    // find the index in the data structure where vessel_id vsl exists
    const vsl_index = state.currentPlan.reduce((acc, current, i) => {
      return current.vessel_id === vsl * 1 // multiply by 1 turns a string into a digit
        ? i
        : acc;
    }, null);

    let newCurrentPlan = Object.assign([], state.currentPlan);

    // if currentPlan doesnt have any containers for this vessel
    if (vsl_index === null) {
      const newEntry = { vessel_id: vsl, container_ids: [ctr] };
      newCurrentPlan.push(newEntry);
    } else {
      newCurrentPlan[vsl_index].container_ids.push(ctr);
    }
    this.setState({ selectionStatus: 0, currentPlan: newCurrentPlan });
    console.log("adding container to vessel", ctr, vsl, vsl_index, this.state.currentPlan);
  }

  render() {
    const allFetchingDone = this.state.fetchedContainers && this.state.fetchedVessels && this.state.fetchedPlans;

    return (
      <div className="app" onClick={this.resetClickHandler}>
        <Header />
        <StatusBar {...this.state} btnHandler={this.savePlanButtonHandler} />
        {allFetchingDone ? (
          <Selector
            {...this.state}
            leftColClickHandler={this.leftColClickHandler}
            vesselClickHandler={this.vesselClickHandler}
            removeHandler={this.removeContainerClickHandler}
          />
        ) : null}
      </div>
    );
  }
}

export default App;
