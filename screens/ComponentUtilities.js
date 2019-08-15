import React from 'react';
import { View, Switch, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import _ from "lodash";
import { ACCOUNTACTION_ADD } from '../assets/Consts'

export class WizardHeader extends React.PureComponent {
  render() {
    return (
      <View style={styles.header}>
        <View style={styles.leftHeaderButton}>
          <TouchableOpacity onPress={this.props.onBack} style={styles.button}>
            <Text style={styles.buttonText}>{this.props.leftButtonContent ? this.props.leftButtonContent : "＜ 戻る"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerHeaderTitle} >
          <Text style={styles.centerHeaderTitleContent}>
            {this.props.title}
          </Text>
        </View>
        <View style={styles.rightHeaderButton}>
          <TouchableOpacity onPress={this.props.onForwards} style={styles.button}>
            <Text style={styles.buttonText}>{this.props.rightButtonContent ? this.props.rightButtonContent : "次へ ＞"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export class ServiceList extends React.Component {
  //这个组件没有做成纯组件，是因为订阅的this.props.services是一个数组
  //纯组件在Diff的时候，仅仅比较引用是否变化（浅比较）
  //数组的操作很有可能会返回同一个引用，但是数据已经变了，所以这里为了保险，不使用纯组件
  render() {
    const servicesData = _.cloneDeep(this.props.FixedServices);
    _.forEach(servicesData, (item) => {
      item.value = _.includes(this.props.services, item.id)
    });
    return (
      <View style={styles.container}>
        <View style={[styles.buttonContainer, this.props.backgroundColor]}>
          <Text style={styles.textContent}>全選択</Text>
          <View style={styles.buttonSubContainer}>
            <Switch
              onValueChange={(value) => { this.props.onChangeAllStatus(value) }}
              value={this.props.all}
            />
          </View>
        </View>
        <FlatList style={styles.flatList}
          data={servicesData}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 5, paddingTop: 5 }}
        />
      </View>
    );
  }
  _renderItem = ({ item }) => (
    <ServiceListItem
      id={item.id}
      key={item.id}
      serviceItem={item}
      onChangeStatus={(id, value) => { this.props.onChangeStatus(id, value) }}
    />
  );
}

class ServiceListItem extends React.PureComponent {
  //因为订阅的this.props.serviceItem由于父组件的cloneDeep动作，保证都是新对象，所以可以用纯组件
  render() {
    return (
      <View style={styles.buttonContainer}>
        <Text>
          {_.trim(this.props.serviceItem.name)}
        </Text>
        <Switch
          onValueChange={(value) => { this.props.onChangeStatus(this.props.id, value) }}
          value={this.props.serviceItem.value}
        />
      </View>
    );
  }
}


export class BasicDisplayTable extends React.PureComponent {
  render() {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.leftContainer}>
          <View style={styles.leftCell}><Text>処理区分</Text></View>
          <View style={styles.leftCell}><Text>コード</Text></View>
          <View style={styles.leftCell}><Text>学校名</Text></View>
          <View style={styles.leftCell}><Text>利用期限</Text></View>
          {
            (this.props.basic.action === ACCOUNTACTION_ADD) &&
            <View style={styles.leftCell}><Text>ライセンス</Text></View>
          }
          {
            (this.props.basic.action === ACCOUNTACTION_ADD) &&
            <View style={styles.leftCell}><Text>デモデータ</Text></View>
          }
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.rightCell}><Text>{this.props.basic.action === ACCOUNTACTION_ADD ? "新規" : "編集"}</Text></View>
          <View style={styles.rightCell}><Text>{this.props.basic.code}</Text></View>
          <View style={styles.rightCell}><Text>{this.props.basic.name}</Text></View>
          <View style={styles.rightCell}><Text>{this.props.basic.date}</Text></View>
          {
            (this.props.basic.action === ACCOUNTACTION_ADD) &&
            <View style={styles.rightCell}><Text>{this.props.basic.license}</Text></View>}
          {
            (this.props.basic.action === ACCOUNTACTION_ADD) &&
            <View style={styles.rightCell}><Text>{this.props.basic.demo ? "利用する" : "利用しない"}</Text></View>
          }
        </View>
      </View>
    );
  }
}

