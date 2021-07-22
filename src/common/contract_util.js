import SupportTokens from '../globals/support_tokens';
import support_networks from '../globals/support_networks';

import BSC_WBNB from '../contract/BSC_WBNB.json';
import BSC_DAI from '../contract/BSC_DAI.json';
import BSC_USDT from '../contract/BSC_USDT.json';

import ETH_WETH from '../contract/ETH_WETH.json';
import ETH_DAI from '../contract/ETH_DAI.json';
import ETH_USDT from '../contract/ETH_USDT.json';

function get_abi(asset, chain_id) {
    if (chain_id == support_networks.ETHEREUM) {
        switch(asset) {
            case SupportTokens.ETHEREUM.WETH:
                return ETH_WETH;
            case SupportTokens.ETHEREUM.DAI:
                return ETH_DAI;
            case SupportTokens.ETHEREUM.USDT:
                return ETH_USDT;
            default:
                return null;
        }
    } else if (chain_id == support_networks.BSC) {
        switch(asset) {
            case SupportTokens.BSC.WBNB:
                return BSC_WBNB;
            case SupportTokens.BSC.DAI:
                return BSC_DAI;
            case SupportTokens.BSC.USDT:
                return BSC_USDT;
            default:
                return null;
        }
    } else {
        return null;
    }
}

export default {
    get_abi,
};