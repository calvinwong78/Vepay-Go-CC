/* eslint-disable no-useless-constructor */
import React from "react";

class InferenceResult extends React.Component {
  constructor() {
    super();
    this.state = {
      date: "",
      time: "",
    };
  }

  componentDidUpdate() {
    if (this.props.isDataReceived === true) {
      let today = new Date();

      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

      this.setState({
        date: date,
        time: time,
      });
    }
  }

  render() {
    return (
      <div className="inference-result__content">
        <div style={{ height: "20%" }}>
          <h3>License Plate Picture: </h3>
          <div>{this.props.licensePlatePicture}</div>
        </div>
        <div style={{ height: "20%" }}>
          <h3>Inference Result: </h3>
          <div>{this.props.inferenceResult}</div>
        </div>
        <div style={{ height: "20%" }}>
          <h3>Location: </h3>
          <div>{this.props.location}</div>
        </div>
        <div style={{ height: "20%" }}>
          <h3>Date Entered: </h3>
          <div>{this.state.date}</div>
        </div>
        <div style={{ height: "20%" }}>
          <h3>Time Entered: </h3>
          <div>{this.state.time}</div>
        </div>
      </div>
    );
  }
}
export default InferenceResult;
