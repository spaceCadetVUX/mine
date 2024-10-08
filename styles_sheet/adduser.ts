import { StyleSheet,Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
      },
      input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
      },
      label: {
        fontSize: 16,
        marginBottom: 5,
      },
})