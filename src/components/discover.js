import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';

import * as API from '../adapter/api';
import AssetUtil from '../common/asset_util';
import BalanceUtil from '../common/balance_util';
import CONST, { item_selected_tab } from '../globals/constants';
import support_networks from '../globals/support_networks';

import discover_01 from '../img/home/discover-01.jpg';
import icon_avatar_01 from '../img/common/icon-avatar-01.png';
import icon_fire from '../img/common/icon-fire.png';
import config from '../globals/config';
import { withTranslation } from 'react-i18next';

var FILTER_TYPE = {
    RECENT: "0",
    LIKES: "1"
};

var TAB_TYPE = {
    ALL: 0,
    ART: 1,
    PHOTOGRAPH: 2,
    REAL_ASSET: 3,
    Manga: 4,
    SNS: 5,
    LOVE: 6
};

class Discover extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tokens: [],
            selected_tab: TAB_TYPE.ALL
        };

        this.getLastTokens(this.state.selected_tab, support_networks.NONE);
    }

    componentDidUpdate() {
        var script = document.createElement('script');
        script.src = './js/page/home.js';
        script.async = true;
        document.body.appendChild(script);
    }

    getLastTokens(index, chain_id) {
        API.get_last_tokens(20, chain_id, index)
        .then((res) => {
            if (res.result) {console.log(res);
                this.setState({
                    tokens: res.tokens
                });
            }
        }) 
    }

    getLikesTokens(index, chain_id) {
        API.get_most_like_tokens(20, chain_id, index)
        .then((res) => {
            if (res.result) {
                this.setState({
                    tokens: res.tokens
                })
            }
        })
    }

    handleFilterChanged() {
        var filter = document.getElementById("sel_discover_filter").value;
        var chain_id = document.getElementById("sel_network").value;

        switch(filter) {
            case FILTER_TYPE.RECENT:
                this.getLastTokens(this.state.selected_tab, chain_id);
                break;
            case FILTER_TYPE.LIKES:
                this.getLikesTokens(this.state.selected_tab, chain_id);
                break;
        }
    }

    handleTabSelected(index) {
        this.setState({
            selected_tab: index
        });

        this.handleFilterChanged(index);
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    render() {
        const { t } = this.props;

        var style_hidden = {display: 'non'};
        
        return <section id="discover" className="discover">
            <div className="content">
                <div className="discover-head">
                    <h3 className="discover-head-ttl">{t('Discover')}</h3>
                </div>

                <div className="discover-body">
                    <div className="discover-search">
                        <div className="discover-search-header">
                            <div className="discover-search-header-order select-wrapper">
                                <select id="sel_discover_filter" onChange={() => this.handleFilterChanged()}>
                                    <option value={FILTER_TYPE.RECENT}>{t('Recently added')}</option>
                                    <option value={FILTER_TYPE.LIKES}>{t('Most likes')}</option>
                                </select>
                                <div className="arrow"><i className="fas fa-angle-down"></i></div>
                            </div>

                            <div className="discover-search-header-order select-wrapper">
                                <select id="sel_network" onChange={() => this.handleFilterChanged()}>
                                    <option value={support_networks.NONE}>{t('All')}</option>
                                    <option value={support_networks.ETHEREUM}>{t('Ethereum')}</option>
                                    <option value={support_networks.BSC}>{t('Binance Smart Chain')}</option>
                                </select>
                                <div className="arrow"><i className="fas fa-angle-down"></i></div>
                            </div>

                            <div className="discover-search-header-tags">
                                <a className={this.state.selected_tab == TAB_TYPE.ALL? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.ALL)}>{t('All items')}</a>
                                <a className={this.state.selected_tab == TAB_TYPE.ART? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.ART)}>{t('Art')}</a>
                                <a className={this.state.selected_tab == TAB_TYPE.PHOTOGRAPH? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.PHOTOGRAPH)}>{t('Photograph')}</a>
                                <a className={this.state.selected_tab == TAB_TYPE.REAL_ASSET? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.REAL_ASSET)}>{t('Real asset')}</a>
                                <a className={this.state.selected_tab == TAB_TYPE.Manga? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.Manga)}>{t('Manga')}</a>
                                <a className={this.state.selected_tab == TAB_TYPE.SNS? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.SNS)}>{t('SNS')}</a>
                                <a className={this.state.selected_tab == TAB_TYPE.LOVE? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.LOVE)}>{t('Love')}</a>
                            </div>

                            {/* <a id="btn-discover-search-header-filter" className="btn-discover-search-header-filter" href="#">
                                Filter
                                <div className="icon-mark">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </a> */}
                        </div>

                        <div id="discover-search-body" className="discover-search-body">
                            <div className="discover-search-filter-row">
                                <div className="discover-search-filter-col">
                                    <p className="discover-search-filter-name">{t('PRICE')}</p>
                                    <div className="select-wrapper">
                                        <select>
                                            <option>{t('Highest price')}</option>
                                        </select>
                                        <div className="arrow"><i className="fas fa-angle-down"></i></div>
                                    </div>
                                </div>

                                <div className="discover-search-filter-col">
                                    <p className="discover-search-filter-name">{t('LIKES')}</p>
                                    <div className="select-wrapper">
                                        <select>
                                            <option>{t('Most Liked')}</option>
                                        </select>
                                        <div className="arrow"><i className="fas fa-angle-down"></i></div>
                                    </div>
                                </div>

                                <div className="discover-search-filter-col">
                                    <p className="discover-search-filter-name">{t('CREATOR')}</p>
                                    <div className="select-wrapper">
                                        <select>
                                            <option>{t('Verified only')}</option>
                                        </select>
                                        <div className="arrow"><i className="fas fa-angle-down"></i></div>
                                    </div>
                                </div>

                                <div className="discover-search-filter-col">
                                    <p className="discover-search-filter-name">{t('PRICE RANGE')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="discover-slide" className="discover-slide swiper-container">
                        <div className="discover-list swiper-wrapper">
                            {
                                this.state.tokens.map((item, index) => {
                                    var price_comment = "";
                                    var price_txt = "";

                                    if (item.status == CONST.token_status.FIXED_PRICE) {
                                        price_comment = t("Fixed Price");
                                        price_txt = BalanceUtil.format_balance(item.price, "BNB", 2);
                                    } else if (item.status == CONST.token_status.AUCTION) {
                                        if (item.bids.length == 0) {
                                            price_comment = t("Minimum Price");
                                            price_txt = BalanceUtil.format_balance(
                                                item.price,
                                                AssetUtil.get_asset_by_id(item.auction_asset_id),
                                                2
                                            );
                                        } else {
                                            price_comment = t("Highest Bid");
                                            price_txt = BalanceUtil.format_balance(
                                                item.bids[0].amount,
                                                AssetUtil.get_asset_by_id(item.auction_asset_id),
                                                2
                                            );
                                        }
                                    } else {
                                        price_comment = t("Not sell");
                                    }

                                    return (
                                        <div className="swiper-slide">
                                            <div className="discover-item" onClick={() => window.location = config.host_url + "/item/" + item.id}>
                                                <div className="discover-item-figure">
                                                    <img src={JSON.parse(item.metadata).url} alt="" />
                                                </div>
                                                <div className="discover-item-infos info-block-tsb">
                                                    <div className="ttl">
                                                        <p className="name">{item.token_name}</p>
                                                        <p className="ttl-mark eth-mark">{item.type == CONST.protocol_type.ERC721? "#" + item.token_id: item.owned_cnt + " / " + item.total_supply}</p>
                                                    </div>
                                                    <div className="stock">
                                                        <div className="stock-icons">
                                                            <div className="stock-icon" style={item.status == CONST.token_status.FIXED_PRICE || item.status == CONST.token_status.AUCTION? style_hidden: {}}>
                                                                <img src={config.avatar_url + item.owner + ".png"} onError={this.onAvatarError} alt=""/>
                                                            </div>
                                                            {
                                                                item.bids.map((bid, index) => {
                                                                    return (
                                                                        <div className="stock-icon">
                                                                            <img src={config.avatar_url + bid.address + ".png"} onError={this.onAvatarError} alt=""/>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        <p className="stock-txt">{item.status == CONST.token_status.AUCTION? t("in stock", {count: item.bids.length}): t("No auction")}</p>
                                                    </div>
                                                    <div className="bottom">
                                                        <div className="bottom-l">
                                                            <span className="icon"><i className="fas fa-sliders-h"></i></span>
                                                            <span className="txt">{price_comment}</span>
                                                            <span className="price">{price_txt}</span>
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

                    {/* <a className="discover-load-more btn btn-center" href="#">
                        <span className="txt">Load more</span>
                        <span className="ico"><i className="fas fa-spinner"></i></span>
                    </a> */}
                </div>
            </div>
        </section>
    }
}
  
export default withTranslation()(Discover);