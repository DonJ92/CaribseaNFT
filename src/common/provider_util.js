import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";
import ls from 'local-storage';
import constants from '../globals/constants';

async function get_current_provider() {
    var wallet_type = ls.get(constants.local_storage_key.KEY_WALLET_TYPE);

    if (wallet_type == null) return null;

    if (ls.get(constants.local_storage_key.KEY_CONNECTED) == null || ls.get(constants.local_storage_key.KEY_CONNECTED) == 0) {
        return null;
    }

    if (wallet_type == constants.wallet_type.METAMASK) {
        return Web3.givenProvider;
    } else if (wallet_type == constants.wallet_type.WALLETCONNECT) {
        var provider = new WalletConnectProvider({
            infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
            rpc: {
                    // 1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                    3: "https://ropsten.mycustomnode.com",
                    97: "https://data-seed-prebsc-1-s1.binance.org:8545"
                    }
        });

        provider.onDisconnect(() => {
            ls.set(constants.local_storage_key.KEY_CONNECTED, 0);
            ls.set(constants.local_storage_key.KEY_WALLET_TYPE, constants.wallet_type.NONE);
            document.location.reload();
        })

        provider.on('error', (code, data) => {
            console.log(code);
        });

        await provider.enable();

        return provider;
    }
}

export default {
    get_current_provider
}