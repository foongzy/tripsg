import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom'

//wrong url page
import NotFound from './Page/notFound'

//Valid url pages
import About from './Page/About'
import Home from './Page/Home'
import Sidebar from './Components/Sidebar';

class App extends Component {
  render(){
    return (
      <div>
        <BrowserRouter history={window.history}>
    
          <Switch>

            <Route exact path="/" render={props=>(<Home />)} />
            <Route exact path="/TripSg" render={props=>(<Home />)} />
            <Route exact path="/BusArrival" render={props=>(<Home />)} />
            <Route exact path="/Location" render={props=>(<NotFound />)} />
            <Route exact path="/Feedback" render={props=>(<NotFound />)} />
            <Route exact path="/About" render={props=>(<About />)} />
            
            <Route render={props=>(<NotFound />)} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  };
}

export default App;