export class RemarkDisplayTable extends React.PureComponent {
  render() {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.leftContainerRemark}>
          <View style={styles.leftCellRemark}><Text>摘要</Text></View>
        </View>
        <View style={styles.rightContainerRemark}>
          <View style={styles.rightCellRemark}><Text>{this.props.remark}</Text></View>
        </View>
      </View>
    );
  }
}

export class ServiceDisplayTable extends React.PureComponent {
  render() {
    return (
      <View style={styles.tableContainer}>
        <View style={[styles.leftServiceContainer, this.props.backgroundColor]}>
          <View style={styles.leftServiceCell}><Text style={styles.leftServiceCellContent}>{this.props.productName}</Text></View>
        </View>
        <View style={styles.rightServiceContainer}>
          {
            this.props.services.map((service) => (
              <View style={styles.rightServiceCell} key={service.id}><Text>{_.trim(service.name)}</Text></View>
            ))
          }
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create(
  {

    //Header Style
    header: {
      height: 50,
      backgroundColor: '#ffffff',
      borderColor: '#a6a6a6',
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center",
    },
    leftHeaderButton: {
      paddingLeft: 5,
      width: 80,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    rightHeaderButton: {
      paddingRight: 5,
      width: 80,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    centerHeaderTitle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: "center",
      alignItems: "center",
    },
    centerHeaderTitleContent: {
      color: "#000000",
      fontSize: 20,
      fontWeight: 'bold'
    },

    button: {
      width: 75,
      height: 35,
      backgroundColor: '#F47224',
      borderWidth: 0,
      borderRadius: 5,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: 'bold'
    },


    container: {
      flex: 1,
    },

    //List Style
    textContent: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },

    buttonSubContainer: {
      flexDirection: 'row',
      justifyContent: "center",
      alignItems: "center",
      borderColor: '#a6a6a6',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: '#ffffff',
      width: 100,
      height:40
    },


    flatList: {
      flex: 1,
      backgroundColor: '#f0f0f0',
    },
    buttonContainer: {
      height: 50,
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center",
      borderColor: '#a6a6a6',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: '#ffffff',
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 0,
      paddingBottom: 0,
      marginLeft: 5,
      marginRight: 5,
      marginTop: 5,
      marginBottom: 5,
    },

    //Summary Style
    tableContainer: {
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "stretch",
      marginLeft: 5,
      marginRight: 5,
      marginTop: 10,
    },
    //Basic
    leftContainer: {
      width: 100,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "stretch",
    },
    rightContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "stretch",
    },
    leftCell: {
      height: 30,
      borderColor: '#a6a6a6',
      borderWidth: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: 5,
      backgroundColor: '#ffffcc',
      marginBottom: 2,
    },
    rightCell: {
      height: 30,
      borderColor: '#a6a6a6',
      borderWidth: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingLeft: 5,
      backgroundColor: '#ffffff',
      marginBottom: 2,
    },
    //Remark
    leftContainerRemark: {
      width: 100,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "stretch",
      borderColor: '#a6a6a6',
      borderWidth: 1,
      backgroundColor: '#ffffcc',
    },
    rightContainerRemark: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "stretch",
      borderColor: '#a6a6a6',
      borderWidth: 1,
      backgroundColor: '#ffffff',
    },
    leftCellRemark: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: 5,
      marginBottom: 2,
    },
    rightCellRemark: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingLeft: 5,
      marginBottom: 2,
    },
    //Service
    leftServiceContainer: {
      width: 100,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "stretch",
      borderColor: '#a6a6a6',
      borderWidth: 1,
    },
    rightServiceContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "stretch",
      borderColor: '#a6a6a6',
      borderWidth: 1,
      backgroundColor: '#ffffff',
    },
    leftServiceCell: {
      height: 30,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: 5,
    },
    leftServiceCellContent: {
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    rightServiceCell: {
      height: 30,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingLeft: 5,
    },
  }
)