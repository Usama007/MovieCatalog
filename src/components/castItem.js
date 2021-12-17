import { Card, CardItem } from 'native-base'
import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

const CastItem = ({item}) => {
    return (
        <Card style={styles.card}>
            <CardItem style={styles.cardItem}>
                <Image
                    resizeMethod='resize'
                    resizeMode='contain'
                    style={styles.image}
                    source={item.profile_path != null ? { uri: 'https://image.tmdb.org/t/p/w500' + item.profile_path } : require('../assets/no-image-icon.png')}
                />

            </CardItem>
            <CardItem style={{ paddingTop: 0, borderRadius: 8 }}>
                <Text>{item.name}</Text>
            </CardItem>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 8
    },
    cardItem: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        borderRadius: 8
    },
    image:{
        height: 160, width: 100, flex: 1
    }
})


export default CastItem
