//操作State的指令
//1：Action应该尽量是Pure的
//2：因为是DB操作之后的动作，所以入口应该是DB返回的结果

//--------Login页面或者跳转页面：
//Login页面到DB验证，登陆成功之后，将UserId保存到本地，然后利用从DB得到的User数据更新State中的User信息
//Switch页面从本地获取到UserId后到DB得到User数据，然后更新State中的User信息

export const USER_UPDATE = 'USER_UPDATE'
export const updateUserAction = (user) => {
    return {
        type: USER_UPDATE,
        payload: user
    }
}

//--------AccountList页面：
//初次进入画面判定是否有List数据，没有的话，出进度条从DB获取数据，然后更新State中的List数据，重新加载页面
//删除Account数据之后，从DB删除数据，然后更新State中的List数据，重新加载页面
//用户退出之后，清除所有的State

export const ACCOUNT_LOADLIST = 'ACCOUNT_LOADLIST'
export const loadAccountListAction = (list) => {
    return {
        type: ACCOUNT_LOADLIST,
        payload: list
    }
}
export const ACCOUNT_DELETEITEM = 'ACCOUNT_DELETEITEM'
export const deleteAccountItemAction = (id) => {
    return {
        type: ACCOUNT_DELETEITEM,
        payload: id
    }
}
export const USER_LOGOUT = 'USER_LOGOUT'
export const userLogoutAction = () => {
    return {
        type: USER_LOGOUT
    }
}

//--------AccountDetail—Basic页面：
//初次进入画面判定是否有Detail数据，没有的话，出进度条从DB获取明细数据，然后更新State中的Detail数据，重新加载页面
//后退离开这个画面的时候，要清空State中的Detail数据，清理现场，方便下次进入时是干净的。
//前进离开这个画面的时候，要更新State中的Detail的Basic信息，实时存储最新的数据到State。
//detail:{basic:{},kaikei:[],shisan:[],kyuyo:[],jinji:[],gakuhi:[],plus:[]}
export const ACCOUNT_LOADDETAIL = 'ACCOUNT_LOADDETAIL'
export const loadAccountDetailAction = (detail) => {
    return {
        type: ACCOUNT_LOADDETAIL,
        payload: detail
    }
}


export const ACCOUNT_CLEARDETAIL = 'ACCOUNT_CLEARDETAIL'
export const clearAccountDetailAction = () => {
    return {
        type: ACCOUNT_CLEARDETAIL,
    }
}

export const ACCOUNT_UPDATEDETAILBASIC = 'ACCOUNT_UPDATEDETAILBASIC'
export const updateAccountDetailBasicAction = (basic) => {
    return {
        type: ACCOUNT_UPDATEDETAILBASIC,
        payload: basic
    }
}


//--------AccountDetail—Product页面：
//前进离开这个画面的时候，要更新State中的Detail的产品Service信息，实时存储最新的数据到State。
//后退的时候不更新State。

//productServices: {product:'kaikei/shisan/kyuyo/jinji/gakuhi/plus',services:[]}
export const ACCOUNT_UPDATEDETAILSERVICE = 'ACCOUNT_UPDATEDETAILSERVICE'
export const updateAccountDetailServiceAction = (productServices) => {
    return {
        type: ACCOUNT_UPDATEDETAILSERVICE,
        payload: productServices
    }
}

//--------AccountDetail—Summary页面：订阅整个Detail信息（因为要保存到DB）
//前进离开这个画面的时候，实时存储最新的数据到State。
//利用state中的最新的信息保存到DB，更新State中的List信息，清空State中的Detail信息
//后退的时候不更新State。

export const ACCOUNT_ADDITEM = 'ACCOUNT_ADDITEM'
export const addAccountItemAction = (item) => {
    return {
        type: ACCOUNT_ADDITEM,
        payload: item
    }
}

export const ACCOUNT_UPDATEITEM = 'ACCOUNT_UPDATEITEM'
export const updateAccountItemAction = (item) => {
    return {
        type: ACCOUNT_UPDATEITEM,
        payload: item
    }
}
