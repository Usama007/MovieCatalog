import { Body, Col, Left, List, ListItem, Right, Thumbnail } from 'native-base'
import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { removeFromWatchList } from '../redux/watchListSlice'


const WatchListScreen = () => {
    const watchList = useSelector(state => state.watchList)
    const dispatch = useDispatch()

    const onPressRemoveFromWatchList = (item) => {
        dispatch(removeFromWatchList(item))
    }

    return (
        <View>
            <List>
                <FlatList
                    data={watchList}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (


                        <ListItem thumbnail>
                            <Left>
                                <Thumbnail square source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.poster_path }}
                                />
                            </Left>
                            <Body>
                                <Text>{item.original_title}</Text>

                                <Text note numberOfLines={4} style={{ fontSize: 12 }}>{item.overview}</Text>
                            </Body>
                            <Right>
                                <TouchableOpacity onPress={() => { onPressRemoveFromWatchList(item) }}>
                                    <Ionicons name="trash" size={20} color={'red'} />

                                </TouchableOpacity>
                            </Right>
                        </ListItem>


                    )}
                />

            </List>

        </View>
    )
}

export default WatchListScreen
