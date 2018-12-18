import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from '../pages/Home'
import Configuration from '../pages/Configuration'
import Dashboards from '../pages/Dashboards'
import Feedbacks from '../pages/Feedbacks'
import Funnels from '../pages/Funnels'
import Campaigns from '../pages/Campaigns'
import Error from '../pages/Error'
import Navigation from './Navigation.js'

class Nav extends Component {
  render() {
    return (

      <BrowserRouter>
            <React.Fragment>
      < Navigation />
       <Switch>
         <Route className="" path="/" component={Home} exact/>
         <Route path="/Features" component={Configuration} />
         <Route path="/Funnels" component={Funnels} />
         <Route path="/Campaigns" component={Campaigns} />
         <Route path="/Dashboards" component={Dashboards} />
         <Route path="/Feedbacks" component={Feedbacks} />
         <Route component={Error} />
       </Switch>
       </React.Fragment>
     </BrowserRouter>


    );
  }
}

export default Nav;
