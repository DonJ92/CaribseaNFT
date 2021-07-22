import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";
import ls from 'local-storage';
import constants from '../globals/constants';

function get_current_provider() {
    var wallet_type = ls.get(constants.local_storage_key.KEY_WALLET_TYPE);

    if (wallet_type == null) return null;

    if (wallet_type == constants.wallet_type.METAMASK) {
        return Web3.givenProvider;
    } else if (wallet_type == constants.wallet_type.WalletConnectProvider) {
        const provider = new WalletConnectProvider({
            rpc: {
              3: "https://ropsten.mycustomnode.com",
              97: "https://data-seed-prebsc-1-s1.binance.org:8545"
            }
        });

        return provider;
    }
}

module.exports = {
    format_datetime
}