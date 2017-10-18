import React, { Component } from "react";
// import logo from "../img/shipping_container.jpg";

class StatusBar extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    const props = this.props;
    // console.log(this.props);

    if (props.fetchedContainers && props.fetchedVessels && props.fetchedPlans) {
      return (
        <section className="dt-ns dt--fixed-ns">
          <div className="dtc-ns tc pv12 bg-black-10">
            <p>All API data successfully loaded</p>
          </div>
        </section>
      );
    } else if (props.fetchError) {
      return (
        <section className="bg-light-red dt-ns dt--fixed-ns">
          <div className="dtc-ns tc pv12 bg-black-10">
            <p>Uh oh, problems fetching from the API</p>
          </div>
        </section>
      );
    } else {
      const fetchedContainers = props.fetchedContainers ? "containers loaded " : "loading containers";
      const fetchedVessels = props.fetchedVessels ? "vessels loaded " : "loading vessels";
      const fetchedPlans = props.fetchedPlans ? "plans loaded " : "loading plan";

      return (
        <section className="dt-ns dt--fixed-ns">
          <div className="dtc-ns tc pv4 bg-black-10">{fetchedContainers}</div>
          <div className="dtc-ns tc pv4 bg-black-05">{fetchedVessels}</div>
          <div className="dtc-ns tc pv4 bg-black-10">{fetchedPlans}</div>
        </section>
      );
    }
  }
}

export default StatusBar;
