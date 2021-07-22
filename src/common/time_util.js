function format_datetime(datetime) {
    var ret = datetime.split('.')[0];
    ret = ret.replace('T', ' ');
    return ret;
}

module.exports = {
    format_datetime
}