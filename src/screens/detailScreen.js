import { Body, Card, CardItem, Container, H1, H2, H3, List, ListItem } from 'native-base';
import React, { useEffect, useState } from 'react'
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, Linking, FlatList, ScrollView, ActivityIndicator } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Config from 'react-native-config';
import api from '../misc/api';
import moment from 'moment';
import MovieListItem from '../components/movieListItem';
import CastItem from '../components/castItem';

const DetailScreen = ({ route }) => {
    const { movie_id, title } = route.params;
    const [movieDetail, setmovieDetail] = useState({})
    const [actorList, setactorList] = useState([])
    const [crewList, setcrewList] = useState([])
    const [similarMovieList, setsimilarMovieList] = useState([])
    const [loadingDetail, setloadingDetail] = useState(false)
    const [loadingCastnCrew, setloadingCastnCrew] = useState(false)
    const [loadingSimilarMovies, setloadingSimilarMovies] = useState(false)

    useEffect(() => {
        getCredit()
        getDetail()
        getSimilarMovies()
    }, [movie_id])

    const getDetail = async () => {
        try {
            setloadingDetail(true)
            let detail = await api.get(`movie/${movie_id}`, {
                params: {
                    api_key: Config.API_KEY,
                }
            })

            setmovieDetail(detail.data);
            setloadingDetail(false)
        } catch (error) {
            console.warn(error)
            setloadingDetail(false)
        }
    }

    const getCredit = async () => {
        try {
            setloadingCastnCrew(true)
            let credits = await api.get(`movie/${movie_id}/credits`, {
                params: {
                    api_key: Config.API_KEY,
                }
            })
            let castNcrew = credits.data?.cast;
            let actorArray = [];
            let crewArray = [];
            for (var credit of castNcrew) {
                if (credit.known_for_department == 'Acting' && credit.order < 10) {
                    let actorImage = await api.get(`person/${credit.id}`, {
                        params: {
                            api_key: Config.API_KEY,
                        }
                    })
                    actorArray = [...actorArray, actorImage.data]
                } else if (credit.job == 'Producer' || credit.known_for_department == 'Directing' || credit.known_for_department == 'Writing') {
                    crewArray = [...crewArray, credit]
                }
            }
            setactorList(actorArray);
            setcrewList(crewArray);
            setloadingCastnCrew(false)
        } catch (error) {
            console.warn(error)
            setloadingCastnCrew(false)
        }
    }

    const getSimilarMovies = async () => {
        try {
            setloadingSimilarMovies(true)
            let movies = await api.get(`movie/${movie_id}/similar`, {
                params: {
                    api_key: Config.API_KEY,
                }
            })
            setsimilarMovieList(movies.data.results);
            setloadingSimilarMovies(false)
        } catch (error) {
            console.warn(error)
            setloadingSimilarMovies(false)
        }
    }


    return (
        <Container style={styles.container}>
            <ScrollView>
                {loadingDetail ? <ActivityIndicator size={'large'} /> : (
                    <>
                        <Card style={styles.topCard}>
                            <CardItem style={styles.cardItemImage}>
                                <Image
                                    resizeMethod='resize'
                                    resizeMode='contain'
                                    style={styles.images}
                                    source={{ uri: 'https://image.tmdb.org/t/p/w500' + movieDetail.poster_path }}
                                />

                            </CardItem>
                            <CardItem style={styles.topCardItem}>
                                <Text style={styles.title}>{title}</Text>
                                <Text>Release Date - {moment(movieDetail.release_date, ['YYYY-MM-DD']).format('DD-MM-YYYY')}</Text>
                                <Text>Duration - {(parseFloat(movieDetail.runtime) / 60).toFixed(2)}h</Text>
                                <Text>Rating - <Ionicons name='star' size={15} color={'#FDCC0D'} /> {movieDetail.vote_average} ({movieDetail.vote_count})</Text>

                                <Text>
                                    {movieDetail.genres?.map((item, index) => (
                                        <Text key={item.name}>{item.name}{index + 1 != movieDetail.genres.length && `, `}</Text>
                                    ))}
                                </Text>

                                <View style={styles.topCardLastRowWrapper}>
                                    {movieDetail.imdb_id != '' && (
                                        <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                                            Linking.openURL('https://www.imdb.com/title/' + movieDetail.imdb_id)
                                        }}>
                                            <Text style={styles.link}>View on IMDB</Text>
                                        </TouchableOpacity>
                                    )}


                                    <TouchableOpacity style={{ flex: 1,alignItems: 'flex-end' }} onPress={() => {
                                        
                                    }}>
                                        <Ionicons name="md-heart-outline" size={20} />
                                    </TouchableOpacity>

                                </View>



                            </CardItem>
                        </Card>

                        <Card style={styles.cardOverviewBorder}>
                            <CardItem bordered style={styles.cardOverviewBorder}>
                                <Text>Overviews</Text>
                            </CardItem>
                            <CardItem style={styles.cardOverviewBorder}>
                                <Text>{movieDetail.overview}</Text>
                            </CardItem>
                        </Card>
                    </>
                )}

                {loadingCastnCrew ? <ActivityIndicator size={'large'} /> : (<>
                    <View style={styles.viewWrapper}>
                        <ListItem itemDivider>
                            <Text>Top Actors</Text>
                        </ListItem>
                        <FlatList
                            data={actorList}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <CastItem item={item} />
                            )}
                        />
                    </View>
                </>)}


                {loadingSimilarMovies ? <ActivityIndicator size={'large'} /> : (
                    <>
                        <View style={styles.viewWrapper}>
                            <ListItem itemDivider>
                                <Text>More Like This</Text>
                            </ListItem>
                            <FlatList
                                data={similarMovieList}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <MovieListItem key={item.id} item={item} />
                                )}
                            />
                        </View>
                    </>
                )}




            </ScrollView>
        </Container>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
    },
    topCard: {
        flexDirection: 'row', borderRadius: 8
    },
    cardItemImage: {
        flex: 1, paddingLeft: 5, paddingRight: 0, borderRadius: 8
    },
    topCardItem: {
        flex: 2.5, paddingLeft: 0, flexDirection: 'column', borderRadius: 8, justifyContent: 'center', alignItems: 'flex-start'
    },
    cardOverviewBorder: {
        borderRadius: 8
    },
    images: {
        height: 160,
        width: 100,
    },
    link: {
        color: '#039aff',
        fontSize: 14
    },
    viewWrapper: {
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16
    },
    topCardLastRowWrapper:{
        flexDirection:'row'
    }
})


export default DetailScreen
