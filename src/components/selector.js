import React, { Component } from "react";
import LeftContainers from "./leftContainers";
import RightVessels from "./rightVessels";

class Selector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      containerActive: false // true when user clicks on a container from the list on the left
    };

    this.handleLeftContainerClick = this.handleLeftContainerClick.bind(this);
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




  handleLeftContainerClick(container_id) {
    this.setState({ containerActive: true });
    this.props.leftColClickHandler(container_id);
  }


  render() {
    const props = this.props;

    if (!props.containersList) {
      return null;
    }

    return (
      <section>
        <article className="cf">
          <div className="fl w-50 bg-near-white tc">
            <div className="pa3 pa4-ns">
              <strong>Containers</strong>
              <LeftContainers
                selectionStatus={props.selectionStatus}
                containersList={props.containersList}
                currentPlan={props.currentPlan}
                handleLeftContainerClick={this.handleLeftContainerClick}
              />
            </div>
          </div>
          <div className="fl w-50 bg-light-gray tc">
            <div className="pa3 pa4-ns">
              <strong>Vessels and assigned containers</strong>
              <RightVessels {...props} />
            </div>
          </div>
        </article>
      </section>
    );
  }
}

export default Selector;
