import React, { Component } from "react";
import { Route } from "react-router";
import User from "components/User";
import "./App.css";

const Home = () => "Home";
class App extends Component {
  render() {
    const { name, goAbout } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <Route exact path="/" component={User} />
          <Route exact path="/about" component={() => "About"} />
        </p>
      </div>
    );
  }
}

export default App;
