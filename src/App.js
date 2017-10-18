import React, { Component } from "react";
import Header from "./components/header";
import StatusBar from "./components/statusBar";
import Selector from "./components/selector";


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchedContainers: false,
      fetchedVessels: false,
      fetchedPlans: false,
      fetchError: false,

      containersList: null,
      vesselsList: null,
      plansList: null,

      currentPlan: []
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

  render() {
    const allFetchingDone = this.state.fetchedContainers && this.state.fetchedVessels && this.state.fetchedPlans;

    return (
      <div className="app">
        <Header />
        <StatusBar {...this.state} />
        {allFetchingDone ? <Selector {...this.state} /> : null}
      </div>
    );
  }
}

export default App;
