import { createStackNavigator } from 'react-navigation';
import  Login  from '../screens/UserLogin';
import  Signup from '../screens/UserSignup';
export default LoginStack = createStackNavigator(
  {
    login: Login
  }
);