import { useNavigation } from '@react-navigation/native'
import { CardItem } from 'native-base'
import React from 'react'
import { StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native'
import { Caption, Card } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'
import { addToRecentlyVisited } from '../redux/recentlyVisitedSlice'
import AddToWatchList from '../misc/addToWatchList';

const MovieListItem = ({ item, screenName = null }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const watchList = useSelector(state => state.watchList)
    const recentlyVisited = useSelector(state => state.recentlyVisited)

    const onPressMovie = () => {
        let index = recentlyVisited.findIndex(data => { return data.id === item.id });
        if (index < 0) {
            dispatch(addToRecentlyVisited(item))
        }
        navigation.navigate('Detail', { movie_id: item.id, title: item.title })
    }
    const onPressAddToWatchList = () => {
        AddToWatchList(item, watchList, dispatch)     
    }   

    return (
        <TouchableOpacity onPress={onPressMovie} >
            <Card style={styles.card}>
                <CardItem cardBody style={styles.cardItem}>
                    <Image
                        resizeMethod='resize'
                        resizeMode="cover"
                        source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.poster_path }}
                        style={styles.images}
                    />
                </CardItem>
                <CardItem footer style={screenName == null ? styles.cardItemFooter : styles.cardItemFooterForGenre}>
                    <Caption numberOfLines={1} >{item.title}</Caption>
                    <TouchableOpacity style={styles.footerBtn} onPress={onPressAddToWatchList}>
                        <Ionicons name="add" size={15} color={'#fff'} />
                        <Text style={styles.footerBtnText}>WATCHLIST</Text>
                    </TouchableOpacity>
                </CardItem>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    card: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    cardItem: {
        justifyContent: 'center'
    },
    cardItemFooter: {
        borderRadius: 8,
        flexDirection: 'column',
        width: 140,
        paddingLeft: 5,
        paddingRight: 5,
    },

    cardItemFooterForGenre: {
        borderRadius: 8,
        flexDirection: 'column',
        width: 130,
        paddingLeft: 5,
        paddingRight: 5,
    },
    footerBtnText: {
        color: '#fff', fontSize: 12
    },
    footerBtn: {
        flexDirection: 'row',
        backgroundColor: '#039aff',
        padding: 6,
        borderRadius: 4,
        marginTop: 5
    },
    images: {
        height: 160,
        width: 110,
    },
    title: {
        fontSize: 15
    }

})


export default MovieListItem