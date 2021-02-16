import { connect } from 'react-redux';
import { updateAccountDetailServiceAction } from '../actions/RootAction';
import { bindActionCreators } from 'redux';
import { shisanServices, ACCOUNTACTION_ADD } from '../assets/Consts';
import AccountDetailProduct from './AccountDetail_Product';
import { productStyles } from './CommonStyles';
import _ from 'lodash';
const mapStateToProps = (state) => {
  return {
    action: _.isNil(state.basic) ? ACCOUNTACTION_ADD : state.basic.action,
    products: _.isNil(state.basic) ? [] : state.basic.products,
    services: state.shisanservices || [],
    licenses: state.shisanlicenses || [],
    FixedServices: shisanServices,
    ProductName: '資産管理',
    ProductKey: 'shisan',
    ProductStyle: productStyles.shisanColor
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateAccountDetailServiceAction }, dispatch);
};
const AccountDetailShisan = connect(mapStateToProps, mapDispatchToProps)(AccountDetailProduct);
export default AccountDetailShisan;