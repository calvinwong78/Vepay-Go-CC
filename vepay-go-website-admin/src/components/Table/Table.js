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
      { heading: "Status", value: "status" },
      { heading: "Price", value: "price" },
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
              .then(() => {
                this.getUserData();
                this.props.notify("Vehicle is checking in ...", "success");
              })
              .catch((err) => {
                console.log(err);
                this.props.notify(
                  "Vehicle's license plate doesn't exist in database",
                  "error"
                );
              });
          } else {
            axios
              .put(this.props.postUserDataUrl, jsonData, { headers: headers })
              .then(() => {
                this.getUserData();
                this.props.notify("Vehicle is checking out ...", "success");
                // send notification to the firebase
                const tokenfcm = res.data.token;
                axios
                  .post(
                    "https://us-central1-vepay-go.cloudfunctions.net/FCM/sendNTF/" +
                      tokenfcm,
                    { headers: headers }
                  )
                  .then(() => {
                    this.props.notify("Notification sent to user", "success");
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
