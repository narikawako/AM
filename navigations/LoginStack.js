import { createStackNavigator } from 'react-navigation';
import  Login  from '../screens/UserLogin';
export default LoginStack = createStackNavigator(
  {
    login: Login
  }
);