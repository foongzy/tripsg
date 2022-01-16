import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom'

//wrong url page
import NotFound from './Page/notFound'

//Valid url pages
import About from './Page/About'
import Home from './Page/Home'
import Feedback from './Page/Feedback'
import Settings from './Page/Settings'
import Login from './Page/Login'

class App extends Component {
  render(){
    return (
      <div>
        <BrowserRouter history={window.history}>
          <Switch>
            <Route exact path="/" render={props=>(<Home />)} />
            <Route exact path="/BusArrival" render={props=>(<Home />)} />
            <Route exact path="/tripsg" render={props=>(<Home />)} />
            <Route exact path="/Settings" render={props=>(<Settings />)} />
            <Route exact path="/Feedback" render={props=>(<Feedback />)} />
            <Route exact path="/About" render={props=>(<About />)} />
            <Route exact path="/Login" render={props=>(<Login />)} />
            
            <Route render={props=>(<NotFound />)} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  };
}

export default App;
