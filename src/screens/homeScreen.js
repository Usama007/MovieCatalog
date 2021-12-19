import { Card, CardItem, Container, List, ListItem, View } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Pressable, TouchableHighlight, FlatList, Image } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Config from 'react-native-config'
import MovieListItem from '../components/movieListItem'
import api from '../misc/api'
import { useSelector } from 'react-redux'

import recentlyVisitedSlice from '../redux/recentlyVisitedSlice'

const HomeScreen = ({ navigation }) => {
    const [loading, setloading] = useState(false)
    const [genreList, setgenreList] = useState([])
    const [genreObj, setgenreObj] = useState({})
    const [jsonArray, setjsonArray] = useState([])
    const [fetchMovies, setfetchMovies] = useState(false)
    const recentlyVisited = useSelector(state => state.recentlyVisited)
    const watchList = useSelector(state => state.watchList)
    const [traverseCompleted, settraverseCompleted] = useState(false)

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         getMovieGenreList()
    //     });
    //     return unsubscribe;
    // }, [navigation])


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                    navigation.navigate('WatchList')
                }}>
                    <Ionicons name='heart' size={20} color={'#FDCC0D'} />
                    <Text>GO TO WATCHLIST</Text>
                </TouchableOpacity>

            )

        })
        getGenreList()
    }, [])

    useEffect(() => {
        if (fetchMovies) {
            setfetchMovies(false);
            getMovieList()
        }
    }, [fetchMovies])

    useEffect(() => {

    }, [jsonArray])

    useEffect(() => {
        if (traverseCompleted) {
            setloading(false)
        }
    }, [traverseCompleted])






    const getGenreList = async () => {
        try {
            setloading(true)

            let genres = await api.get("genre/movie/list", {
                params: {
                    api_key: Config.API_KEY,
                    language: 'en-US'
                }
            })


            let array = []
            for (var genre of genres.data?.genres) {
                let obj = {
                    id: genre.id,
                    name: genre.name,
                    movies: []
                }
                array.push(obj)
            }

            setjsonArray(array)
            setloading(false)

            setfetchMovies(true)

        } catch (error) {
            console.warn(error)
            setloading(false)
        }
    }



    const getMovieList = async (page = 1) => {
        try {
            setloading(true)
            let continueToTraverse = false;
            console.log('Before: ', jsonArray);

            let movies = await api.get("movie/popular", {
                params: {
                    api_key: Config.API_KEY,
                    language: 'en-US',
                    page: page
                }
            })

            for (var movie of movies.data?.results) {
                for (var genre of jsonArray) {
                    if (genre.movies.length < 5) {
                        continueToTraverse = true;
                        if (movie.poster_path != null) {
                            let index = movie.genre_ids.findIndex(item => { return item === genre.id });
                            if (index >= 0) {
                                genre.movies.push(movie)
                            }
                        }
                    } else {
                        if (!continueToTraverse) {
                            continueToTraverse = false
                        }
                    }
                }
            }

            if (continueToTraverse) {          
                let pageNo = page + 1;
                if(pageNo<15){
                    getMovieList(pageNo)
                }else{
                    continueToTraverse = false
                    settraverseCompleted(true)
                }                
            } else {
                settraverseCompleted(true)
            }




            // let continueTraversing = true;
            // let array = [];
            // let movies = await api.get("movie/top_rated", {
            //     params: {
            //         api_key: Config.API_KEY,
            //         language: 'en-US',
            //         page: page
            //     }
            // })
            // console.log(movies.data.results);

            // for(var movie of movies.data?.results){

            //     for(var genre of jsonArray){
            //         // if(genre.movies.length <5){
            //         //     if (movie.poster_path != null) {
            //         //         let index = movie.genre_ids.findIndex(item => { return item === genre.id });
            //         //         if (index >= 0) {
            //         //             genre.movie.push(movie)
            //         //         }

            //         //     }
            //         // }else{
            //         //     break;
            //         // }
            //     }

            // }






        } catch (error) {
            console.warn(error)
            setloading(false)
        }
    }


    const getMissingArrays = () => {

    }




    return (

        <Container>
            {loading ? (
                <ActivityIndicator size={'large'} style={styles.loader} />
            ) : (
                <ScrollView>
                    {recentlyVisited.length > 0 && (
                        <>
                            <ListItem itemDivider >
                                <Text style={styles.genreName}>RECENTLY VISITED</Text>
                            </ListItem>

                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {recentlyVisited.map((item, index) =>
                                    <MovieListItem key={item.id} item={item} />
                                )}
                            </ScrollView>
                        </>
                    )}

                    {jsonArray.map((genre, index) =>
                        <List key={genre.id}>
                            <ListItem itemDivider style={styles.genreItemDivider} onPress={() => {
                                navigation.navigate('Genre', { genreId: genre.id, genreName: genre.name })
                            }}>
                                <Text style={styles.genreName}>{genre.name}</Text>
                                <Ionicons name="chevron-forward" size={15} />
                            </ListItem>

                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {genre.movies.map((item, index) =>
                                    <MovieListItem key={item.id} item={item} />
                                )}
                            </ScrollView>
                        </List>
                    )}
                </ScrollView>
            )}
        </Container>
    )
}

const styles = StyleSheet.create({
    loader: {
        flex: 1, justifyContent: 'center'
    },
    genreName: {
        fontSize: 16,
        textTransform: 'uppercase'
    },
    genreItemDivider: {
        justifyContent: 'space-between'
    }

})
export default HomeScreen
