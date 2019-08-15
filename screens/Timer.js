import React, { Component } from 'react';
import { StyleSheet, View, Text, Image} from 'react-native';


const mes0 = 'DB作成の為、時間がかかります。お待ちください。'
const mes1 = '通常よりもお時間がかかります。お待ちください。'

export class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            second: this.props.totalTime,
            timeoutmsg: mes0
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.state.second == 0) {
                this.interval && clearInterval(this.interval);
                this.setState({ timeoutmsg: mes1 });
            } else {
                this.setState({ second: this.state.second - 1 });
            }
        }, 1000);
    }
    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }
    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.prepareImage}
                    source={require('../assets/prepare.gif')}
                />
                <Text style={styles.text}>
                    {this.state.timeoutmsg}
                </Text>
                <Text style={styles.number}>
                    {this.state.second}
                </Text>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    number: {
        fontSize: 100,
        color: 'red',
    },
    text: {
        fontSize: 12,
        color: 'black',
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom:20
    },
    prepareImage: {
        width: 256,
        height: 256,
        marginBottom:20
    }
})