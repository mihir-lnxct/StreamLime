import { ms, ScaledSheet } from "react-native-size-matters"
import colorPalates from "../../../theme/colorPalates"
import colors from "../../../theme/colors"


export default ScaledSheet.create({
    headerContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginHorizontal:ms(16),
        marginTop:ms(16),
        marginBottom:ms(8)
    },
    profileImage:{
        height:ms(70),
        width:ms(70),
        borderRadius:ms(35)
    },
    CounterContainer:{
        alignItems:'center',
    },
    Counter:{
        color:colorPalates.AppTheme.text,
        fontFamily:'Ubuntu-Bold',
        fontSize:ms(16)
    },
    conterText:{
        color:colorPalates.AppTheme.text,
        fontFamily:'Ubuntu-Regular'
    },
    bioContainer:{
        marginHorizontal:ms(16),
    },
    fullName:{
        color:colorPalates.AppTheme.text,
        fontFamily:'Ubuntu-Rgular',
        fontSize:ms(16)
    },
    bio:{
        color:colors.blackShade20,
        fontSize:ms(13),
        marginTop:ms(8)
    },
    editButton:{
        marginHorizontal:ms(16),
        borderRadius:ms(10),
        marginVertical:ms(12),
        backgroundColor:colorPalates.white,
        borderColor:colorPalates.AppTheme.border,
        borderWidth:1
    },
    editProfileText:{
        color:colorPalates.AppTheme.primary,
        fontSize:ms(14),
        textAlign:'center',
        padding:ms(8),
        fontWeight:'600'
    },
    flatListContainer:{
        marginHorizontal:ms(16),
        paddingBottom:ms(80)
    }
})