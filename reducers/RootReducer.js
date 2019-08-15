//参考用，state的结构如下表：
const stateSchema = {
    //当前登录的用户（只读）
    user: {
        id: '',
        name: '',
        minid: '',
        maxid: ''
    },
    //当前的一览数据（本地内存缓存全部一览数据，新规，编辑，删除都会影响这个缓存）
    list: [
        {
            id: '',
            code: '',
            name: '',
            date: ''
        },
    ],
    //当前的明细数据（本地内存仅仅缓存当前操作的这个学校的明细数据，进入编辑或者新规时初始化，结束编辑或者新规时删除）
    basic: {
        action: '',
        id: '',
        code: '',
        name: '',
        date: '',
        license: '',
        demo: '',
        remark: '',
        products: [],
        plusproducts: []
    },
    kaikei: [],
    shisan: [],
    kyuyo: [],
    jinji: [],
    gakuhi: [],
    plus: []
}

import * as actionTypes from '../actions/RootAction';
import _ from 'lodash';
import { plusCommonServices, plusGakuhiServices, plusKaikeiServices, plusShisanServices, plusKyuyoServices, plusJinjiServices } from "../assets/Consts";

const replaceItem = (list, newItem) => {
    const index = _.findIndex(list, (item) => item.id === newItem.id);
    if (index >= 0) {
        return _.sortBy([...list.slice(0, index), newItem, ...list.slice(index + 1)], ['code']);
    }
    return list;
};
const computePlusServices = (list) => {
    let plusServices = [];
    if (_.includes(list, "pluskaikei")) plusServices = _.concat(plusServices, _.map(plusKaikeiServices, "id"));
    if (_.includes(list, "plusshisan")) plusServices = _.concat(plusServices, _.map(plusShisanServices, "id"));
    if (_.includes(list, "pluskyuyo")) plusServices = _.concat(plusServices, _.map(plusKyuyoServices, "id"));
    if (_.includes(list, "plusjinji")) plusServices = _.concat(plusServices, _.map(plusJinjiServices, "id"));
    if (_.includes(list, "plusgakuhi")) plusServices = _.concat(plusServices, _.map(plusGakuhiServices, "id"));
    if (plusServices.length > 0) {
        //其他plus服务的前提是共通plus，所以，如果其他plus有数据的话，一定要带上共通，没有值，那么就保持为全空
        plusServices = _.concat(plusServices, _.map(plusCommonServices, "id"));
    }
    return plusServices;
}
const appReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.USER_UPDATE:
            return { ...state, user: action.payload };
        case actionTypes.ACCOUNT_LOADLIST:
            return { ...state, list: _.sortBy(action.payload, ['code']) };
        case actionTypes.ACCOUNT_DELETEITEM:
            return { ...state, list: _.reject(state.list, (item) => item.id === action.payload) };
        case actionTypes.ACCOUNT_LOADDETAIL:
            return {
                ...state,
                basic: action.payload.basic,
                kaikei: action.payload.kaikei,
                shisan: action.payload.shisan,
                kyuyo: action.payload.kyuyo,
                jinji: action.payload.jinji,
                gakuhi: action.payload.gakuhi,
                plus: action.payload.plus
            };
        case actionTypes.ACCOUNT_CLEARDETAIL:
            return {
                ...state,
                basic: null,
                kaikei: null,
                shisan: null,
                kyuyo: null,
                jinji: null,
                gakuhi: null,
                plus: null
            };
        case actionTypes.ACCOUNT_UPDATEDETAILBASIC:
            return { ...state, basic: action.payload, plus: computePlusServices(action.payload.plusproducts) };
        case actionTypes.ACCOUNT_UPDATEDETAILSERVICE:
            switch (action.payload.product) {
                case 'kaikei':
                    return { ...state, kaikei: action.payload.services };
                case 'shisan':
                    return { ...state, shisan: action.payload.services };
                case 'kyuyo':
                    return { ...state, kyuyo: action.payload.services };
                case 'jinji':
                    return { ...state, jinji: action.payload.services };
                case 'gakuhi':
                    return { ...state, gakuhi: action.payload.services };
                default:
                    return state
            }
        case actionTypes.ACCOUNT_ADDITEM:
            return { ...state, list: _.sortBy(_.concat(state.list, action.payload), ['code']) };
        case actionTypes.ACCOUNT_UPDATEITEM:
            return { ...state, list: replaceItem(state.list, action.payload) };
        default:
            return state;
    }
}

const rootReducer = (state, action) => {
    //退出时清空所有的state，保证再次登录时state是干净的
    if (action.type === actionTypes.USER_LOGOUT) {
        return appReducer({}, {});
    }
    return appReducer(state, action);
};
export default rootReducer;