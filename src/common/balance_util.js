function format_balance(_balance, asset_name, decimal = 4) {
    try {
        var ret = parseFloat(_balance).toFixed(decimal);
        return ret + ' ' + asset_name;
    } catch (err) {
        return 0 + ' ' + asset_name;
    }
}

function format_usd_amount(amount) {
    var ret = parseFloat(amount).toFixed(2);
    return '$' + ret;
}

module.exports = {
    format_balance,
    format_usd_amount
}