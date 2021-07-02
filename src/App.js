
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


const controlPanelPath = "controlpanel";
function App() {
  
  return (
      <Router>
          <AuthProvider>
            <Responsive>
                <Nav/>
                <Switch>
                      <Route exact path="/" component={LandingPage}/>
                      <PrivateRoute exact path="/completion" component={CompletionPage}/>
                      <PrivateRoute exact path="/user"  component={HomePage}/>
                      <PrivateRoute exact path="/groupchats" component={GroupChatPage}/>
                      <PrivateRoute exact path={"/"+controlPanelPath} component ={Dashboard}/>
                      <PrivateRoute exact path={"/"+controlPanelPath+"/membership"} component ={Membership}/>
                      <Route path="/signin" component={SigninPage}/>
                      <Route path="/signup" component={SignupPage}/>
                </Switch>
            </Responsive>
          </AuthProvider>
      </Router>
  );
}

export default App;
