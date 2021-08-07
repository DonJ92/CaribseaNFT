import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {AddClass, ChangeClass} from '../js/common';
import Web3 from 'web3';
import * as API from '../adapter/api';
import $ from 'jquery';

import TimeUtil from '../common/time_util';
import CONST, { ACTIVITY_STATUS, ACTIVITY_TYPE } from '../globals/constants';
import AssetUtil from '../common/asset_util';
import provider_util from '../common/provider_util';

import activity_01 from '../img/activity/activity-01.png';
import config from '../globals/config';
import { withTranslation } from 'react-i18next';
import support_networks from '../globals/support_networks';

class Activity extends React.Component {
    constructor(props) {
        super(props);

        // var script = document.createElement('script');
        // script.src = './js/page/activity.js';
        // script.async = true;
        // document.body.appendChild(script);

        ChangeClass('activity');
        AddClass('has-popup');

        this.state = {
            my_activities: [],
            following_activities: [],
            all_activities: [],
            address: null,
            selected_tab: CONST.ACTIVITY_TAB.MY,
            show_loading: true
        };
    }

    componentDidMount() {
        this.showLoading();
        this.getAccount();
    }

    showLoading() {
        this.setState({
            show_loading: true
        });

        $("#loading-popup").fadeIn(100);
    }

    hideLoading() {
        this.setState({
            show_loading: false
        });

        $("#loading-popup").fadeOut(100);
    }

    async getAccount() {
        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);
        web3.eth.net.getId().then((res) => {
            this.setState({
                chainId: res
            });
        });

