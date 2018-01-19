import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import Realm from 'realm';

const ItemSchema = {
    name: 'Item',
    primaryKey: 'id',
    properties: {
        id: 'string',
        type: 'string',
    },
};

const realm = new Realm({
    schema: [
        ItemSchema,
    ],
    migration: () => {},
    schemaVersion: 1,
});

const items = [
    { id: '1', type: 'first' },
    { id: '2', type: 'first' },
    { id: '3', type: 'first' },
    { id: '4', type: 'first' },
    { id: '5', type: 'first' },
];

function writeItems(data, type) {
    console.log(`gonna get old ${type}`);
    const oldItems = realm.objects('Item').filtered(`type == "${type}"`).snapshot();
    console.log(`gonna write ${type}`);
    realm.write(() => {
        console.log(`writing ${type}`);
        const itemsToDelete = [];
        oldItems.forEach(
            (oldItem) => {
                const oldItemId = oldItem.id;
                const exists = data.find((item) => item.id === oldItemId);
                if (!exists) {
                    itemsToDelete.push(oldItem);
                }
            }
        );

        realm.delete(itemsToDelete);

        data.forEach(
            (item) => {
                realm.create('Item', {
                    id: item.id,
                    type: item.type,
                }, true);
            }
        );
        console.log(`finished writing ${type}`);
    });
    console.log(`after writing ${type}`);
}

class App extends Component {
    state = {
        items: realm.objects('Item').filtered('type == "first"'),
    };

    componentWillMount() {
        this.state.items.addListener(() => this.forceUpdate());
    }

    componentDidMount() {
        setTimeout(() => {
            writeItems(items, 'second');
            writeItems(items, 'first');
        }, 100);
    }

    componentWillUnmount() {
        this.state.items.removeAllListeners();
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Select "Debug JS Remotely" and wait a dozen of seconds to code to execute and react redbox with "realm.objects(...).filtered is not a function" error to emerge!</Text>
                <Text>{`Total items: ${this.state.items.length}`}</Text>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
});

AppRegistry.registerComponent('realmobjectsnumberbugtestcase', () => App);
