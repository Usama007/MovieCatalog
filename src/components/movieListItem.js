import { CardItem } from 'native-base'
import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { Card } from 'react-native-paper'

const MovieListItem = ({ item }) => {
    return (
        <Card style={styles.card} key={item.id}>
            <CardItem style={styles.cardItem}>
                {item.poster_path != null ? (
                    <Image
                        resizeMethod='resize'
                        resizeMode='cover'
                        style={styles.images}
                        source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.poster_path }}

                    />
                ) : (
                    <Image
                        resizeMode='stretch'
                        style={styles.images}
                        source={require('../assets/no-image-icon.png')}
                    />
                )}
            </CardItem>
        </Card>
    )
}

const styles = StyleSheet.create({

    card: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 8
    },
    cardItem: {
        paddingLeft: 0,
        paddingRight: 0,
        borderRadius: 8,
        paddingTop: 0,
        paddingBottom: 0
    },
    images: {
        height: 160,
        width: 110,
        borderRadius: 8
    }

})


export default MovieListItem
