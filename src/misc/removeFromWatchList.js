import { Alert } from "react-native";
import { removeFromWatchList } from "../redux/watchListSlice";

const RemoveFromWatchList = (item,dispatch) => {
    let title = '';
    let subTitle = ''
    dispatch(removeFromWatchList(item))

    title = 'Success!';
    subTitle = 'This movie is successfully removed from your watchlist'
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

module.exports = RemoveFromWatchList;
