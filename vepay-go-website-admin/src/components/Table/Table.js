import axios from "axios";
import React from "react";
class Table extends React.Component {
  constructor() {
    super();
    this.state = {
      dataTable: [],
    };
    this.column = [
      { heading: "LicenseNumber", value: "licenseNumber" },
      { heading: "Date/time", value: "fullDateEnter" },
      { heading: "status", value: "status" },
    ];
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData = () => {
    axios
      .get(this.props.getUserDataUrl)
      .then((res) => {
        const data = res.data;
        this.setState({
          dataTable: data,
        });
      })
      .catch((err) => console.log(err));
  };

  // postUserData = (licenseNumber) => {
  //   const headers = {
  //     "Access-Control-Allow-Origin": "*",
  //     "Content-Type": "application/json",
  //   };

  //   const jsonData = {
  //     licenseNumber: licenseNumber,
  //   };

  //   axios
  //     .post(this.props.postUserDataUrl, jsonData, { headers: headers })
  //     .then((res) => {
  //       console.log(res);
  //       console.log(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  componentDidUpdate() {
    if (this.props.isDataReceived) {
      console.log("MASUKKKKK");
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      };

      const jsonData = {
        licenseNumber: this.props.inferenceResult,
      };

      axios
        .get(
          "https://us-central1-vepay-go.cloudfunctions.net/transaction/inside/" +
            this.props.inferenceResult,
          { headers: headers }
        )
        .then((res) => {
          const data = res.data.response;
          console.log(data);
          if (data === 0) {
            axios
              .post(this.props.postUserDataUrl, jsonData, { headers: headers })
              .then((res) => {
                console.log("post", res);
                this.getUserData();
              })
              .catch((err) => console.log(err));
          } else {
            console.log("Masuk udpate");
            axios
              .put(this.props.postUserDataUrl, jsonData, { headers: headers })
              .then((res) => {
                console.log("put response: ", res);
                this.getUserData();
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  }

  TableHeadItem = ({ item }) => <th>{item.heading}</th>;
  TableRow = ({ item, column }) => (
    <tr>
      {column.map((columnItem, index) => {
        if (columnItem.value.includes(".")) {
          const itemSplit = columnItem.value.split("."); //['address', 'city']
          return <td>{item[itemSplit[0]][itemSplit[1]]}</td>;
        }
        return <td>{item[`${columnItem.value}`]}</td>;
      })}
    </tr>
  );

  render() {
    return (
      // <h1> test </h1>
      <table>
        <thead>
          <tr>
            {this.column.map((item, index) => (
              <this.TableHeadItem item={item} />
            ))}
          </tr>
        </thead>
        <tbody>
          {this.state.dataTable.map((item, index) => (
            <this.TableRow item={item} column={this.column} />
          ))}
        </tbody>
      </table>
    );
  }
}

export default Table;
