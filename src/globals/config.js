var config = {
    chain_id : 0x61, //56: mainnet, 97: testnet 
    blockexplorer_url: 'https://bscscan.com/',
    backend_url: 'http://192.168.2.103:4000',
    avatar_url: 'http://192.168.2.103/caribnft/avatars/',
    cover_url: 'http://192.168.2.103/caribnft/covers/',
    preview_url: 'http://192.168.2.103/caribnft/preview/',
    token_url: 'http://192.168.2.103/caribnft/tokens/',
    host_url: 'http://192.168.2.116:3000',

    contracts: {
        bsc: {
            contract_erc721_transfer_proxy: '0xf141Ffb4403C017C10a389A4A86faC51Ba9E07F6',
            contract_erc20_transfer_proxy: '0x45C0e2c69Ebc0971a5df16bDB1879050963ccBd4',
            contract_exchange: '0x3E2a8b6B84b22bd0d9E868c9314a6A23d6951487',
            contract_exchange_erc1155: '0xdc7d9FdF39F234AfC713cab4f5C73aA8b98F07b0',
            contract_caribmars: '0xA5498618C2e999E93A376427cE480C992AEa4d97',
            contract_erc1155: '0x888680336E42a372b1E70B0F479bf9d1B03699Ee',
        },
        ethereum: {
            contract_erc721_transfer_proxy: '0x310a88C187Ea383e3406dE58DB71CdC40Ed20323',
            contract_erc20_transfer_proxy: '0x2a414b75Fe2a9b99b872cdc0c2cFB1902532Fe6A',
            contract_exchange: '0x5301A901ef38d938Bd1058fF6148740c78D4Cdb8',
            contract_exchange_erc1155: '0xe6dE2216467fc343a1Ca685531812750A343b0b4',
            contract_caribmars: '0x39cb66390A74a9B5B13832501917790845799971',
            contract_erc1155: '0xd37509e9B9319e2047Fd592e34eE773D3B82B65f',
        }
    },

    StakingAmount: 100000,

    service_fee: 2.5,
    listing_fee: 0.015,
    
    support_tokens: support_tokens,

    tick_url: 'https://api.binance.com/api/v1/ticker/price?symbol=',
    tick_all_url: 'https://api.binance.com/api/v1/ticker/price',

    cors_url: 'https://cors.bridged.cc/',

    twitter_url: 'https://twitter.com/',
    twitter_api_url: 'https://api.twitter.com/',
    twitter_consumer_key: 'sG7Xpi95kIBcp8Vw5fEZwC9dG',
    twitter_consumer_security: 'UHVq2na1STjIPIoLbR8dIqICz9yLrx3MVq8wEnJLQhgwmNLnHu',
    twitter_bearer_token: 'AAAAAAAAAAAAAAAAAAAAADKdRgEAAAAAoZ9ekD6AB1E2b54Beu1i1OGjSxA%3DHKcCBKEvS8ZQnv0JyB9dtnpi43UVOD6jcuhZR49kHmvTGIEL6D',
    twitter_get_count: 40,

    youtube_api_url: 'https://youtube.googleapis.com/',
    google_api_key: 'AIzaSyAhx38K_IVyfSmZNTruPUwhQBjfqG4rJMk',
    google_client_id: '1029548754473-jrlf5ei1ergc4h9gkqvq1oe2e1ha24pe.apps.googleusercontent.com',
    youtube_get_count: 40,
};

var support_tokens = {
    WBNB: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
};

module.exports = config;