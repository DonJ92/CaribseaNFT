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

import activity_01 from '../img/activity/activity-01.png';
import config from '../globals/config';
import { withTranslation } from 'react-i18next';

class Activity extends React.Component {
    constructor(props) {
        super(props);

        var script = document.createElement('script');
        script.src = './js/page/activity.js';
        script.async = true;
        document.body.appendChild(script);

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

    getAccount() {
        const web3 = new Web3(Web3.givenProvider);
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
                                        <label for="chk-01">Sales</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-02" type="checkbox"/>
                                        <label for="chk-02">Listings</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-03" type="checkbox"/>
                                        <label for="chk-03">Bids</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-04" type="checkbox" checked/>
                                        <label for="chk-04">Burns</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-05" type="checkbox"/>
                                        <label for="chk-05">Following</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-06" type="checkbox"/>
                                        <label for="chk-06">Likes</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-07" type="checkbox"/>
                                        <label for="chk-07">Purchase</label>
                                    </div>

                                    <div className="checkbox-wrapper">
                                        <input id="chk-08" type="checkbox" checked/>
                                        <label for="chk-08">Transfers</label>
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
                                                    title = "Mint";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Mint " + item.token_name + " #" + item.token_id + " token.";
                                                    } else {
                                                        description = "Mint " + item.token_name + " " + item.token_cnt + " token(s).";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.TRANSFER:
                                                    title = "Transfer";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.from_address == this.state.address) {
                                                            description = "Transferred " + item.token_name + " #" + item.token_id + " token to " + item.to_name;
                                                        } else {
                                                            description = "Transferred " + item.token_name + " #" + item.token_id + " token from " + item.from_name;
                                                        }
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        if (item.from_address == this.state.address) {
                                                            description = "Transferred " + item.token_name + " " + item.token_cnt + " token(s) to " + item.to_name;
                                                        } else {
                                                            description = "Transferred " + item.token_name + " " + item.token_cnt + " token(s) from " + item.from_name;
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_FIXED_SIZE:
                                                    title = "List for sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Listed " + item.token_name + " #" + item.token_id + " token for sale as " + item.amount + " BNB."
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Listed " + item.token_name + " " + item.token_cnt + " token(s) for sale as " + item.amount + " BNB."
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_AUCTION:
                                                    title = "List for sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Listed " + item.token_name + " #" + item.token_id + " token for sale with minimum price as " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Listed " + item.token_name + " " + item.token_cnt + " token(s) for sale with minimum price as " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNLIST:
                                                    title = "Remove from sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Removed " + item.token_name + " #" + item.token_id + " token from sale.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Removed " + item.token_name + " " + item.token_cnt + " token(s) from sale.";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BID:
                                                    title = "BID";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "BID " + item.token_name + " #" + item.token_id + " token with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "BID " + item.token_name + " " + item.token_cnt + " token(s) with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.EXCHANGE:
                                                    title = "Exchange";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Exchanged " + item.token_name + " #" + item.token_id + " token from the auction with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Exchanged " + item.token_name + " " + item.token_id + " token(s) from the auction with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BUY:
                                                    title = "BUY";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = item.to_name + " bought " + item.token_name + " #" + item.token_id + " token with " + item.amount + " BNB.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = item.to_name + " bought " + item.token_name + " " + item.token_cnt + " token(s) with " + item.amount + " BNB.";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.SELF_CANCEL:
                                                    title = "Cancel bid";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Cancelled your bid of " + item.token_name + " #" + item.token_id + " token.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Cancelled your bid of " + item.token_name + " " + item.token_cnt + " token(s).";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.CANCEL:
                                                    title = "Acution end";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "The auction of " + item.token_name + " #" + item.token_id + " token ended";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "The auction of " + item.token_name + " " + item.token_cnt + " token(s) ended";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.FOLLOW:
                                                    title = "Follow";
                                                    if (item.from_address == this.state.address) {
                                                        description = "Started to folllow " + item.to_name;
                                                        img_src = config.avatar_url + item.to_address + ".png";
                                                    } else {
                                                        description = "Following from " + item.from_name;
                                                        img_src = config.avatar_url + item.from_address + ".png";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNFOLLOW:
                                                    title = "Unfollow";
                                                    if (item.from_address == this.state.address) {
                                                        description = "Unfollowed " + item.to_name;
                                                        img_src = config.avatar_url + item.to_address + ".png";
                                                    } else {
                                                        description = item.from_name + " unfollowed " + item.from_name;
                                                        img_src = config.avatar_url + item.from_address + ".png";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.STAKE:
                                                    title = "Stake";
                                                    description = "Staked " + item.token_name + " #" + item.token_id + " token.";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.REVOKE:
                                                    title = "Revoke";
                                                    description = "Revoked " + item.token_name + " #" + item.token_id + " token.";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BURN:
                                                    title = "Burn";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description  = "Burned " + item.token_name + " #" + item.token_id + " token.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description  = "Burned " + item.token_name + " " + item.token_cnt + " token(s).";
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
                                                    title = "Mint";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Mint " + item.token_name + " #" + item.token_id + " token by " + item.from_name;
                                                    } else {
                                                        description = "Mint " + item.token_name + " " + item.token_cnt + " token(s) by " + item.from_name;
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.TRANSFER:
                                                    title = "Transfer";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Transferred " + item.token_name +" #" + item.token_id + " token from " + item.from_name + " to " + item.to_name;
                                                    } else {
                                                        description = "Transferred " + item.token_name +" " + item.token_cnt + " token(s) from " + item.from_name + " to " + item.to_name;
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_FIXED_SIZE:
                                                    title = "List for sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Listed " + item.token_name + " #" + item.token_id + " token for sale as " + item.amount + " BNB by " + item.from_name + ".";
                                                    } else {
                                                        description = "Listed " + item.token_name + " " + item.token_cnt + " token(s) for sale as " + item.amount + " BNB by " + item.from_name + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_AUCTION:
                                                    title = "List for sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Listed " + item.token_name + " #" + item.token_id + " token for sale with minimum price as " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Listed " + item.token_name + " " + item.token_cnt + " token(s) for sale with minimum price as " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    }
                                                    
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNLIST:
                                                    title = "Remove from sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Removed " + item.token_name + " #" + item.token_id + " token from sale by " + item.from_name + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Removed " + item.token_name + " " + item.token_cnt + " token(s) from sale by " + item.from_name + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BID:
                                                    title = "BID";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "BID " + item.token_name + " #" + item.token_id + " token with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "BID " + item.token_name + " " + item.token_cnt + " token(s) with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.EXCHANGE:
                                                    title = "Exchange";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Exchanged " + item.token_name + " #" + item.token_id + " token from the auction with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Exchanged " + item.token_name + " " + item.token_cnt + " token(s) from the auction with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BUY:
                                                    title = "BUY";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = item.to_name + " bought " + item.token_name + " #" + item.token_id + " token with " + item.amount + " BNB.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = item.to_name + " bought " + item.token_name + " " + item.token_cnt + " token(s) with " + item.amount + " BNB.";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.SELF_CANCEL:
                                                    title = "Cancel bid";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = item.from_name + " cancelled your bid of " + item.token_name + " #" + item.token_id + " token.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = item.from_name + " cancelled your bid of " + item.token_name + " " + item.token_cnt + " token(s).";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.CANCEL:
                                                    title = "Acution end";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "The auction of " + item.token_name + " #" + item.token_id + " token ended";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "The auction of " + item.token_name + " " + item.token_cnt + " token(s) ended";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.FOLLOW:
                                                    title = "Follow";
                                                    description = item.from_name + " started to folllow " + item.to_name;
                                                    img_src = config.avatar_url + item.to_address + ".png";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNFOLLOW:
                                                    title = "Unfollow";
                                                    description = item.from_name + " unfollowed " + item.to_name;
                                                    img_src = config.avatar_url + item.to_address + ".png";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.STAKE:
                                                    title = "Stake";
                                                    description = "Staked " + item.token_name + " " + item.token_id + " token by " + item.from_name + ".";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.REVOKE:
                                                    title = "Revoke";
                                                    description = "Revoked " + item.token_name + " " + item.token_id + " token by " + item.from_name + ".";
                                                    break;
                                                case ACTIVITY_TYPE.BURN:
                                                    title = "Burn";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description  = "Burned " + item.token_name + " #" + item.token_id + " token by " + item.from_name + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description  = "Burned " + item.token_name + " " + item.token_cnt + " token(s) by " + item.from_name + ".";
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
                                                    title = "Mint";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Mint " + item.token_name + " #" + item.token_id + " token by " + item.from_name;
                                                    } else {
                                                        description = "Mint " + item.token_name + " " + item.token_cnt + " token(s) by " + item.from_name;
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.TRANSFER:
                                                    title = "Transfer";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Transferred " + item.token_name +" #" + item.token_id + " token from " + item.from_name + " to " + item.to_name;
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Transferred " + item.token_name +" " + item.token_cnt + " token(s) from " + item.from_name + " to " + item.to_name;
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_FIXED_SIZE:
                                                    title = "List for sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Listed " + item.token_name + " #" + item.token_id + " token for sale as " + item.amount + " BNB by " + item.from_name + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Listed " + item.token_name + " " + item.token_cnt + " token(s) for sale as " + item.amount + " BNB by " + item.from_name + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_AUCTION:
                                                    title = "List for sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Listed " + item.token_name + " #" + item.token_id + " token for sale with minimum price as " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Listed " + item.token_name + " " + item.token_cnt + " token(s) for sale with minimum price as " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNLIST:
                                                    title = "Remove from sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Removed " + item.token_name + " #" + item.token_id + " token from sale by " + item.from_name + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Removed " + item.token_name + " " + item.token_cnt + " token(s) from sale by " + item.from_name + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BID:
                                                    title = "BID";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "BID " + item.token_name + " #" + item.token_id + " token with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "BID " + item.token_name + " " + item.token_cnt + " token(s) with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.EXCHANGE:
                                                    title = "Exchange";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Exchanged " + item.token_name + " #" + item.token_id + " token from the auction with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Exchanged " + item.token_name + " " + item.token_cnt + " token(s) from the auction with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + " by " + item.from_name + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BUY:
                                                    title = "BUY";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = item.to_name + " bought " + item.token_name + " #" + item.token_id + " token with " + item.amount + " BNB.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = item.to_name + " bought " + item.token_name + " " + item.token_cnt + " token(s) with " + item.amount + " BNB.";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.SELF_CANCEL:
                                                    title = "Cancel bid";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = item.from_name + " cancelled your bid of " + item.token_name + " #" + item.token_id + " token.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = item.from_name + " cancelled your bid of " + item.token_name + " " + item.token_cnt + " token(s).";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.CANCEL:
                                                    title = "Acution end";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "The auction of " + item.token_name + " #" + item.token_id + " token ended by " + item.from_name;
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "The auction of " + item.token_name + " " + item.token_cnt + " token(s) ended by " + item.from_name;
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.FOLLOW:
                                                    title = "Follow";
                                                    description = item.from_name + " started to folllow " + item.to_name;
                                                    img_src = config.avatar_url + item.to_address + ".png";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNFOLLOW:
                                                    title = "Unfollow";
                                                    description = item.from_name + " unfollowed " + item.to_name;
                                                    img_src = config.avatar_url + item.to_address + ".png";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.STAKE:
                                                    title = "Stake";
                                                    description = "Staked " + item.token_name + " " + item.token_id + " token by " + item.from_name + ".";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.REVOKE:
                                                    title = "Revoke";
                                                    description = "Revoked " + item.token_name + " " + item.token_id + " token by " + item.from_name + ".";
                                                    break;
                                                case ACTIVITY_TYPE.BURN:
                                                    title = "Burn";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description  = "Burned " + item.token_name + " #" + item.token_id + " token by " + item.from_name + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description  = "Burned " + item.token_name + " " + item.token_cnt + " token(s) by " + item.from_name + ".";
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

                                {/* <div className="act-load-more">
                                    <span className="act-load-more-icon">
                                        <i className="fas fa-spinner"></i>
                                    </span>
                                </div> */}
                                {/* <a id="btn-load-more" className="btn btn-h40 btn-fs-14" href="#"><span className="txt">Make all as read</span></a>    */}
                            </div>
                        </main>
                    </div>
                </div>

                <div id="loading-popup" className="popup">
                    <div className="popup-box">
                        <div className="loading-popup-head">
                            <div className="loader"></div>
                            <p className="loading-popup-head-ttl">Please wait...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withTranslation()(Activity);