var config = {
    chain_id : 0x61, //56: mainnet, 97: testnet 
    blockexplorer_url: 'https://bscscan.com/',
    backend_url: 'https://caribsea.io:4001',
    avatar_url: 'https://caribsea.io:82/caribnft/avatars/',
    cover_url: 'https://caribsea.io:82/caribnft/covers/',
    preview_url: 'https://caribsea.io:82/caribnft/preview/',
    token_url: 'https://caribsea.io:82/caribnft/tokens/',
    host_url: 'https://caribsea.io',

    contracts: {
        bsc: {
            contract_erc721_transfer_proxy: '0x5f8aD14C22db0989353Bb78512FC1444EAB35641',
            contract_erc20_transfer_proxy: '0x64a1545A0De80f426a211e8D498A0e5dCE581215',
            contract_exchange: '0x3A74ebceCFB08D22EfE5472cBE151D12f671d4d0',
            contract_exchange_erc1155: '0x5e2aFDd44bdd8fFb5d7Ac18869c5d3a0DC3782Ad',
            contract_caribmars: '0xD923F0eDA700a27457A46791Ae3aFD25F89Ad996',
            contract_erc1155: '0x00f8eFE8Bdd64D0e2b6548041e8755070619c044',
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

    instagram_api_url: 'https://api.instagram.com/',
    instagram_graph_api_url: 'https://graph.instagram.com/',
    instagram_app_id: '1019503305449577',
    instagram_app_secret: 'a2afe5142892720060814fbeedeb36cf',
};

var support_tokens = {
    WBNB: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
};

module.exports = config;