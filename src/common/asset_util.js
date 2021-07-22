import SupportTokens from '../globals/support_tokens';
import support_networks from '../globals/support_networks';

function get_asset_by_id(asset_id) {
    var asset = Object.keys(SupportTokens.ETHEREUM).find(key => SupportTokens.ETHEREUM[key] === asset_id);
    if (asset == undefined) {
        asset = Object.keys(SupportTokens.BSC).find(key => SupportTokens.BSC[key] === asset_id);
    }
    return asset;
}

function get_tick_symbol_by_id(asset_id, chain_id) {
    if (chain_id == support_networks.ETHEREUM) {
        var symbol = Object.keys(SupportTokens.ETHEREUM).find(key => SupportTokens.ETHEREUM[key] === asset_id);
        if (symbol == "WETH") symbol = "ETH";
        if (symbol == null) return null;
        return symbol + "USDT";
    } else if (chain_id == support_networks.BSC) {
        var symbol = Object.keys(SupportTokens.BSC).find(key => SupportTokens.BSC[key] === asset_id);
        if (symbol == "WBNB") symbol = "BNB";
        if (symbol == null) return null;
        return symbol + "USDT";
    }
}

export default {
    get_asset_by_id,
    get_tick_symbol_by_id
}