        web3.eth.getAccounts((error,result) => {
            if (error) {
                console.log(error);
            } else {
                if (result.length < 1) {
                    this.setState({
                        address: null
                    });
                } else {
                    this.setState({
                        address: result[0]
                    });

                    this.getMyActivity();
                    this.getAllActivity();
                    this.getFollowings();
                }
            }
        });
    }

    getMyActivity() {
        API.get_my_activity(this.state.address)
        .then((res) => {
            console.log(res);
            this.setState({
                my_activities: res.activities
            });

            this.hideLoading();
        })
    }

    getAllActivity() {
        API.get_all_activity()
        .then((res) => {
            console.log(res);
            this.setState({
                all_activities: res.activities
            });
        })
    }

    getFollowings() {
        API.get_followings(this.state.address)
        .then((res) => {
            if (res.result) {
                if (res.profiles.length == 0) {
                    this.setState({
                        following_activities: []
                    });
                    return;
                }

                var followings = [];
                res.profiles.forEach(profile => {
                    followings.push(profile.address);
                });

                API.get_activity_with_followings(followings)
                .then((res) => {
                    console.log(res);
                    this.setState({
                        following_activities: res.activities
                    });
                })
            }
        })
    }

    onLoadMore() {
        this.showLoading();
        if (this.state.selected_tab == CONST.ACTIVITY_TAB.MY) {
            API.get_my_activity(this.state.address, this.state.my_activities.length, 10)
            .then((res) => {
                this.hideLoading();
                if (res.result) {
                    this.setState({
                        my_activities: this.state.my_activities.concat(res.activities)
                    });
                }
            })
        } else if (this.state.selected_tab == CONST.ACTIVITY_TAB.FOLLOWINGS) {
            API.get_followings(this.state.address)
            .then((res) => {
                if (res.result) {
                    if (res.profiles.length == 0) {
                        this.setState({
                            following_activities: []
                        });
                        this.hideLoading();
                        return;
                    }
    
                    var followings = [];
                    res.profiles.forEach(profile => {
                        followings.push(profile.address);
                    });
    
                    API.get_activity_with_followings(followings, this.state.following_activities.length, 10)
                    .then((res) => {
                        this.hideLoading();
                        if (res.result) {
                            this.setState({
                                following_activities: this.state.following_activities.concat(res.activities)
                            });
                        }
                    })
                }
            })
        } else if (this.state.selected_tab == CONST.ACTIVITY_TAB.ALL) {
            API.get_all_activity()
            .then((res) => {
                this.hideLoading();
                if (res.result) {
                    this.setState({
                        all_activities: this.state.all_activities.concat(res.activities)
                    });
                }
            })
        }
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    handleMyActivity(item) {
        var side = CONST.ACTIVITY_SIDE.FROM;
        if (item.from_address == this.state.address) {
            side = CONST.ACTIVITY_SIDE.FROM;
        } else {
            side = CONST.ACTIVITY_SIDE.TO;
        }

        var my_activities = this.state.my_activities;
        for (var i = 0; i < my_activities.length; i++) {
            if (my_activities[i].id == item.id) {
                if (side == CONST.ACTIVITY_SIDE.FROM) {
                    my_activities[i].from_status = CONST.ACTIVITY_STATUS.READ;
                } else {
                    my_activities[i].to_status = CONST.ACTIVITY_STATUS.READ;
                }

                this.setState({
                    my_activities: my_activities
                });
            }
        }

        API.activity_read(item.id, side)
        .then((res) => {
            console.log(res);
        })
    }

    handleTab(tab) {
        this.setState({
            selected_tab: tab
        });
    }

    handleAllRead() {
        API.activity_all_read(this.state.address)
        .then((res) => {
            document.location.reload();
        })
    }

    render() {
        const { t } = this.props;

        var style_hidden = {display: 'none'};
        return (
            <section id="activity" className="activity">
                <div className="content">
                    <div className="activity-inner">
                        <aside>
                            <div id="filters" className="filters">
                                <p className="filters-ttl">Filters</p>
                                <div className="filters-list">
                                    <div className="checkbox-wrapper">
                                        <input id="chk-01" type="checkbox" checked/>
                                        <label htmlFor="chk-01">Sales</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-02" type="checkbox"/>
                                        <label htmlFor="chk-02">Listings</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-03" type="checkbox"/>
                                        <label htmlFor="chk-03">Bids</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-04" type="checkbox" checked/>
                                        <label htmlFor="chk-04">Burns</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-05" type="checkbox"/>
                                        <label htmlFor="chk-05">Following</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-06" type="checkbox"/>
                                        <label htmlFor="chk-06">Likes</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-07" type="checkbox"/>
                                        <label htmlFor="chk-07">Purchase</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-08" type="checkbox" checked/>
                                        <label htmlFor="chk-08">Transfers</label>
                                    </div>
                                </div>
                                <div className="btn-group">
                                    <a id="btn-filter-all-select" className="btn btn-h32 btn-fs-14" href="#"><span className="txt">Select all</span></a>
                                    <a id="btn-filter-all-unselect" className="btn btn-h32 btn-fs-14" href="#"><span className="txt">Unselect all</span></a>
                                </div>
                            </div>
                        </aside>

                        <main>
                            <div className="act-head">
                                <h2 className="act-head-ttl">
                                    {t('Activity')}
                                    <div id="btn-show-filter"><i className="fas fa-filter"></i></div>
                                    <div id="btn-hide-filter"><i className="fas fa-times"></i></div>
                                </h2>
                                <a id="btn-make-all-as-read" className="btn btn-h40 btn-fs-14" onClick={() => this.handleAllRead()}><span className="txt">{t('Make all as read')}</span></a>                                                        
                            </div>

                            <div className="act-body">
                                <div className="act-tags tags-list">
                                    <a className={this.state.selected_tab == CONST.ACTIVITY_TAB.MY? "active": ""} onClick={() => this.handleTab(CONST.ACTIVITY_TAB.MY)}>{t('My activity')}</a>
                                    <a className={this.state.selected_tab == CONST.ACTIVITY_TAB.FOLLOWINGS? "active": ""} onClick={() => this.handleTab(CONST.ACTIVITY_TAB.FOLLOWINGS)}>{t('Following')}</a>
                                    <a className={this.state.selected_tab == CONST.ACTIVITY_TAB.ALL? "active": ""} onClick={() => this.handleTab(CONST.ACTIVITY_TAB.ALL)}>{t('All activity')}</a>
                                </div>

                                <div className="act-list" style={this.state.selected_tab == CONST.ACTIVITY_TAB.MY? {}: style_hidden}>
                                    {
                                        this.state.my_activities.map((item, index) => {
                                            var title = "";
                                            var description = "";
                                            var img_src = "";
                                            if (item.metadata != null) {
                                                img_src = JSON.parse(item.metadata).url;
                                            }

                                            switch(item.activity_type) {
                                                case CONST.ACTIVITY_TYPE.MINT:
                                                    title = t("Mint");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Mint ERC721 Token', {token_name: item.token_name, token_id: item.token_id});
                                                    } else {
                                                        description = t('Mint ERC1155 Token', {token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.TRANSFER:
                                                    title = t("Transfer");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.from_address == this.state.address) {
                                                            description = t('Transferred ERC721 Token to', {token_name: item.token_name, token_id: item.token_id, name: item.to_name});
                                                        } else {
                                                            description = t('Transferred ERC721 Token from', {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                        }
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        if (item.from_address == this.state.address) {
                                                            description = t('Transferred ERC1155 Token to', {token_name: item.token_name, token_cnt: item.token_cnt, name: item.to_name});
                                                        } else {
                                                            description = t('Transferred ERC1155 Token from', {token_name: item.token_name, token_cnt: item.token_cnt, name: item.from_name});
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_FIXED_SIZE:
                                                    title = t("List for sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t('Listed ERC721 fixed price ETH', {token_name: item.token_name, token_id: item.token_id, amount: item.amount});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t('Listed ERC721 fixed price BNB', {token_name: item.token_name, token_id: item.token_id, amount: item.amount});
                                                        }
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t('Listed ERC1155 fixed price ETH', {token_name: item.token_name, token_id: item.token_cnt, amount: item.amount});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t('Listed ERC1155 fixed price BNB', {token_name: item.token_name, token_id: item.token_cnt, amount: item.amount});
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_AUCTION:
                                                    title = t("List for sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Listed ERC721 auction', {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('Listed ERC1155 auction', {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNLIST:
                                                    title = t("Remove from sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Removed ERC721 from sell', {token_name: item.token_name, token_id: item.token_id});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('Removed ERC1155 from sell', {token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BID:
                                                    title = t("BID");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('BID ERC721', {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('BID ERC1155', {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.EXCHANGE:
                                                    title = t("Exchange");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Exchanged ERC721', {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('Exchanged ERC1155', {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BUY:
                                                    title = t("BUY");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.from_address == this.state.address) {
                                                            if (item.chain_id == support_networks.ETHEREUM) {
                                                                description = t('Sold ERC721 token', {token_name: item.token_name, token_id: item.token_id, opponent: item.to_name, amount: item.amount, asset: 'ETH'});
                                                            } else if (item.chain_id == support_networks.BSC) {
                                                                description = t('Sold ERC721 token', {token_name: item.token_name, token_id: item.token_id, opponent: item.to_name, amount: item.amount, asset: 'BNB'});
                                                            }
                                                        } else {
                                                            if (item.chain_id == support_networks.ETHEREUM) {
                                                                description = t('Bought ERC721 token', {token_name: item.token_name, token_id: item.token_id, opponent: item.from_name, amount: item.amount, asset: 'ETH'});
                                                            } else if (item.chain_id == support_networks.BSC) {
                                                                description = t('Bought ERC721 token', {token_name: item.token_name, token_id: item.token_id, opponent: item.from_name, amount: item.amount, asset: 'BNB'});
                                                            }
                                                        }
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        if (item.from_address == this.state.address) {
                                                            if (item.chain_id == support_networks.ETHEREUM) {
                                                                description = t('Sold ERC1155 token', {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.to_name, amount: item.amount, asset: 'ETH'});
                                                            } else if (item.chain_id == support_networks.BSC) {
                                                                description = t('Sold ERC1155 token', {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.to_name, amount: item.amount, asset: 'BNB'});
                                                            }
                                                        } else {
                                                            if (item.chain_id == support_networks.ETHEREUM) {
                                                                description = t('Bought ERC1155 token', {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.from_name, amount: item.amount, asset: 'ETH'});
                                                            } else if (item.chain_id == support_networks.BSC) {
                                                                description = t('Bought ERC1155 token', {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.from_name, amount: item.amount, asset: 'BNB'});
                                                            }
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.SELF_CANCEL:
                                                    title = t("Cancel bid");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Cancelled your bid of ERC721', {token_name: item.token_name, token_id: item.token_id});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('Cancelled your bid of ERC1155', {token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.CANCEL:
                                                    title = t("Auction end");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Auction ended ERC721", {token_name: item.token_name, token_id: item.token_id});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Auction ended ERC1155", {token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.FOLLOW:
                                                    title = t("Follow");
                                                    if (item.from_address == this.state.address) {
                                                        description = t("Started to follow", {name: item.to_name});
                                                        img_src = config.avatar_url + item.to_address + ".png";
                                                    } else {
                                                        description = t("Followed from", {name: item.from_name});
                                                        img_src = config.avatar_url + item.from_address + ".png";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNFOLLOW:
                                                    title = t("Unfollow");
                                                    if (item.from_address == this.state.address) {
                                                        description = t("Unfollowed from me", {name: item.to_name});
                                                        img_src = config.avatar_url + item.to_address + ".png";
                                                    } else {
                                                        description = t("Unfollowed to me", {name: item.from_name});
                                                        img_src = config.avatar_url + item.from_address + ".png";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.STAKE:
                                                    title = t("Stake");
                                                    description = t("Staked", {token_name: item.token_name, token_id: item.token_id});
                                                    break;
                                                case CONST.ACTIVITY_TYPE.REVOKE:
                                                    title = t("Revoke");
                                                    description = t("Revoked", {token_name: item.token_name, token_id: item.token_id});
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BURN:
                                                    title = t("Burn");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Burned ERC721', {token_name: item.token_name, token_id: item.token_id});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('Burned ERC1155', {token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                            }

                                            return (
                                                <a className="act-item" onClick={() => this.handleMyActivity(item)}>
                                                    <div className="act-item-figure">
                                                        <div className="act-item-figure-wrapper">
                                                            <img src={img_src} onError={this.onAvatarError} alt="" />
                                                        </div>
                                                        <span className="mark red" style={(item.from_address == this.state.address && item.from_status == CONST.ACTIVITY_STATUS.NOT_READ) || (this.state.address == item.to_address && item.to_status == CONST.ACTIVITY_STATUS.NOT_READ)? {}: style_hidden}><i className="far fa-flag"></i></span>
                                                    </div>
                                                    <div className="act-item-infos">
                                                        <p className="act-item-ttl">{title}</p>
                                                        <p className="act-item-txt">{description}</p>
                                                        <p className="act-item-date">{TimeUtil.format_datetime(item.created_at)}</p>
                                                    </div>
                                                </a>
                                            )
                                            
                                        })
                                    }
                                </div>

                                <div className="act-list" style={this.state.selected_tab == CONST.ACTIVITY_TAB.FOLLOWINGS? {}: style_hidden}>
                                    {
                                        this.state.following_activities.map((item, index) => {
                                            var title = "";
                                            var description = "";
                                            var img_src = "";
                                            if (item.metadata != null) {
                                                img_src = JSON.parse(item.metadata).url;
                                            }

                                            switch(item.activity_type) {
                                                case CONST.ACTIVITY_TYPE.MINT:
                                                    title = t("Mint");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Mint ERC721 by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    } else {
                                                        description = t("Mint ERC1155 by", {token_name: item.token_name, token_cnt: item.token_cnt, name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.TRANSFER:
                                                    title = t("Transfer");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Transferred ERC721 Token from to", {token_name: item.token_name, token_id: item.token_id, from: item.from_name, to: item.to_name});
                                                    } else {
                                                        description = t("Transferred ERC1155 Token from to", {token_name: item.token_name, token_cnt: item.token_cnt, from: item.from_name, to: item.to_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_FIXED_SIZE:
                                                    title = t("List for sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t("Listed ERC721 fixed price by", {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: 'ETH', name: item.from_name});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t("Listed ERC721 fixed price by", {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: 'BNB', name: item.from_name});
                                                        }
                                                    } else {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t("Listed ERC1155 fixed price by", {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: 'ETH', name: item.from_name});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t("Listed ERC1155 fixed price by", {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: 'BNB', name: item.from_name});
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_AUCTION:
                                                    title = t("List for sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Listed ERC721 auction by", {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Listed ERC1155 auction by", {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNLIST:
                                                    title = t("Remove from sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Removed ERC721 from sell by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Removed ERC1155 from sell by", {token_name: item.token_name, token_cnt: item.token_cnt, name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BID:
                                                    title = t("BID");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("BID ERC721 by", {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("BID ERC1155 by", {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.EXCHANGE:
                                                    title = t("Exchange");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Exchanged ERC721 by", {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Exchanged ERC1155 by", {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BUY:
                                                    title = t("BUY");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t("Bought ERC721 token by", {token_name: item.token_name, token_id: item.token_id, opponent: item.to_name, amount: item.amount, asset: "ETH"});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t("Bought ERC721 token by", {token_name: item.token_name, token_id: item.token_id, opponent: item.to_name, amount: item.amount, asset: "BNB"});
                                                        }
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t("Bought ERC1155 token by", {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.to_name, amount: item.amount, asset: "ETH"});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t("Bought ERC1155 token by", {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.to_name, amount: item.amount, asset: "BNB"});
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.SELF_CANCEL:
                                                    title = t("Cancel bid");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Cancelled bid of ERC721 by", {name: item.from_name, token_name: item.token_name, token_id: item.token_id});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Cancelled bid of ERC1155 by", {name: item.from_name, token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.CANCEL:
                                                    title = t("Auction end");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Auction ended ERC721 by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Auction ended ERC1155 by", {token_name: item.token_name, token_cnt: item.token_cnt, name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.FOLLOW:
                                                    title = t("Follow");
                                                    description = t("Followed from to", {from: item.from_name, to: item.to_name});
                                                    img_src = config.avatar_url + item.to_address + ".png";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNFOLLOW:
                                                    title = t("Unfollow");
                                                    description = t("Unfollowed from to", {from: item.from_name, to: item.to_name});
                                                    img_src = config.avatar_url + item.to_address + ".png";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.STAKE:
                                                    title = t("Stake");
                                                    description = t("Staked by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    break;
                                                case CONST.ACTIVITY_TYPE.REVOKE:
                                                    title = t("Revoke");
                                                    description = t("Revoked by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    break;
                                                case ACTIVITY_TYPE.BURN:
                                                    title = t("Burn");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Burned ERC721 by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Burned ERC1155 by", {token_name: item.token_name, token_cnt: item.token_cnt, name: item.from_name});
                                                    }
                                                    break;
                                            }

                                            return (
                                                <a className="act-item" onClick={() => this.handleMyActivity(item)}>
                                                    <div className="act-item-figure">
                                                        <div className="act-item-figure-wrapper">
                                                            <img src={img_src} onError={this.onAvatarError} alt="" />
                                                        </div>
                                                        {/* <span className="mark red" style={(item.from_address == this.state.address && item.from_status == CONST.ACTIVITY_STATUS.NOT_READ) || (this.state.address == item.to_address && item.to_status == CONST.ACTIVITY_STATUS.NOT_READ)? {}: style_hidden}><i className="far fa-flag"></i></span> */}
                                                    </div>
                                                    <div className="act-item-infos">
                                                        <p className="act-item-ttl">{title}</p>
                                                        <p className="act-item-txt">{description}</p>
                                                        <p className="act-item-date">{TimeUtil.format_datetime(item.created_at)}</p>
                                                    </div>
                                                </a>
                                            )
                                            
                                        })
                                    }
                                </div>

                                <div className="act-list" style={this.state.selected_tab == CONST.ACTIVITY_TAB.ALL? {}: style_hidden}>
                                    {
                                        this.state.all_activities.map((item, index) => {
                                            var title = "";
                                            var description = "";
                                            var img_src = "";
                                            if (item.metadata != null) {
                                                img_src = JSON.parse(item.metadata).url;
                                            }

                                            switch(item.activity_type) {
                                                case CONST.ACTIVITY_TYPE.MINT:
                                                    title = t("Mint");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Mint ERC721 by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    } else {
                                                        description = t("Mint ERC1155 by", {token_name: item.token_name, token_cnt: item.token_cnt, name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.TRANSFER:
                                                    title = t("Transfer");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Transferred ERC721 Token from to", {token_name: item.token_name, token_id: item.token_id, from: item.from_name, to: item.to_name});
                                                    } else {
                                                        description = t("Transferred ERC1155 Token from to", {token_name: item.token_name, token_cnt: item.token_cnt, from: item.from_name, to: item.to_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_FIXED_SIZE:
                                                    title = t("List for sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t("Listed ERC721 fixed price by", {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: 'ETH', name: item.from_name});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t("Listed ERC721 fixed price by", {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: 'BNB', name: item.from_name});
                                                        }
                                                    } else {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t("Listed ERC1155 fixed price by", {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: 'ETH', name: item.from_name});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t("Listed ERC1155 fixed price by", {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: 'BNB', name: item.from_name});
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_AUCTION:
                                                    title = t("List for sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Listed ERC721 auction by", {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Listed ERC1155 auction by", {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNLIST:
                                                    title = t("Remove from sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Removed ERC721 from sell by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Removed ERC1155 from sell by", {token_name: item.token_name, token_cnt: item.token_cnt, name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BID:
                                                    title = t("BID");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("BID ERC721 by", {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("BID ERC1155 by", {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.EXCHANGE:
                                                    title = t("Exchange");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Exchanged ERC721 by", {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Exchanged ERC1155 by", {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id), name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BUY:
                                                    title = t("BUY");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t("Bought ERC721 token by", {token_name: item.token_name, token_id: item.token_id, opponent: item.to_name, amount: item.amount, asset: "ETH"});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t("Bought ERC721 token by", {token_name: item.token_name, token_id: item.token_id, opponent: item.to_name, amount: item.amount, asset: "BNB"});
                                                        }
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t("Bought ERC1155 token by", {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.to_name, amount: item.amount, asset: "ETH"});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t("Bought ERC1155 token by", {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.to_name, amount: item.amount, asset: "BNB"});
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.SELF_CANCEL:
                                                    title = t("Cancel bid");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Cancelled bid of ERC721 by", {name: item.from_name, token_name: item.token_name, token_id: item.token_id});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Cancelled bid of ERC1155 by", {name: item.from_name, token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.CANCEL:
                                                    title = t("Auction end");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Auction ended ERC721 by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Auction ended ERC1155 by", {token_name: item.token_name, token_cnt: item.token_cnt, name: item.from_name});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.FOLLOW:
                                                    title = t("Follow");
                                                    description = t("Followed from to", {from: item.from_name, to: item.to_name});
                                                    img_src = config.avatar_url + item.to_address + ".png";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNFOLLOW:
                                                    title = t("Unfollow");
                                                    description = t("Unfollowed from to", {from: item.from_name, to: item.to_name});
                                                    img_src = config.avatar_url + item.to_address + ".png";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.STAKE:
                                                    title = t("Stake");
                                                    description = t("Staked by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    break;
                                                case CONST.ACTIVITY_TYPE.REVOKE:
                                                    title = t("Revoke");
                                                    description = t("Revoked by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    break;
                                                case ACTIVITY_TYPE.BURN:
                                                    title = t("Burn");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Burned ERC721 by", {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Burned ERC1155 by", {token_name: item.token_name, token_cnt: item.token_cnt, name: item.from_name});
                                                    }
                                                    break;
                                            }

                                            return (
                                                <a className="act-item" onClick={() => this.handleMyActivity(item)}>
                                                    <div className="act-item-figure">
                                                        <div className="act-item-figure-wrapper">
                                                            <img src={img_src} onError={this.onAvatarError} alt="" />
                                                        </div>
                                                        {/* <span className="mark red" style={(item.from_address == this.state.address && item.from_status == CONST.ACTIVITY_STATUS.NOT_READ) || (this.state.address == item.to_address && item.to_status == CONST.ACTIVITY_STATUS.NOT_READ)? {}: style_hidden}><i className="far fa-flag"></i></span> */}
                                                    </div>
                                                    <div className="act-item-infos">
                                                        <p className="act-item-ttl">{title}</p>
                                                        <p className="act-item-txt">{description}</p>
                                                        <p className="act-item-date">{TimeUtil.format_datetime(item.created_at)}</p>
                                                    </div>
                                                </a>
                                            )
                                            
                                        })
                                    }
                                </div>
                                <a id="btn-load-more" className="btn btn-h40 btn-fs-14 load-more" onClick={() => this.onLoadMore()} ><span className="txt">{t('Load More')}</span></a>   
                            </div>
                        </main>
                    </div>
                </div>

                <div id="loading-popup" className="popup">
                    <div className="popup-box">
                        <div className="loading-popup-head">
                            <div className="loader"></div>
                            <p className="loading-popup-head-ttl">{t('Please wait...')}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withTranslation()(Activity);