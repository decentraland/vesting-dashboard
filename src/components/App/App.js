import React, { Component } from "react";
import Header from "components/Header";
import Dashboard from "components/Dashboard";
import Footer from "components/Footer";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <Dashboard />
        <Footer />
      </div>
    );
  }
}

export default App;
