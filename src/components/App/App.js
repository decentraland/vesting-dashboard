import React, { Component } from "react";
import { Route } from "react-router";
import Header from "components/Header";
import "./App.css";

const Home = () => "Home";
class App extends Component {
  render() {
    const { name, goAbout } = this.props;
    return (
      <div className="App">
        <Header />
      </div>
    );
  }
}

export default App;
