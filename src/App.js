import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom'

//wrong url page
import NotFound from './Page/notFound'

//Valid url pages
import About from './Page/About'
import Home from './Page/Home'
import Feedback from './Page/Feedback'
import Location from './Page/Location'
import Sidebar from './Components/Sidebar';

class App extends Component {
  render(){
    return (
      <div>
        <BrowserRouter history={window.history}>
    
          <Switch>

            <Route exact path="/" render={props=>(<Home />)} />
            <Route exact path="/Tripsg" render={props=>(<Home />)} />
            <Route exact path="/BusArrival" render={props=>(<Home />)} />
            <Route exact path="/Location" render={props=>(<Location />)} />
            <Route exact path="/Feedback" render={props=>(<Feedback />)} />
            <Route exact path="/About" render={props=>(<About />)} />
            
            <Route render={props=>(<NotFound />)} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  };
}

export default App;
