import React, { Component } from "react";

const statusMessages = [
  "Click a container in the left column to assign it, or click a container on the right to remove it from that vessel",
  "<not used>",
  "Now click on a vessel in the right column to assign the container.",
  "Confirm to remove the container from this vessel.",
  "Saved current plan."
];

class StatusBar extends Component {
  constructor(props) {
    super(props);
    this.btnClick = this.btnClick.bind(this);
    this.state = { firstTime: true };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectionStatus !== this.props.selectionStatus) {
      if (this.state.firstTime) this.setState({ firstTime: false });
    }
  }

  btnClick() {
    if ( this.props.selectionStatus === 0 && !this.state.firstTime ) {
      this.props.btnHandler();
    }
    console.log("the button clicked")
  }

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
      const statusMsg = props.selectionStatus < 2 ? statusMessages[0] : statusMessages[props.selectionStatus];
      const btnCss = props.selectionStatus === 0 && !this.state.firstTime
        ? "pa3 pa4-ns dtc-ns v-mid"
        : "pa3 pa4-ns dtc-ns v-mid o-10"
      return (
        <section className="ph3 ph1-ns pv3 avenir">
          <article className="mw8 center br2 ba b--light-blue ">
            <div className="dt-ns dt--fixed-ns w-100">
              <div className="pa2 pa3-ns dtc-ns v-mid">
                <div>
                  <span>
                    {
                      this.state.firstTime
                        ? ( <strong>All API data successfully loaded. </strong> )
                        : null
                    }
                    <h5>Total containers: {containerCount}, vessels: {vesselCount}</h5>
                  </span>

                  <p className="black-70 measure lh-copy mv0 f6">{statusMsg}</p>
                </div>
              </div>
              <div className={ btnCss } onClick={this.btnClick} id={'x'}>
                <a className="no-underline f6 tc db w-100 pv3 bg-animate bg-blue hover-bg-dark-blue white br2">
                  Save Plan
                </a>
              </div>
            </div>
          </article>
        </section>
      );
    }
  }
}

export default StatusBar;
