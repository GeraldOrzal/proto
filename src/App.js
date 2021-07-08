
import './App.css';
import {useState} from 'react'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import SigninPage from './view/SigninPage'
import SignupPage from './view/SignupPage'
import LandingPage from './view/LandingPage'
import CompletionPage from './view/CompletionPage'
import GroupChatPage from './view/GroupChatPage'
import HomePage from './view/HomePage'
import AuthProvider from './view/AuthProvider';
import PrivateRoute from './view/PrivateRoute';
import Nav from './view/Components/Nav';
import Dashboard from './view/Dashboard'
import Membership from './view/Membership';
import Responsive,{useResponsive} from './view/Components/Responsive';
import {AnimatePresence} from 'framer-motion'

const controlPanelPath = "controlpanel";
function App() {
  
  return (
      <Router>
          <AuthProvider>
            <Responsive>
                <Nav/>
                <Switch>
                <AnimatePresence>
                      <Route exact path="/" component={LandingPage} key={1}/>
                      <PrivateRoute exact path="/completion" component={CompletionPage} key={2}/>
                      <PrivateRoute exact path="/user"  component={HomePage} key={3}/>
                      <PrivateRoute exact path="/groupchats" component={GroupChatPage} key={4}/>
                      <PrivateRoute exact path={"/"+controlPanelPath} component ={Dashboard} key={5}/>
                      <PrivateRoute exact path={"/"+controlPanelPath+"/membership"} component ={Membership} key={6}/>
                      <Route path="/signin" component={SigninPage} key={7}/>
                      <Route path="/signup" component={SignupPage} key={8}/>
                  </AnimatePresence>
                  
                </Switch>
            </Responsive>
          </AuthProvider>
      </Router>
  );
}

export default App;
