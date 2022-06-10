/* eslint-disable no-useless-constructor */
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

class InferenceResult extends React.Component {
  constructor() {
    super();
    this.state = {
      date: "",
      time: "",
    };
  }

  componentDidUpdate() {
    console.log(
      "this.props.loadingInferenceResult = ",
      this.props.loadingInferenceResult
    );
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
      <div>
        <div style={{ height: "25%" }}>
          <h3>License Plate Picture: </h3>
          <div>{this.props.licensePlatePicture}</div>
        </div>
        {this.props.loadingInferenceResult ? (
          <div>
            <div style={{ height: "25%" }}>
              <h3>Inference Result: </h3>
              <Skeleton count={1} />
            </div>
            <div style={{ height: "25%" }}>
              <h3>Date Entered: </h3>
              <Skeleton count={1} />
            </div>
            <div style={{ height: "25%" }}>
              <h3>Time Entered: </h3>
              <Skeleton count={1} />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ height: "25%" }}>
              <h3>Inference Result: </h3>
              <div>{this.props.inferenceResult}</div>
            </div>
            <div style={{ height: "25%" }}>
              <h3>Date Entered: </h3>
              <div>{this.state.date}</div>
            </div>
            <div style={{ height: "25%" }}>
              <h3>Time Entered: </h3>
              <div>{this.state.time}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default InferenceResult;
