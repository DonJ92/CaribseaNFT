import support_networks from '../globals/support_networks';
import config from '../globals/config';

function get_chain_name(chain_id) {
    switch(chain_id) {
        case support_networks.ETHEREUM:
            return "Ethereum";
        case support_networks.BSC:
            return "Binance Smart Chain";
        default:
            return "Unknown";
    }
}

function get_erc721_transfer_proxy_address(chain_id) {
    if (chain_id == support_networks.ETHEREUM) {
        return config.contracts.ethereum.contract_erc721_transfer_proxy;
    } else if (chain_id == support_networks.BSC) {
        return config.contracts.bsc.contract_erc721_transfer_proxy;
    }
    return null;
}

function get_erc20_transfer_proxy(chain_id) {
    if (chain_id == support_networks.ETHEREUM) {
        return config.contracts.ethereum.contract_erc20_transfer_proxy;
    } else if (chain_id == support_networks.BSC) {
        return config.contracts.bsc.contract_erc20_transfer_proxy;
    }
    return null;
}

function get_exchange(chain_id) {
    if (chain_id == support_networks.ETHEREUM) {
        return config.contracts.ethereum.contract_exchange;
    } else if (chain_id == support_networks.BSC) {
        return config.contracts.bsc.contract_exchange;
    }
    return null;
}

function get_exchange_erc1155(chain_id) {
    if (chain_id == support_networks.ETHEREUM) {
        return config.contracts.ethereum.contract_exchange_erc1155;
    } else if (chain_id == support_networks.BSC) {
        return config.contracts.bsc.contract_exchange_erc1155;
    }
    return null;
}

function get_caribmars(chain_id) {
    if (chain_id == support_networks.ETHEREUM) {
        return config.contracts.ethereum.contract_caribmars;
    } else if (chain_id == support_networks.BSC) {
        return config.contracts.bsc.contract_caribmars;
    }
    return null;
}

function get_erc1155(chain_id) {
    if (chain_id == support_networks.ETHEREUM) {
        return config.contracts.ethereum.contract_erc1155;
    } else if (chain_id == support_networks.BSC) {
        return config.contracts.bsc.contract_erc1155;
    }
    return null;
}

export default {
    get_chain_name,
    get_erc721_transfer_proxy_address,
    get_erc20_transfer_proxy,
    get_exchange,
    get_exchange_erc1155,
    get_caribmars,
    get_erc1155,
}