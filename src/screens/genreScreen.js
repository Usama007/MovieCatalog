import { CardItem, Container, List, ListItem, Thumbnail } from 'native-base';
import { Caption, Card } from 'react-native-paper';

import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Config from 'react-native-config';
import MovieListItem from '../components/movieListItem';
import api from '../misc/api';
import ImageBackground from 'react-native/Libraries/Image/ImageBackground';

const GenreScreen = ({ route, navigation }) => {
    const { genreId, genreName } = route.params;
    const [loading, setloading] = useState(false)
    const [movieList, setmovieList] = useState([])
    const [page, setpage] = useState(1)


    useEffect(() => {
        navigation.setOptions({
            title: genreName
        })
        getMovieList()
    }, [])

    useEffect(() => {
        if (movieList.length < 12) {
            getMovieList()
        } else {
            sortMovies();
        }
    }, [page])



    const getMovieList = async () => {
        try {
            let array = movieList;
            let pageNo = page
            let movies = await api.get(`movie/popular`, {
                params: {
                    api_key: Config.API_KEY,
                    page: pageNo
                }
            })

            for (var movie of movies.data?.results) {
                if (array.length == 12)
                    break;
                if (movie.poster_path != null) {
                    let index = movie.genre_ids.findIndex(item => { return item == genreId });
                    if (index >= 0) {
                        let arrayIndex = array.findIndex(item => { return item.id == movie.id });
                        if (arrayIndex < 0) {
                            array.push(movie)
                        }
                    }
                }
            }

            setpage(pageNo + 1)
            setmovieList(array);

        } catch (error) {
            console.warn(error)
        }

    }

    const sortMovies = () => {
        let array = movieList;
        array.sort(function (a, b) { return a.vote_average - b.vote_average });
        setmovieList(array)
    }


    return (
        <Container >
            {loading ? <ActivityIndicator size={'large'} /> : (

                <FlatList
                    data={movieList}
                    keyExtractor={(item, index) => item.id + "_" + index}
                    numColumns={3}
                    renderItem={({ item }) => (

                        <MovieListItem item={item} screenName={'Genre'} />
                        // <List>
                        //     <ListItem>
                        //         <ImageBackground resizeMethod="resize" resizeMode="cover" source={{ uri: 'https://image.tmdb.org/t/p/w500' + item.poster_path }}
                        //             style={styles.image}
                        //         >

                        //         </ImageBackground>

                        //     </ListItem>
                        //     <ListItem style={{ flexDirection: 'column' }}>
                        //         <Caption numberOfLines={1} >{item.title}</Caption>
                        //         <TouchableOpacity style={styles.footerBtn}>
                        //             <Ionicons name="add" size={15} color={'#fff'} />
                        //             <Text style={styles.footerBtnText}>WATCHLIST</Text>
                        //         </TouchableOpacity>
                        //     </ListItem>

                        // </List>
                    )}
                />
            )}

        </Container>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1
    },
    images: {
        height: 160,
        width: 100,       // flex: 1
    },
    footerBtnText: {
        color: '#fff',
        fontSize: 12
    },
    footerBtn: {
        flexDirection: 'row', backgroundColor: '#039aff', padding: 6,
        borderRadius: 4
    },
})


export default GenreScreen
