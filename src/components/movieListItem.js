import { useNavigation } from '@react-navigation/native'
import { CardItem } from 'native-base'
import React, { useEffect } from 'react'
import { StyleSheet, Image, TouchableOpacity, ImageComponent, ImageBackground, Text, Alert } from 'react-native'
import { Card } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'
import { addToRecentlyVisited } from '../redux/recentlyVisitedSlice'
import { addToWatchList } from '../redux/watchListSlice'


const MovieListItem = ({ item }) => {
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
        let title = '';
        let subTitle = ''
        let index = watchList.findIndex(data => { return data.id === item.id });

        if (index >= 0) {
            title = 'Sorry!';
            subTitle = 'This movie is already added in your watch list.'
        } else {

            dispatch(addToWatchList(item))
            title = 'Success!';
            subTitle = 'This movie is successfully added to your watch list'

        }
        showAlert(title, subTitle)
    }

    const showAlert = (title = '', subTitle = '') => {

        Alert.alert(
            title,
            subTitle,
            [

                { text: "CLOSE", onPress: () => { }, style: "cancel" }
            ]
        );

    }


    return (
        <TouchableOpacity onPress={onPressMovie}>
            <Card style={styles.card} key={item.id}>
                <CardItem style={styles.cardItem}>
                    {item.poster_path != null ? (
                        <>
                            <Image
                                resizeMethod='resize'
                                resizeMode='cover'
                                style={styles.images}
                                source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.poster_path }}

                            />
                        </>
                    ) : (
                        <Image
                            resizeMode='stretch'
                            style={styles.images}
                            source={require('../assets/no-image-icon.png')}
                        />
                    )}
                </CardItem>
                <CardItem footer style={styles.cardItemFooter}>
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
        borderRadius: 8
    },
    cardItem: {
        paddingLeft: 0,
        paddingRight: 0,

        paddingTop: 0,
        paddingBottom: 0
    },
    cardItemFooter: {
        borderRadius: 8
    },
    footerBtnText: {
        color: '#fff', fontSize: 12
    },
    footerBtn: {
        flexDirection: 'row', backgroundColor: '#039aff', padding: 6,
        borderRadius: 4
    },
    images: {
        height: 160,
        width: 100,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flex: 1
    }

})


export default MovieListItem
