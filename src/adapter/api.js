import http from 'http';
import config from '../globals/config';
import utf8 from 'utf8';
import base64 from 'base-64';

function get_profile(address) {
    var url = config.backend_url + "/get_profile/" + address;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function update_profile(profile) {
    var profile_data = utf8.encode(JSON.stringify(profile));
    profile_data = base64.encode(profile_data);
    
    var url = config.backend_url + "/register_profile/" + profile_data;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function add_token(token, chain_id) {    
    var url = config.backend_url + "/deploy_token/" + token.deployer + "/" + token.name + "/" 
        + token.description + "/" + token.fee_percentage + "/" + token.contract_address + "/" + token.collection + "/" + token.copies + "/" + chain_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function mint_token(contract_address, metadata, chain_id) {    
    var url = config.backend_url + "/mint_token/" + contract_address + "/" + base64.encode(utf8.encode(JSON.stringify(metadata))) + "/" + chain_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_token_owned(owner) {    
    var url = config.backend_url + "/get_token_owned/" + owner;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_token_created(address) {    
    var url = config.backend_url + "/get_token_created/" + address;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_token_info(id) {    
    var url = config.backend_url + "/get_token_info/" + id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function transfer_token(contract_address, token_id, from_address, to_address) {    
    var url = config.backend_url + "/transfer_token/" + contract_address + "/" + token_id + "/" + from_address + "/" + to_address;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function transfer_erc1155_token(id, from_address, to_address, amount) {    
    var url = config.backend_url + "/transfer_erc1155_token/" + id + "/" + from_address + "/" + to_address + "/" + amount;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function sell_token(id, sell_type, price, asset_id) {    
    var url = config.backend_url + "/sell_token/" + id + "/" + sell_type + "/" + price + "/" + asset_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function sell_erc1155_token(id, sell_type, price, asset_id, amount) {    
    var url = config.backend_url + "/sell_erc1155_token/" + id + "/" + sell_type + "/" + price + "/" + asset_id + "/" + amount;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function buy_token(id, from_address, to_address, amount) {    
    var url = config.backend_url + "/buy_token/" + id + "/" + from_address + "/" + to_address + "/" + amount;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function buy_erc1155_token(id, from_address, to_address, amount) {    
    var url = config.backend_url + "/buy_erc1155_token/" + id + "/" + from_address + "/" + to_address + "/" + amount;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function bid_request(id, address, asset_id, amount) {    
    var url = config.backend_url + "/bid_request/" + id + "/" + address + "/" + asset_id + "/" + amount;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function erc1155_bid_request(id, address, asset_id, amount) {    
    var url = config.backend_url + "/erc1155_bid_request/" + id + "/" + address + "/" + asset_id + "/" + amount;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function support_tokens() {    
    var url = config.backend_url + "/support_tokens";
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function accept_bid(id) {    
    var url = config.backend_url + "/accept_bid/" + id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function accept_erc1155_bid(id) {    
    var url = config.backend_url + "/accept_erc1155_bid/" + id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function cancel_bid(id, address) {    
    var url = config.backend_url + "/cancel_bid/" + id + "/" + address;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function cancel_erc1155_bid(id, address) {    
    var url = config.backend_url + "/cancel_erc1155_bid/" + id + "/" + address;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function stake_token(id) {    
    var url = config.backend_url + "/stake_token/" + id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function revoke_token(id) {    
    var url = config.backend_url + "/revoke_token/" + id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_total_bid_amount(address, asset_id) {    
    var url = config.backend_url + "/get_current_bid_amount/" + address + "/" + asset_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function remove_sale(id) {    
    var url = config.backend_url + "/cancel_sale/" + id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function remove_erc1155_sale(id) {    
    var url = config.backend_url + "/cancel_erc1155_sale/" + id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_my_bids(address) {    
    var url = config.backend_url + "/get_my_bid/" + address;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function add_like(address, contract_id, token_id) {    
    var url = config.backend_url + "/add_like/" + address + "/" + contract_id + "/" + token_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function remove_like(address, contract_id, token_id) {    
    var url = config.backend_url + "/remove_like/" + address + "/" + contract_id + "/" + token_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_likes(address) {    
    var url = config.backend_url + "/get_likes/" + address;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_profiles_with_addresses(addresses) {
    var query = "";
    addresses.forEach((address) => {
        query += "addresses=" + address + "&";
    })
    query = query.slice(0, query.length - 1);
    var url = config.backend_url + "/get_profile_with_addresses?" + query;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function is_like(address, contract_id, token_id) {    
    var url = config.backend_url + "/is_like/" + address + "/" + contract_id + "/" + token_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_tokens_with_owners(owners) {
    var query = "";
    owners.forEach((owner) => {
        query += "owners=" + owner + "&";
    })
    query = query.slice(0, query.length - 1);
    var url = config.backend_url + "/get_tokens_with_owners?" + query;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_followings(address) {    
    var url = config.backend_url + "/get_followings/" + address;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_followers(address) {    
    var url = config.backend_url + "/get_followers/" + address;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function add_follow(follower, following) {    
    var url = config.backend_url + "/add_follow/" + follower + "/" + following;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function remove_follow(follower, following) {    
    var url = config.backend_url + "/remove_follow/" + follower + "/" + following;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function is_following(follower, following) {    
    var url = config.backend_url + "/is_following/" + follower + "/" + following;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_my_activity(address, limit = 0, cnt = 10) {    
    var url = config.backend_url + "/get_my_activity/" + address + "/" + limit + "/" + cnt;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_all_activity(limit = 0, cnt = 10) {    
    var url = config.backend_url + "/get_all_activity/" + limit + "/" + cnt;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_activity_with_followings(followings, limit = 0, cnt = 10) {
    var query = "";
    followings.forEach((following) => {
        query += "followings=" + following + "&";
    })
    query = query.slice(0, query.length - 1);
    var url = config.backend_url + "/get_activity_with_followings/" + limit + "/" + cnt + "?" + query;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function activity_read(id, side) {    
    var url = config.backend_url + "/activity_read/" + id + "/" + side;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function activity_all_read(address) {    
    var url = config.backend_url + "/activity_all_read/" + address;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_most_like_tokens(cnt, chain_id = 0, collection = 0) {    
    var url = config.backend_url + "/get_most_like_tokens/" + cnt + "/" + collection + "/" + chain_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_last_tokens(cnt, chain_id = 0, collection = 0) {
    var url = config.backend_url + "/get_last_tokens/" + cnt + "/" + collection + "/" + chain_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_last_creators(cnt) {
    var url = config.backend_url + "/get_last_creators/" + cnt;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_top_sellers(cnt, timestamp) {
    var url = config.backend_url + "/get_top_sellers/" + cnt + "/" + timestamp;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_hot_bid(cnt) {
    var url = config.backend_url + "/get_hot_bid/" + cnt;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function search(filter, keyword, chain_id) {
    var url = config.backend_url + "/search/" + filter + "/" + keyword + "/" + chain_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_fee_distribution(contract_address) {
    var url = config.backend_url + "/get_fee_distribution/" + contract_address;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_erc1155_fee_distribution(contract_address, token_id) {
    var url = config.backend_url + "/get_erc1155_fee_distribution/" + contract_address + "/" + token_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function set_fee_distribution(contract_address, distributions) {
    var url = config.backend_url + "/add_fee_distribution/" + contract_address + "/" + JSON.stringify(distributions);
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function set_erc1155_fee_distribution(contract_address, token_id, distributions) {
    var url = config.backend_url + "/add_erc1155_fee_distribution/" + contract_address + "/" + token_id + "/" + JSON.stringify(distributions);
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function burn_token(id) {
    var url = config.backend_url + "/burn_token/" + id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function burn_erc1155_token(id, cnt) {
    var url = config.backend_url + "/burn_erc1155_token/" + id + "/" + cnt;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function add_erc1155_token(token, metadata, chain_id) {
    var url = config.backend_url + "/mint_erc1155_token/" + token.deployer + "/" + token.name + "/" 
        + token.description + "/" + token.fee_percentage + "/" + token.contract_address + "/" + token.token_id + "/" + token.collection + "/" + token.copies + "/" + base64.encode(utf8.encode(JSON.stringify(metadata))) + "/" + chain_id;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function subscribe(email_address) {
    var url = config.backend_url + "/subscribe/" + email_address;

    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_tick(symbol) {
    var url = config.tick_url + symbol;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function get_all_tick() {
    var url = config.tick_all_url;
    
    return new Promise((resolve, reject) => {
        http_com(url)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            throw err;
        })
    });
}

function http_com(url) {
    const axios = require('axios');

    return new Promise((resolve, reject) => {
        axios.get(url)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            throw error;
        });
    });
}

export {
    get_profile,
    update_profile,
    add_token,
    mint_token,
    get_token_owned,
    get_token_created,
    get_token_info,
    transfer_token,
    sell_token,
    buy_token,
    bid_request,
    support_tokens,
    cancel_bid,
    accept_bid,
    stake_token,
    revoke_token,
    get_total_bid_amount,
    remove_sale,
    get_my_bids,
    add_like,
    remove_like,
    get_likes,
    get_profiles_with_addresses,
    is_like,
    get_tokens_with_owners,
    get_followers,
    get_followings,
    add_follow,
    remove_follow,
    is_following,
    get_tick,
    get_my_activity,
    get_all_activity,
    get_activity_with_followings,
    activity_read,
    activity_all_read,
    get_most_like_tokens,
    get_last_creators,
    get_last_tokens,
    get_hot_bid,
    get_top_sellers,
    search,
    get_fee_distribution,
    set_fee_distribution,
    burn_token,
    add_erc1155_token,
    set_erc1155_fee_distribution,
    transfer_erc1155_token,
    get_erc1155_fee_distribution,
    sell_erc1155_token,
    buy_erc1155_token,
    remove_erc1155_sale,
    erc1155_bid_request,
    cancel_erc1155_bid,
    accept_erc1155_bid,
    burn_erc1155_token,
    get_all_tick,
    subscribe
}