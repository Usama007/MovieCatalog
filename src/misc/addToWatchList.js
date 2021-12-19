import { Alert } from "react-native";
import { addToWatchList } from "../redux/watchListSlice";

const AddToWatchList = (item, watchList, dispatch) => {
    let title = '';
    let subTitle = ''
    let index = watchList.findIndex(data => { return data.id === item.id });

    if (index >= 0) {
        title = 'Sorry!';
        subTitle = 'This movie is already added in your watchlist.'
    } else {

        dispatch(addToWatchList(item))
        title = 'Success!';
        subTitle = 'This movie is successfully added to your watchlist'

    }
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

module.exports = AddToWatchList;
