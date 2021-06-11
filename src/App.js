
import './App.css';

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



function App() {
  return (
      <Router>
          <AuthProvider>
              <Nav/>
            <Switch>
                
                  <Route exact path="/" component={LandingPage}/>
                  <PrivateRoute exact path="/completion" component={CompletionPage}/>
                  <PrivateRoute exact path="/user"  component={HomePage}/>
                  <PrivateRoute exact path="/groupchats" component={GroupChatPage}/>
                  <Route path="/signin" component={SigninPage}/>
                  <Route path="/signup" component={SignupPage}/>
                
            </Switch>
          </AuthProvider>
      </Router>
  );
}

export default App;
