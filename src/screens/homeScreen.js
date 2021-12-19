import { Container, List, ListItem } from 'native-base'
import React, { useEffect, useState } from 'react'
import { View,Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Config from 'react-native-config'
import MovieListItem from '../components/movieListItem'
import api from '../misc/api'
import { useSelector } from 'react-redux'

const HomeScreen = ({ navigation }) => {
    const [loading, setloading] = useState(false)
    const [jsonArray, setjsonArray] = useState([])
    const [fetchMovies, setfetchMovies] = useState(false)
    const recentlyVisited = useSelector(state => state.recentlyVisited)
    const [traverseCompleted, settraverseCompleted] = useState(false)

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
            settraverseCompleted(false);
            let continueToTraverse = false;

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
                if (pageNo < 15) {
                    getMovieList(pageNo)
                } else {
                    continueToTraverse = false
                    settraverseCompleted(true)
                }
            } else {
                settraverseCompleted(true)
            }

        } catch (error) {
            console.warn(error)
            setloading(false)
        }
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
                                {recentlyVisited.map((item) =>
                                    <MovieListItem key={item.id} item={item} />
                                )}
                            </ScrollView>
                        </>
                    )}

                    {jsonArray.map((genre) =>
                        <View key={genre.id}>
                            {genre.movies.length > 0 && (
                                <List >
                                    <ListItem itemDivider style={styles.genreItemDivider} onPress={() => {
                                        navigation.navigate('Genre', { genreId: genre.id, genreName: genre.name })
                                    }}>
                                        <Text style={styles.genreName}>{genre.name}</Text>
                                        <Ionicons name="chevron-forward" size={15} />
                                    </ListItem>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        {genre.movies.map((item) =>
                                            <MovieListItem key={item.id} item={item} />
                                        )}
                                    </ScrollView>
                                </List>
                            )}
                        </View>
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
