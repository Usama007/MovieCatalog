import { Body, Col, Container, H3, Left, List, ListItem, Right, Thumbnail } from 'native-base'
import React, { useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { removeFromWatchList } from '../redux/watchListSlice'
import { Caption } from 'react-native-paper'


const WatchListScreen = ({ navigation }) => {
    const watchList = useSelector(state => state.watchList)
    const dispatch = useDispatch()


    const onPressRemoveFromWatchList = (item) => {
        dispatch(removeFromWatchList(item))
    }

    return (
        <Container style={styles.container}>
            {watchList.length>0?(
                   <List>
                   <FlatList
                       data={watchList}
                       keyExtractor={item => item.id}
                       renderItem={({ item }) => (   
   
                           <ListItem thumbnail onPress={()=>{
                            navigation.navigate('Detail', { movie_id: item.id, title: item.title })
                           }}>
                               <Left>
                                   <Thumbnail resizeMethod='resize' resizeMode='stretch' large square source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.poster_path }}
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
            ):(
                <View style={styles.noItemWrapper}>
                     <Ionicons style={styles.icon} name="warning" size={100} color={'#bbbec4'} />
                     <Caption style={styles.caption}>Watchlist is empty</Caption>
                </View>
            )}
         

        </Container>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    noItemWrapper:{
        flex:1,
        justifyContent:'center',
        alignSelf:'center'
    },
    icon:{
        alignSelf:'center'
        
    },
    caption:{
        fontSize: 18,
        
    }
})


export default WatchListScreen
