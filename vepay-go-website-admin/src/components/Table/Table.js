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
      { heading: "Time enter", value: "timeEnter" },
      { heading: "status", value: "status" },
    ];
  }

  componentDidMount() {
    console.log("didmount ");
    console.log(this.props.isDataInput);
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

  postUserData = (licenseNumber) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    const jsonData = {
      licenseNumber: licenseNumber,
    }

    axios
      .post(this.props.postUserDataUrl, jsonData, {headers: headers})
      .then((res) => {
        console.log(res);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };


  
  componentDidUpdate() {
    console.log("didupdate");
    if (this.props.isDataInput) {
      console.log("Masuk ada data input baru");
      this.getUserData();
      this.postUserData(this.props.inferenceResult);
      
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
