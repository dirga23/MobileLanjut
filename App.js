'use strict';
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Slider,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  ScrollView,
  FlatList,
  Modal,
  AsyncStorage,
  Dimensions
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import {

    ListItem,
    Button,
    List,
    Icon
} from "native-base";


class LogoTitle extends React.Component {
    render() {
        return <View style={{ flex: 1, alignItems: "center", backgroundColor: "#2196F3", justifyContent: "center", height: 80, width: "100%", marginTop: 50 }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#2196F3" translucent={true} networkActivityIndicatorVisible={true} />
            <Text style={{ color: "white", fontSize: 24 }}>Program Kasir</Text>
        </View>;
    }
}

class qrcodeScreen extends Component {
    static navigationOptions = {
        headerTitle: <LogoTitle />,
        headerLeft: null
    };


    constructor(props) {
        
        super(props);
        this.state = {
            kode: '',
            jumlah: '',
            harga: '',
            total: null,
            hide: true,
            bayar: "",
            hargaBrg: '',
            kembalian: "",
            ActivityIndicator_Loading: false,
            modalVisible: false,
            dataqr: '',
            status: 'Ready'
        };
    }
    
    toggleModal(visible) {
        this.setState({ modalVisible: visible });
    }
    
    componentDidMount() {
        this.setState({ ActivityIndicator_Loading: true }, () => {
            this.setState({ refreshing: true });
            const url =
                "http://projectmobile.wahanawar.com/getData.php";
            //this.setState({ loading: true });
            fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("comp");
                    console.log(responseJson);
                    this.setState({
                        hide: true,
                        error: responseJson.error || null,
                        loading: false,
                        refreshing: false,
                        ActivityIndicator_Loading: false,

                    });
                }
                );
        });
    }
    cariData = () => {
        this.setState({ ActivityIndicator_Loading: true },
            () => {
                this.setState({ refreshing: true, hide: true });
                fetch(
                    "http://projectmobile.wahanawar.com/cariBarang.php",
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            kode: this.state.kode
                        })
                    }
                )
                    .then(response => response.json())
                    .then(responseJson => {
                        console.log("comp");
                        console.log(responseJson);
                        this.setState({
                            harga: responseJson,
                            error: responseJson.error || null,
                            loading: false,
                            refreshing: false,
                            ActivityIndicator_Loading: false
                        });
                         
                    });
            }
        );
    };
    _keyExtractor = (item, index) => index.toString();

    hitung = () => {
        let total = this.state.total+this.state.jumlah * this.state.harga;
        this.setState({
          hide: false,
          total: total,
        });
        AsyncStorage.setItem("total", total);
    }
    
    kembali = () => {
               this.setState({
                 kembalian: this.state.bayar - this.state.total
               });
    }
    onSuccess(e) {
        this.cariData();
        this.setState({
            kode: e.data ,
            status: 'Coba Lagi'
        })
    }
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Modal animationType={"slide"} transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { console.log("Modal has been closed.") }}>
                        <View style={styles.container}>
                            <View style={styles.conQR}>
                                <QRCodeScanner
                                    cameraStyle={styles.cameraContainer}
                                    reactivateTimeout={5000}
                                    onRead={this.onSuccess.bind(this)}
                                    ref={(node) => { this.scanner = node }}
                                    topContent={
                                        <View>
                                            <Text style={styles.centerText}> Klik untuk melanjutkan</Text>
                                            <Button
                                                style={{ 
                                                    padding: 50, 
                                                    margin: 10, 
                                                    backgroundColor: '#2196F3',
                                                    marginLeft: 30}}
                                                onPress={() => {
                                                    this.scanner.reactivate()
                                                    this.setState({ status: 'Ready' })
                                                }
                                                }
                                                title={this.state.status}
                                            ><Text style={{color: '#fff', fontSize: 20}}>{this.state.status}</Text></Button>
                                        </View>
                                    }
                                    bottomContent={
                                        <View>
                                            <Text style={{color: '#000', fontSize: 20,marginLeft: 30}}>Kode Barang : {this.state.kode}</Text>
                                        </View>

                                    }

                                />
                            </View>
                            <TouchableOpacity onPress={() => {
                                this.toggleModal(!this.state.modalVisible)
                                this.setState({
                                    kode: this.state.kode
                                })
                            }} style={styles.TouchableOpacityStyle}>

                                <Text style={styles.TextClass}>Close Modal</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <View style={styles.box1}>
                        <Text>Kode Barang</Text>
                        <TextInput
                            style={styles.textInputKode}
                            onChangeText={TextInputText =>
                                this.setState({ kode: TextInputText })
                            }
                            ref={input => {
                                this.kode = input;
                            }}
                            onChange={this.cariData}
                            value={this.state.kode}
                        />
                        <Button iconLeft
                            style={styles.ButtonQR}
                            onPress={() => {
                                this.toggleModal(!this.state.modalVisible)
                            }}>

                            <Icon name='camera' />
                            <Text></Text>
                        </Button>
                    </View>
                    <View style={styles.box1}>
                        <Text>Jumlah Beli </Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={TextInputText =>
                                this.setState({ jumlah: TextInputText })
                            }
                            ref={input => {
                                this.jumlah = input;
                            }}
                        />
                    </View>
                    <View style={styles.box1}>
                        <Text>Harga Barang </Text>
                        <Text style={{
                            width: 170,
                            height: 50,
                            paddingTop: 15,
                            paddingLeft: 5,
                            backgroundColor: "#fff",
                            borderWidth: 1,
                            borderRadius: 7,
                            borderColor: "#2196F3"}}
                            >{this.state.harga}
                        </Text>
                           
                            
                    </View>
                    <View style={styles.box2}>
                        <Button
                            activeOpacity={0.5}
                            style={styles.TouchableOpacityStyle}
                            onPress={() => this.hitung()}
                        >
                            <Text style={styles.TextClass}>Hitung</Text>
                        </Button>
                    </View>
                    <Text>Total Belanja : Rp. {this.state.total}</Text>
                    {
                        this.state.hide ? null : 
                            <View style={styles.box1}>
                                <Text>Uang Bayar</Text>
                                <TextInput
                                    style={styles.textInput}
                                    onChangeText={TextInputText =>
                                        this.setState({ bayar: TextInputText })
                                    }
                                    ref={input => {
                                        this.bayar = input;
                                    }}
                                />
                            </View>
                    }

                    {
                        this.state.hide ? null :
                            <View style={styles.box2}>
                                <Button
                                    activeOpacity={0.5}
                                    style={styles.TouchableOpacityStyle}
                                    onPress={() => this.kembali()}
                                >
                                    <Text style={styles.TextClass}>Hitung</Text>
                                </Button>
                            </View>

                    }
                    {
                        this.state.hide ? null :
                            <Text>Kembalian : Rp. {this.state.kembalian}</Text>
                    }
                </View>
            </ScrollView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
        flexDirection: "column",
        alignItems: "center"
    },
    TextInputStyleClass: {
        backgroundColor: "#fff",
        borderWidth: 1,
        //height: '100%',
        borderColor: "#2196F3",
        borderRadius: 7,
        marginBottom: 10
        // width: "100%"
    },
    TextClass: {
        textAlign: "center",
        height: 40,
        width: "100%",
        marginTop: 10,
        color: "#FFFFFF",
        fontSize: 20
    },
    TouchableOpacityStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2196F3",
        marginTop: 20,
        marginBottom: 20,
        height: 40,
        width: "70%",
        borderRadius: 7
    },
    ButtonQR: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2196F3",
        height: 40,
        paddingRight: 15,
        borderRadius: 7,
        marginTop: 5
    },
    ActivityIndicatorStyle: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center"
    },
    box1: {
        flex: 0.5,
        width: "90%",
        paddingTop: 20,
        marginTop: 10,
        marginLeft: 2,
        justifyContent: "space-between",
        flexDirection: "row"
    },
    box2: {
        flex: 0.4,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center"
    },
    textInput: {
        width: 170,
        height: 50,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#fff",
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#2196F3"
    },
    textInputKode: {
        width: 100,
        height: 50,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderRadius: 7,
        marginLeft: 55,
        marginRight: 10,
        borderColor: "#2196F3"
    },
    conMain: {
        flex: 1,
        margin: 10,
        flexDirection: "column",
        alignItems: "center"
    },
    conHeader: {
        flex: 1,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center'
    },
    conQR: {
        flex: 5,
 
    },
    centerText: {
        fontSize: 20,
        color: '#000',
    },
    modal: {
        flex: 1,
        margin: 10,
        flexDirection: "column",
        alignItems: "center"
    },
    cameraContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height:250,
        width: 250,
        marginLeft: 55,
        marginTop: 40
    },
});

//make this component available to the app
export default qrcodeScreen;