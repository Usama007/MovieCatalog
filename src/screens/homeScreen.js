import { Container, List, ListItem } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import Config from 'react-native-config'
import MovieListItem from '../components/movieListItem'

import api from '../misc/api'

const HomeScreen = () => {
    const [loading, setloading] = useState(false)
    const [genreObj, setgenreObj] = useState({})

    useEffect(() => {
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
                    let index = movie.genre_ids.findIndex(item => { return item === genre.id });
                    if (index >= 0) {
                        array.push(movie)
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
                    {Object.keys(genreObj).map((obj, index) =>
                        <List key={obj} >
                            <ListItem itemDivider >
                                <Text style={styles.genreName}>{obj}</Text>
                            </ListItem>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {genreObj[obj].map((item, index) =>
                                    <MovieListItem item={item} />

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
