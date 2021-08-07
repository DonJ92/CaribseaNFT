var wallet_type = {
    NONE : 0,
    METAMASK: 1,
    WALLETCONNECT: 2
}

var local_storage_key = {
    KEY_WALLET_TYPE : 'wallet_type',
    KEY_WALLET : 'wallet',
    KEY_CONNECTED: 'connected',
    KEY_WALLET_CONNECT: 'walletconnect',
}

var profile_selected_tab = {
    ON_SALE : 1,
    COLLECTIBLES: 2,
    CREATED: 3,
    LIKES: 4,
    FOLLOWINGS: 5,
    FOLLOWERS: 6
}

var item_selected_tab = {
    INFO : 1,
    OWNERS: 2,
    HISTORY: 3,
    BIDS: 4
}

var token_type = {
    SINGLE: "single",
    MULTIPLE: "multiple"
}

var sns_type = {
    TWITTER: "twitter",
    YOUTUBE: "youtube"
}

var protocol_type = {
    NONE: 0,
    ERC721: 1,
    ERC1155: 2
}

var tx_type = {
    NONE: 0,
    MINT: 1,
    TRANSFER: 2,
    BURN: 3,
    BUY: 4,
    EXCHANGE: 5,
    STAKE: 6,
    REVOKE: 7
}

var token_status = {
    NONE: 0,
    FIXED_PRICE: 1,
    AUCTION: 2,
    STAKED: 3,
    BURN: 4
}

var ACTIVITY_TYPE = {
    NONE: 0,
    MINT: 1,
    TRANSFER: 2,
    LIST_FIXED_SIZE: 3,
    LIST_AUCTION: 4,
    UNLIST: 5,
    BID: 6,
    EXCHANGE: 7,
    BUY: 8,
    SELF_CANCEL: 9,
    CANCEL: 10,
    FOLLOW: 11,
    UNFOLLOW: 12,
    STAKE: 13,
    REVOKE: 14,
    BURN: 15
}

var ACTIVITY_STATUS = {
    NOT_READ: 0,
    READ: 1
}

var ACTIVITY_SIDE = {
    FROM: 1,
    TO: 2
}

var ACTIVITY_TAB = {
    MY: 1,
    FOLLOWINGS: 2,
    ALL: 3
};

module.exports = {
    wallet_type,
    local_storage_key,
    profile_selected_tab,
    token_type,
    sns_type,
    protocol_type,
    item_selected_tab,
    tx_type,
    token_status,
    ACTIVITY_TYPE,
    ACTIVITY_STATUS,
    ACTIVITY_SIDE,
    ACTIVITY_TAB
}