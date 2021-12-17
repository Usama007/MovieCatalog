import { Container, List, ListItem } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Config from 'react-native-config'
import MovieListItem from '../components/movieListItem'
import api from '../misc/api'
import { useSelector } from 'react-redux'
import recentlyVisitedSlice from '../redux/recentlyVisitedSlice'

const HomeScreen = ({ navigation }) => {
    const [loading, setloading] = useState(false)
    const [genreObj, setgenreObj] = useState({})
    const recentlyVisited = useSelector(state => state.recentlyVisited)


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
        getMovieGenreList()
    }, [])

    const getMovieGenreList = async () => {
        try {
            setloading(true)
            let jsonObj = {};
            let array = [];

            let genres = await api.get("genre/movie/list", {
                params: {
                    api_key: Config.API_KEY,
                    language: 'en-US'
                }
            })

            for (var genre of genres.data?.genres) {
                let pageNo = 1;
                let movies = await api.get("search/movie", {
                    params: {
                        api_key: Config.API_KEY,
                        language: 'en-US',
                        page: pageNo,
                        include_adult: false,
                        query: genre.name,
                    }
                })
                for (var movie of movies.data?.results) {
                    if (array.length == 5)
                        break;
                    if (movie.poster_path != null && movie.vote_average > 7) {
                        let index = movie.genre_ids.findIndex(item => { return item === genre.id });
                        if (index >= 0) {
                            array.push(movie)
                        }
                    }
                }
                if (array.length < 5) {
                    pageNo++;
                    continue;
                } else {
                    jsonObj[genre.name] = array;
                    array = [];
                    pageNo = 1;
                }
            }
            setgenreObj(jsonObj)
            setloading(false)
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
                                {recentlyVisited.map((item, index) =>
                                    <MovieListItem key={item.id} item={item} />
                                )}
                            </ScrollView>
                        </>
                    )}

                    {Object.keys(genreObj).map((obj, index) =>
                        <List key={obj} >
                            <ListItem itemDivider >
                                <Text style={styles.genreName}>{obj}</Text>
                            </ListItem>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {genreObj[obj].map((item, index) =>
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
    }

})
export default HomeScreen
