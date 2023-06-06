import { BrowserRouter, Switch, Route } from 'react-router-dom'
import SignInPage from '../SignInPage/SignInPage'
import LandingPage from '../LandingPage/LandingPage'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/* <Route exact path="/" component={LandingPage} /> */}
        <Route exact path="/signIn" component={SignInPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
