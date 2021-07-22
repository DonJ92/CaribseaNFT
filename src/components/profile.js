import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {AddClass, ChangeClass} from '../js/common';
import Web3 from 'web3';
import * as API from '../adapter/api';
import axios from 'axios';
import AssetUtil from '../common/asset_util';
import $ from 'jquery';

import CONST, { protocol_type } from '../globals/constants';

import ball from '../img/profile/ball.png';
import config from '../globals/config';
import { withTranslation } from 'react-i18next';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        ChangeClass('profile');
        AddClass('has-popup');

        this.state = {
            address : null,
            profile : null,
            selected_tab: CONST.profile_selected_tab.ON_SALE,
            owned_tokens: [],
            created_tokens: [],
            sale_tokens: [],
            likes_tokens: [],
            followings: [],
            followers: [],
            is_following: false,
            show_loading: true,
            my_profile: null
        };
    }

    componentDidMount() {
        this.showLoading();

        this.getAccounts();
        this.getTokenOwned();
        this.getTokenCreated();
        this.getTokenLikes();
        this.getFollowings();

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

                    API.get_profile(this.state.address)
                    .then((res) => {
                        if (res.result) {
                            this.setState({
                                my_profile: res.profile
                            });
                        }
                    })
                }
            }

            if (this.state.address != this.props.address) {
                API.is_following(this.state.address, this.props.address)
                .then((res) => {
                    this.setState({
                        is_following: res.result
                    });
                })
            }
        });
    }

    getAccounts() {
        API.get_profile(this.props.address)
        .then((res) => {
            if (res.result == true) {
                var profile = JSON.parse(res.profile);

                this.setState({
                    profile: profile
                });
            }
        });
    }

    handleFileSelect = (e) => {
        var input = document.getElementById('cover');
        input.click();
    }

    onFileChanged=event=>{
        var input = document.getElementById('cover');

        const formData = new FormData(); 
     
        // Update the formData object 
        formData.append( 
            "myFile", 
            event.target.files[0], 
            this.state.address + ".png"
        ); 
        
        // Request made to the backend api 
        // Send formData object 
        axios.post(config.backend_url + "/upload_cover", formData)
        .then((res) => {
            API.get_profile(this.state.address)
            .then((res) => {
                if (res.result == true) {
                    window.location = "/profile/" + this.state.address;
                }
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }

    handleSelectedTab(tab_index) {
        this.setState({
            selected_tab: tab_index
        });
        return;
    }

    getTokenOwned() {
        API.get_token_owned(this.props.address)
        .then((res) => {
            if (res.result == true) {
                this.setState({
                    owned_tokens: res.tokens
                });
                console.log(res);

                var sale_tokens = [];

                res.tokens.forEach(token => {
                    if (token.status == CONST.token_status.FIXED_PRICE || token.status == CONST.token_status.AUCTION) {
                        sale_tokens.push({
                            token: token,
                            bids: []
                        });
                    }
                });

                API.get_my_bids(this.props.address)
                .then((res) => {
                    if (res.result) {console.log(res);
                        res.bids.forEach((bid) => {
                            for (var i = 0; i < sale_tokens.length; i++) {
                                if (bid.token_contract_id == sale_tokens[i].token.token_contract_id && bid.token_id == sale_tokens[i].token.token_id) {
                                    sale_tokens[i].bids.push(bid);
                                    break;
                                }
                            }
                        })

                        for (var i = 0; i < sale_tokens.length; i++) {
                            sale_tokens[i].bids.sort(function(a,b) {
                                return b.amount - a.amount;
                            });
                        }

                        console.log(sale_tokens);
                        this.setState({
                            sale_tokens: sale_tokens
                        });

                        this.hideLoading();
                    }
                })
            }
        });
    }

    getTokenCreated() {
        API.get_token_created(this.props.address)
        .then((res) => {
            if (res.result == true) {
                this.setState({
                    created_tokens: res.tokens
                });
                console.log(res);
            }
        });
    }

    getTokenLikes() {
        API.get_likes(this.props.address)
        .then((res) => {console.log(res);
            if (res.result == true) {
                if (res.likes.length == 0) {
                    return;
                }

                var likesToken = res.likes;
                
                var owners = [];
                likesToken.forEach((token) => {
                    owners.push(token.owner);
                })
                
                API.get_profiles_with_addresses(owners)
                .then((res) => {
                    if (res.result) {
                        res.profiles.forEach((profile) => {
                            for (var i = 0; i < likesToken.length; i++) {
                                if (likesToken[i].owner == profile.address) {
                                    likesToken[i].name = profile.name;
                                }
                            }

                            this.setState({
                                likes_tokens: likesToken
                            });
                        })
                    }
                })
            }
        });
    }

    getFollowings() {
        API.get_followings(this.props.address)
        .then((res) => {
            if (res.result) {
                if (res.profiles.length == 0) {
                    this.setState({
                        followings: []
                    });
                    this.getFollowers();  
                    return;
                }

                var followings = res.profiles;
                var following_users = [];

                var owners = [];
                followings.forEach((item) => {
                    owners.push(item.address);
                    following_users.push({
                        following: item,
                        tokens: []
                    });
                })

                API.get_tokens_with_owners(owners)
                .then((res) => {
                    if (res.result) {
                        res.tokens.forEach((token) => {
                            for (var i = 0; i < following_users.length; i++) {
                                if (following_users[i].following.address == token.owner) {
                                    following_users[i].tokens.push(token);
                                    break;
                                }
                            }
                        });

                        this.setState({
                            followings: following_users
                        })

                        this.getFollowers();                        
                    }
                })
            }
        })
    }

    getFollowers() {
        API.get_followers(this.props.address)
        .then((res) => {
            if (res.result) {
                if (res.profiles.length == 0) {
                    this.setState({
                        followers: []
                    });
                    return;
                }

                var followers = res.profiles;
                var followers_users = [];

                var owners = [];
                followers.forEach((item) => {
                    owners.push(item.address);
                    followers_users.push({
                        follower: item,
                        tokens: []
                    });
                })

                API.get_tokens_with_owners(owners)
                .then((res) => {
                    if (res.result) {
                        res.tokens.forEach((token) => {
                            for (var i = 0; i < followers_users.length; i++) {
                                if (followers_users[i].follower.address == token.owner) {
                                    followers_users[i].tokens.push(token);
                                    break;
                                }
                            }
                        });

                        for (var i = 0; i < followers_users.length; i++) {
                            followers_users[i].follower.is_following = false;
                            for (var j = 0; j < this.state.followings.length; j++) {
                                if (followers_users[i].follower.address == this.state.followings[i].following.address) {
                                    followers_users[i].follower.is_following = true;
                                    break;
                                }
                            }
                        }

                        this.setState({
                            followers: followers_users
                        })
                    }
                })
            }
        })
    }

    redirectToItemDetail(contract_address, token_id) {
        document.location = "/item/" + contract_address + "/" + token_id;
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    handleFollow() {
        if (this.state.is_following) {
            API.remove_follow(this.state.address, this.props.address)
            .then((res) => {
                this.getFollowings();
            })

            this.setState({
                is_following: false
            });
        } else {
            API.add_follow(this.state.address, this.props.address)
            .then((res) => {
                this.getFollowings();
            });

            this.setState({
                is_following: true
            });
        }
    }

    handleFollowings(item) {
        var followings = this.state.followings;

        followings = followings.filter(function(value, index, arr) {
            return value.following.address != item.following.address
        })

        console.log(followings);

        this.setState({
            followings: followings
        });

        API.remove_follow(this.state.address, item.following.address)
        .then((res) => {
            this.getFollowers();
        })
    }

    handleFollowers(item) {
        var followers = this.state.followers;

        for (var i = 0; i < followers.length; i++) {
            if (followers[i].follower.address == item.follower.address) {
                followers[i].follower.is_following = !followers[i].follower.is_following;
                break;
            }
        }

        this.setState({
            followers: followers
        });

        if (item.follower.is_following) {
            API.add_follow(this.state.address, item.follower.address)
            .then((res) => {
                this.getFollowings();
            })
        } else {
            API.remove_follow(this.state.address, item.follower.address)
            .then((res) => {
                this.getFollowings();
            })
        }
    }

    componentDidUpdate() {
        var script = document.createElement('script');
        script.src = '../../js/page/profile.js';
        script.async = true;
        document.body.appendChild(script);
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
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

    render() {
        const { t } = this.props;

        var style_hidden = {display: 'none'};
        var style_none = {};

        return (
            <div className="profile">
                
                <section id="main-visual" className="main-visual" style={{background : "url('" + config.cover_url + (this.state.profile != null && this.state.profile.has_cover == 1? this.props.address: "default") + ".png')"}}>
                    <div className="content">
                        <div className="edit-row" style={this.state.address == this.props.address? style_none: style_hidden}>
                            <a className="btn btn-h40 btn-color-gray btn-fs-14 btn-mr16" onClick={this.handleFileSelect}>
                                <span className="txt">{t('Edit cover photo')}</span>
                                <span className="ico"><i className="far fa-image"></i></span>
                            </a>
                            <input id='cover' type='file' accept='image/png' style={{display: 'none'}} onChange={this.onFileChanged}/>
                            <a className="btn btn-h40 btn-color-gray btn-fs-14" href="/edit_profile">
                                <span className="txt">{t('Edit profile')}</span>
                                <span className="ico"><i className="fas fa-pencil-alt"></i></span>
                            </a>
                        </div>
                    </div>
                </section>

                <section id="profile" className="profile">
                    <div className="content">
                        <div className="profile-inner">
                            <div className="profile-head">
                                <div className="profile-head-box">
                                    <div className="profile-head-avatar">
                                        <img src={config.avatar_url + (this.state.profile == null || this.state.profile.has_avatar == false? "default": this.props.address) + ".png"} onError={this.onAvatarError} alt="" />
                                    </div>
                                    <h3 className="profile-name">{this.state.profile == null? '...': this.state.profile.name}</h3>
                                    <p className="profile-token">
                                        {this.props.address.slice(0,14) + '...' + this.props.address.slice(38,42)}
                                        <span><img src={ball} alt="" onClick={() => navigator.clipboard.writeText(window.ethereum.selectedAddress)}/></span>
                                    </p>
                                    <p className="profile-desc">
                                        {this.state.profile == null? '...': this.state.profile.description}
                                    </p>
                                    <a className="profile-site" href={this.state.profile == null? "#": this.state.profile.url}>
                                        <span><i className="fas fa-globe"></i></span>
                                        {this.state.profile == null || this.state.profile.url == ""? '...': this.state.profile.url}
                                    </a>
                                    <div className="profile-head-btn-row" style={this.state.my_profile == null || this.state.address == this.props.address? style_hidden: {}}>
                                        <a className="btn btn-h40 btn-blue btn-fs-14" onClick={() => this.handleFollow()} style={this.props.address != this.state.address && this.state.is_following == false? style_none: style_hidden}>
                                            <span className="txt">{t('Follow')}</span>
                                        </a>
                                        <a className="btn btn-h40 btn-fs-14" onClick={() => this.handleFollow()} style={this.props.address != this.state.address && this.state.is_following == true? style_none: style_hidden}>
                                            <span className="txt">{t('Unfollow')}</span>
                                        </a>
                                        {/* <a className="btn-circle" href="#">
                                            <span className="ico"><i className="fas fa-upload"></i></span>
                                        </a>
                                        <a className="btn-circle" href="#">
                                            <span className="ico"><i className="fas fa-ellipsis-h"></i></span>
                                        </a> */}
                                    </div>
                                    <div className="profile-sns">
                                        <a href={"https://twitter.com/" + (this.state.profile == null? "": this.state.profile.twitter_username)}><i className="fab fa-twitter"></i></a>
                                        <a href={"https://instagram.com/" + (this.state.profile == null? "": this.state.profile.instagram_username)}><i className="fab fa-instagram"></i></a>
                                        <a href={"https://facebook.com/" + (this.state.profile == null? "": this.state.profile.facebook_username)}><i className="fab fa-facebook"></i></a>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-body">
                                <div class="profile-tags-wrapper">
                                    <div className="profile-tags tags-list">
                                        <a id="tab_onsale" className={this.state.selected_tab == CONST.profile_selected_tab.ON_SALE? "active": ""} onClick={() => this.handleSelectedTab(CONST.profile_selected_tab.ON_SALE)}>{t('On Sale')}</a>
                                        <a id="tab_collectibles" className={this.state.selected_tab == CONST.profile_selected_tab.COLLECTIBLES? "active": ""} onClick={() => this.handleSelectedTab(CONST.profile_selected_tab.COLLECTIBLES)}>{t('Collectibles')}</a>
                                        <a id="tab_created" className={this.state.selected_tab == CONST.profile_selected_tab.CREATED? "active": ""} onClick={() => this.handleSelectedTab(CONST.profile_selected_tab.CREATED)}>{t('Created')}</a>
                                        <a id="tab_likes" className={this.state.selected_tab == CONST.profile_selected_tab.LIKES? "active": ""} onClick={() => this.handleSelectedTab(CONST.profile_selected_tab.LIKES)}>{t('Likes')}</a>
                                        <a id="tab_followings" className={this.state.selected_tab == CONST.profile_selected_tab.FOLLOWINGS? "active": ""} onClick={() => this.handleSelectedTab(CONST.profile_selected_tab.FOLLOWINGS)}>{t('Following')}</a>
                                        <a id="tab_followers" className={this.state.selected_tab == CONST.profile_selected_tab.FOLLOWERS? "active": ""} onClick={() => this.handleSelectedTab(CONST.profile_selected_tab.FOLLOWERS)}>{t('Followers')}</a>
                                    </div>
                                </div>

                                <div className="profile-infos-panels">
                                    <div id="profile-infos-panel-01" className="profile-infos-panel" style={this.state.selected_tab == CONST.profile_selected_tab.ON_SALE? style_none: style_hidden}>
                                        <div className="profile-infos-list">
                                            {
                                                this.state.sale_tokens.map((item, index) => {

                                                    var bottom_txt = "";
                                                    var bottom_price = "";
                                                    if (item.token.status == CONST.token_status.FIXED_PRICE) {
                                                        bottom_txt = "Fixed Price";
                                                        bottom_price = item.token.price + " BNB";
                                                    } else {
                                                        if (item.bids.length == 0) {
                                                            bottom_txt = "Minimum Price";
                                                            bottom_price = item.token.price + " " + AssetUtil.get_asset_by_id(item.token.auction_asset_id);
                                                        } else {
                                                            bottom_txt = "Highest Bid";
                                                            bottom_price = item.bids[0].amount + " " + AssetUtil.get_asset_by_id(item.token.auction_asset_id);
                                                        }
                                                    }

                                                    return (
                                                        <div className="profile-infos-item" onClick={() => document.location = "/item/" + item.token.id}>
                                                            <div className="profile-infos-figure">
                                                                <img src={JSON.parse(item.token.metadata).url} alt="" />
                                                            </div>

                                                            <div className="profile-infos-bottom info-block-tsb">
                                                                <div className="ttl">
                                                                    {item.token.token_name}
                                                                    <p className="ttl-mark eth-mark">{item.token.type == CONST.protocol_type.ERC721? "#" + item.token.token_id: item.token.owned_cnt + " / " + item.token.total_supply}</p>
                                                                </div>
                                                                <div className="stock">
                                                                    <div className="stock-icons">
                                                                        <div className="stock-icon">
                                                                            <img src={config.avatar_url + this.props.address + ".png"} onError={this.onAvatarError} alt=""/>
                                                                        </div>
                                                                        {
                                                                            item.bids.map((item, index) => {

                                                                                return (
                                                                                    <div className="stock-icon">    
                                                                                        <img src={config.avatar_url + item.address + ".png"} onError={this.onAvatarError} alt=""/>
                                                                                    </div>
                                                                                )
                                                                                
                                                                            })
                                                                        }
                                                                    </div>
                                                                    <p className="stock-txt">{item.bids.length} in Stock</p>
                                                                </div>
                                                                <div className="bottom">
                                                                    <div className="bottom-l">
                                                                        <span className="icon"><i className="fas fa-sliders-h"></i></span>
                                                                        <span className="txt">{bottom_txt}</span>
                                                                        <span className="price">{bottom_price}</span>
                                                                    </div>
                                                                    {/* <div className="bottom-r">
                                                                        New Bid<span><img src={icon_fire}/></span>
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>

                                    <div id="profile-infos-panel-02" className="profile-infos-panel" style={this.state.selected_tab == CONST.profile_selected_tab.COLLECTIBLES? style_none: style_hidden}>
                                        <div className="profile-infos-list">
                                            {this.state.owned_tokens.map((item, index) => {
                                                const metadata = JSON.parse(item.metadata);
                                                return (<div className="profile-infos-item" onClick={() => document.location = "/item/" + item.id}>
                                                    <div className="profile-infos-figure">
                                                        <img src={metadata.url} alt="" />
                                                    </div>

                                                    <div className="profile-infos-bottom info-block-tsb">
                                                        <div className="ttl">
                                                            {item.token_name}
                                                            <p className="ttl-mark eth-mark">{item.type == CONST.protocol_type.ERC721? "#" + item.token_id: item.owned_cnt + " / " + item.total_supply}</p>
                                                        </div>
                                                        <div className="owner">
                                                            <div className="owner-icons">
                                                                <div className="owner-icon">
                                                                    <img src={config.avatar_url + (this.state.address == null? "default": this.state.address) + ".png"} onError={this.onAvatarError} alt=""/>
                                                                </div>
                                                            </div>
                                                            <p className="owner-name">{this.state.profile == null? "...": this.state.profile.name}</p>
                                                            <p className="owner-txt" align="right">{this.props.address == null? '...': this.props.address.slice(0,5) + '...' + this.props.address.slice(38,42)}</p>
                                                        </div>
                                                    </div>
                                                </div>);
                                            })}
                                        </div>
                                    </div>

                                    <div id="profile-infos-panel-03" className="profile-infos-panel" style={this.state.selected_tab == CONST.profile_selected_tab.CREATED? style_none: style_hidden}>
                                        <div className="profile-infos-list">
                                            {this.state.created_tokens.map((item, index) => {
                                                const metadata = JSON.parse(item.metadata);
                                                return (<div className="profile-infos-item" onClick={() => document.location = "/item/" + item.id}>
                                                    <div className="profile-infos-figure">
                                                        <img src={metadata.url} alt="" />
                                                    </div>

                                                    <div className="profile-infos-bottom info-block-tsb">
                                                        <div className="ttl">
                                                            {item.token_name}
                                                            <p className="ttl-mark eth-mark">{item.type == CONST.protocol_type.ERC721? "#" + item.token_id: item.owned_cnt + " / " + item.total_supply}</p>
                                                        </div>
                                                        <div className="owner">
                                                            <div className="owner-icons">
                                                                <div className="owner-icon">
                                                                    <img src={config.avatar_url + (item.has_avatar == 1? item.owner: "default") + ".png"} alt=""/>
                                                                </div>
                                                            </div>
                                                            <p className="owner-name">{item.profile_name}</p>
                                                            <p className="owner-txt" align="right">{item.owner == null? '...': item.owner.slice(0,5) + '...' + item.owner.slice(38,42)}</p>
                                                        </div>
                                                    </div>
                                                </div>);
                                            })}
                                        </div>
                                    </div>

                                    <div id="profile-infos-panel-04" className="profile-infos-panel" style={this.state.selected_tab == CONST.profile_selected_tab.LIKES? style_none: style_hidden}>
                                        <div className="profile-infos-list">
                                            {this.state.likes_tokens.map((item, index) => {
                                                const metadata = JSON.parse(item.metadata);
                                                return (<div className="profile-infos-item" onClick={() => document.location = "/item/" + item.id}>
                                                    <div className="profile-infos-figure">
                                                        <img src={metadata.url} alt="" />
                                                    </div>

                                                    <div className="profile-infos-bottom info-block-tsb">
                                                        <div className="ttl">
                                                            {item.token_name}
                                                            <p className="ttl-mark eth-mark" style={item.type == CONST.protocol_type.ERC721? {}: style_hidden}>#{item.token_id}</p>
                                                        </div>
                                                        <div className="owner">
                                                            <div className="owner-icons">
                                                                <div className="owner-icon">
                                                                    <img src={config.avatar_url + item.owner + ".png"} onError={this.onAvatarError} alt=""/>
                                                                </div>
                                                            </div>
                                                            <p className="owner-name">{item.name}</p>
                                                            <p className="owner-txt" align="right">{item.owner.slice(0,5) + '...' + item.owner.slice(38,42)}</p>
                                                        </div>
                                                    </div>
                                                </div>);
                                            })}
                                        </div>
                                    </div>

                                    <div id="profile-infos-panel-05" className="profile-infos-panel" style={this.state.selected_tab == CONST.profile_selected_tab.FOLLOWINGS? style_none: style_hidden}>
                                        {
                                            this.state.followings.map((item, index) => {
                                                return (
                                                    <div className="profile-infos-follow">
                                                        <div className="profile-infos-follow-row">
                                                            <div className="profile-infos-follow-main">
                                                                <div className="profile-infos-follow-main-icon">
                                                                    <img src={config.avatar_url + item.following.address + ".png"}  onError={this.onAvatarError} onClick={() => document.location = "/profile/" + item.following.address} />
                                                                </div>
                                                                <div className="profile-infos-follow-main-infos">
                                                                    <p className="profile-infos-follow-main-infos-name">{item.following.name}</p>
                                                                    <p className="profile-infos-follow-main-infos-follow">{item.following.followers_cnt} followers</p>
                                                                    <a className="btn btn-h32 btn-fs-14" onClick={() => this.handleFollowings(item)} style={this.state.address == this.props.address? {}: style_hidden}>
                                                                        <span className="txt">{t('Unfollow')}</span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className="profile-infos-follow-list-row">
                                                                <div className="profile-infos-follow-list">
                                                                    <div className="swiper-container slide-goods">
                                                                        <div className="swiper-wrapper">
                                                                            {
                                                                                item.tokens.map((token, index) => {
                                                                                    return (
                                                                                        <div className="swiper-slide profile-infos-follow-col" onClick={() => document.location = "/item/" + token.token_contract_id + "/" + token.token_id}>
                                                                                            <img src={JSON.parse(token.metadata).url} alt="" />
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    <div id="profile-infos-panel-06" className="profile-infos-panel" style={this.state.selected_tab == CONST.profile_selected_tab.FOLLOWERS? style_none: style_hidden}>
                                        {
                                            this.state.followers.map((item, index) => {console.log(item);
                                                return (
                                                    <div className="profile-infos-follow">
                                                        <div className="profile-infos-follow-row">
                                                            <div className="profile-infos-follow-main">
                                                                <div className="profile-infos-follow-main-icon">
                                                                    <img src={config.avatar_url + item.follower.address + ".png"} onError={this.onAvatarError} onClick={() => document.location = "/profile/" + item.follower.address} />
                                                                </div>
                                                                <div className="profile-infos-follow-main-infos">
                                                                    <p className="profile-infos-follow-main-infos-name">{item.follower.name}</p>
                                                                    <p className="profile-infos-follow-main-infos-follow">{item.follower.followers_cnt} followers</p>
                                                                    <a className="btn btn-h32 btn-blue btn-fs-14" onClick={() => this.handleFollowers(item)} style={this.state.address == this.props.address && item.follower.is_following == false? {}: style_hidden}>
                                                                        <span className="txt">Follow</span>
                                                                    </a>
                                                                    <a className="btn btn-h32 btn-fs-14" onClick={() => this.handleFollowers(item)} style={this.state.address == this.props.address && item.follower.is_following == true? {}: style_hidden}>
                                                                        <span className="txt">Unfollow</span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className="profile-infos-follow-list-row">
                                                                <div className="profile-infos-follow-list">
                                                                    <div className="swiper-container slide-goods">
                                                                        <div className="swiper-wrapper">
                                                                            {
                                                                                item.tokens.map((token, index) => {
                                                                                    return (
                                                                                        <div className="swiper-slide profile-infos-follow-col" onClick={() => document.location = "/item/" + token.token_contract_id + "/" + token.token_id}>
                                                                                            <img src={JSON.parse(token.metadata).url} alt="" />
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                {/* <div className="profile-load-more">
                                    <div className="profile-load-more-icon"><i className="fas fa-spinner"></i></div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </section>

                <div id="loading-popup" className="popup">
                    <div className="popup-box">
                        <div className="loading-popup-head">
                            <div className="loader"></div>
                            <p className="loading-popup-head-ttl">{t('Please wait...')}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Profile);