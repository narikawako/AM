import { createStackNavigator } from 'react-navigation';
import  Basic  from '../screens/AccountDetail_Basic';
import  Summary  from '../screens/AccountDetail_Summary';
import  Kaikei  from '../screens/AccountDetail_Kaikei';
import  Shisan  from '../screens/AccountDetail_Shisan';
import  Kyuyo  from '../screens/AccountDetail_Kyuyo';
import  Jinji  from '../screens/AccountDetail_Jinji';
import  Gakuhi  from '../screens/AccountDetail_Gakuhi'
import  List  from '../screens/AccountList';
export default AppStack = createStackNavigator(
  {
    list: List,
    basic: Basic,
    kaikei: Kaikei,
    shisan: Shisan,
    kyuyo: Kyuyo,
    jinji: Jinji,
    gakuhi: Gakuhi,
    summary:Summary
  },
  {
    initialRouteName: 'list',
  }
);