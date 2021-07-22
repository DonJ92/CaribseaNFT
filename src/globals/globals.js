import constants from '../globals/constants';
import ls from 'local-storage';
import { UseWalletProvider, useWallet } from 'use-wallet'

function get_connected_wallet() {
    // var wallet_type = ls.get(constants.local_storage_key.KEY_WALLET_TYPE);
    // switch(wallet_type) {
    //     case constants.wallet_type.NONE:
    //         return null;
    //     case constants.wallet_type.METAMASK:
    //         return metamask_wallet;
    //     case constants.wallet_type.BINANCEWALLET:
    //         return bsc_wallet;
    // }
    // return null;
}

function set_connected_wallet(_type, _wallet) {
    // wallet_type = _type;console.log(wallet_type);
    
    // switch(wallet_type) {
    //     case constants.wallet_type.NONE:
    //         metamask_wallet = null;
    //         bsc_wallet = null;
    //         break;
    //     case constants.wallet_type.METAMASK:
    //         metamask_wallet = _wallet;
    //         break;
    //     case constants.wallet_type.BINANCEWALLET:
    //         bsc_wallet = _wallet;
    //         break;
    // }
}

function is_wallet_connected() {
    // var wallet_type = ls.get(constants.local_storage_key.KEY_WALLET_TYPE);
    // console.log(wallet_type);
    // switch(wallet_type) {
    //     case constants.wallet_type.NONE:
    //         return false;
    //     case constants.wallet_type.METAMASK:
    //         var metamask_wallet = useWallet();
    //         return metamask_wallet.status == 'connected';
    //     case constants.wallet_type.BINANCEWALLET:
    //         return false;
    // }
    // return false;
}

export {
    get_connected_wallet,
    set_connected_wallet,
    is_wallet_connected
};