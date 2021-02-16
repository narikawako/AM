import _ from "lodash";

//本体服务
export const kaikeiServices = [
    { id: 1, name: 'ｽﾀﾝﾀﾞｰﾄﾞ' },
    { id: 2, name: '幼稚園' },
    //{ id: 3, name: '出納帳' },
    { id: 5, name: '部所予算' },
    { id: 6, name: '目的予算' },
    { id: 7, name: '配分管理' },
    { id: 12, name: '支払管理' },
    { id: 17, name: '財務分析' },

    { id: 504000, name: '他校送付(OP)' },
    { id: 504010, name: '予算執行(OP)' }

    //{ id: 13, name: '	税別経理	' },
    //{ id: 16, name: '	電子預金	' },
]

export const kyuyoServices = [
    { id: 120, name: 'ｽﾀﾝﾀﾞｰﾄﾞ' },
    { id: 121, name: '等級号俸' },
    { id: 122, name: 'ﾍﾞｰｽｱｯﾌﾟ' },
    { id: 123, name: '人件費ｼﾐｭﾚｰｼｮﾝ' },
    { id: 124, name: '退職金' },
    { id: 125, name: '人事情報' },
    { id: 509004, name: '電子明細(OP)' }

    //{ id: 126, name: '	電子明細	' },
]
export const shisanServices = [
    { id: 1001, name: 'ｽﾀﾝﾀﾞｰﾄﾞ' },
    // { id: 1002, name: '	資産管理ライト	' }
]
export const gakuhiServices = [
    { id: 2001, name: 'ｽﾀﾝﾀﾞｰﾄﾞ' },
    { id: 2002, name: '預り金' }
]
export const jinjiServices = [
    { id: 3001, name: 'ｽﾀﾝﾀﾞｰﾄﾞ' }
]

//默认是Off的那些Service
export const defaultOffServices = [
    2 //会计：幼稚園
]

//这三个是OP，不能设置license数
export const defaultofflicenses =[
  504010,
  504000,
  509004
]


//Plus服务
export const plusCommonServices = [
    { id: 610000, name: '	LS+共通（Web）	' },
    { id: 610001, name: '	LS+キャビNet	' }
]
export const plusKaikeiServices = [
    { id: 504020, name: '	LS+会計	' },
    { id: 620000, name: '	LS+会計（Web）	' },
    { id: 620001, name: '	LS+仕訳アーカイブ' },
    { id: 670000, name: '	LS+周辺会計（Web）	' }

]
export const plusShisanServices = [
    { id: 511003, name: '	LS+資産	' },
    { id: 630000, name: '	LS+資産（Web）	' }
]
export const plusKyuyoServices = [
    { id: 509005, name: '	LS+給与	' },
    { id: 509006, name: '	LS+給与明細	' },
    { id: 640000, name: '	LS+給与（Web）	' },
    { id: 641000, name: '	教職員サイト	' },
    { id: 641001, name: '	教職員サイト（給与明細閲覧）	' }
]
export const plusJinjiServices = [
    { id: 513001, name: '	LS+人事	' },
    { id: 650000, name: '	LS+人事（Web）	' }
]
export const plusGakuhiServices = [
    { id: 505001, name: '	LS+学費	' },
    { id: 660000, name: '	LS+学費（Web）	' },
    { id: 661000, name: '	学費サイト	' }
]

//服务全集
export const fixServices = [
    { product: "kaikei", services: kaikeiServices },
    { product: "shisan", services: shisanServices },
    { product: "kyuyo", services: kyuyoServices },
    { product: "jinji", services: jinjiServices },
    { product: "gakuhi", services: gakuhiServices }
]

export const ACCOUNTACTION_ADD = 'ACCOUNTACTION_ADD'
export const ACCOUNTACTION_EDIT = 'ACCOUNTACTION_EDIT'

//计算跳转到哪一页（根据current在products中的位置，判定前进到哪儿或者后退到哪儿）
export const nextPage = (products, current, forwards) => {
    let currentIndex = _.indexOf(products, current)
    if (forwards === 0) {
        if (currentIndex === 0) {
            return "basic";
        }
        return products[currentIndex - 1];
    } else {
        if (currentIndex === products.length - 1) {
            return "summary";
        }
        return products[currentIndex + 1];
    }
}

//根据用户具有的服务判定是否具有某一个制品（例如，有部所Service的话，就表示签约了会计）
export const hasService = (servicesids, keyservices) => {
    let hasData = false;
    _.forEach(_.map(keyservices, "id"), (id) => {
        if (_.includes(servicesids, id)) {
            hasData = true;
        }
    });
    return hasData;
}

//格式化日付到年月日
export const formatDate = (date) => {
    if ((date === '') || (date.toString() === 'Invalid Date')) return '';
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('/');
}
