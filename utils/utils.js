function convertCheckboxToBoolean(val){
    if (val == "on"){
        return true
    }
    return false
}



module.exports = {
    convertCheckboxToBoolean: convertCheckboxToBoolean
}