
import './App.css';

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import SigninPage from './view/SigninPage'
import SignupPage from './view/SignupPage'
import LandingPage from './view/LandingPage'
import CompletionPage from './view/CompletionPage'
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
                <PrivateRoute exact path="/user/:name"  component={HomePage}/>
                <PrivateRoute exact path="/signupcompletion" component={CompletionPage}/>
                <Route path="/signin" component={SigninPage}/>
                <Route path="/signup" component={SignupPage}/>
            </Switch>
          </AuthProvider>
      </Router>
  );
}

export default App;
