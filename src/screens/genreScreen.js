import { Container } from 'native-base';
import React, { useEffect, useState } from 'react'
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import Config from 'react-native-config';
import MovieListItem from '../components/movieListItem';
import api from '../misc/api';

const GenreScreen = ({ route, navigation }) => {
    const { genreId, genreName } = route.params;
    const [loading, setloading] = useState(false)
    const [movieList, setmovieList] = useState([])
    const [page, setpage] = useState(1)

    useEffect(() => {
        navigation.setOptions({
            title: genreName?.toUpperCase()
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
            setloading(true)
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
            setloading(false)
            console.warn(error)
        }
    }

    const sortMovies = () => {
        let array = movieList;
        array.sort(function (a, b) { return a.vote_average - b.vote_average });
        setmovieList(array)
        setloading(false)
    }


    return (
        <Container style={{flex:1}}>
            {loading ? <ActivityIndicator size={'large'} style={styles.loader} /> : (
                <FlatList
                    data={movieList}
                    keyExtractor={(item, index) => item.id + "_" + index}
                    numColumns={3}
                    renderItem={({ item }) => (
                        <MovieListItem item={item} screenName={'Genre'} />
                    )}
                />
            )}
        </Container>
    )
}

const styles = StyleSheet.create({
    loader: {
        flex: 1, justifyContent: 'center'
    }
})


export default GenreScreen
