import axios from "axios";
import React from "react";
class Table extends React.Component {
  constructor() {
    super();
    this.state = {
      dataTable: [],
    };
    this.column = [
      { heading: "Id", value: "id" },
      { heading: "Full Name", value: "fullName" },
      { heading: "E-mail", value: "email" },
      { heading: "Password", value: "password" },
    ];
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData= () => {
    axios(this.props.url)
      .then((res) => {
        const data = res.data;
        this.setState({
          dataTable: data,
        });
      })
      .catch((err) => console.log(err));
  }
  // componentDidUpdate() {
  //   axios(this.props.url)
  //     .then((res) => {
  //       const data = res.data;
  //       this.setState({
  //         dataTable: data,
  //       });
  //     })
  //     .catch((err) => console.log(err));
  //   // console.log("MASUK")
  // }

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
