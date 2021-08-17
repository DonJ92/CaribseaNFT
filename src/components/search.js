import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {ChangeClass, AddClass} from '../js/common';
import * as API from '../adapter/api';
import CONST from '../globals/constants';
import BalanceUtil from '../common/balance_util';
import AssetUtil from '../common/asset_util';
import config from '../globals/config';
import $ from 'jquery';
import support_networks from '../globals/support_networks';
import { withTranslation } from 'react-i18next';

var TAB_TYPE = {
    ALL: 0,
    ART: 1,
    PHOTOGRAPH: 2,
    REAL_ASSET: 3,
    Manga: 4,
    SNS: 5,
    LOVE: 6
};

var FILTER_TYPE = {
    RECENT: 0,
    LIKES: 1
};

class Search extends React.Component {
    constructor(props) {
        super(props);

        // var script = document.createElement('script');
        // script.src = './js/page/search.js';
        // script.async = true;
        // document.body.appendChild(script);

        AddClass('search');
        AddClass('has-popup');

        this.state = {
            tokens: [],
            selected_tab: TAB_TYPE.ALL,
            filter_type: FILTER_TYPE.RECENT,
            show_loading: true,
            chain_id: support_networks.NONE
        };

        if (this.props.keyword == null) {
            API.get_last_tokens(20)
            .then((res) => {
                if (res.result) {
                    this.setState({
                        tokens: res.tokens
                    });
                }
            })
        } else {
            this.search(this.props.keyword);
        }
    }

    componentDidMount() {
        if (this.props.keyword != null) {
            document.getElementById("input_keyword").value = this.props.keyword;
        }
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

    handleTabSelected(index) {
        this.setState({
            selected_tab: index
        });
    }

    search(keyword) {
        this.showLoading();
        if (keyword == "") {
            if (this.state.filter_type == FILTER_TYPE.RECENT) {
                API.get_last_tokens(20, this.state.chain_id)
                .then((res) => {console.log(res);
                    if (res.result) {
                        this.setState({
                            tokens: res.tokens
                        });
                    }
                    this.hideLoading();
                })
            } else {
                API.get_most_like_tokens(20, this.state.chain_id)
                .then((res) => {console.log(res);
                    if (res.result) {
                        this.setState({
                            tokens: res.tokens
                        });
                    }
                    this.hideLoading();
                })
            }
        } else {
            API.search(this.state.filter_type, keyword, this.state.chain_id)
            .then((res) => {console.log(res);
                if (res.result) {
                    this.setState({
                        tokens: res.tokens
                    });
                }
                this.hideLoading();
            })
        }
        
    }

    handleSearch() {
        this.search(document.getElementById("input_keyword").value)
    }

    handleFilterChanged() {
        this.setState({
            filter_type: parseInt(document.getElementById("sel_filter").value)
        });
    }

    handleNetworkChanged() {
        this.setState({
            chain_id: parseInt(document.getElementById("sel_network").value)
        });
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    registerSearchEnterKeyEvent = (event) => {
        if (event.key === 'Enter') {
            this.handleSearch();
        }
    }

    resetFilter() {
        document.getElementById("input_keyword").value = "";
        this.setState({
            selected_tab: CONST.TAB_TYPE.ALL,
            filter_type: FILTER_TYPE.RECENT
        });
    }

    render() {
        const { t } = this.props;

        var filtered_tokens = [];

        if (this.state.selected_tab == TAB_TYPE.ALL) {
            filtered_tokens = this.state.tokens;
        } else {
            filtered_tokens = this.state.tokens.filter(token => token.collection == this.state.selected_tab);
        }

        var style_hidden = {display: 'none'};

        return (
            <section id="search" className="search">
                <div className="content">
                    <div className="search-head">
                        <div className="search-head-keyword">
                            <input id="input_keyword" type="text" placeholder={t('"Type your keywords"')} onKeyDown={this.registerSearchEnterKeyEvent}/>
                            <a onClick={() => this.handleSearch()}><i className="fas fa-search"></i></a>
                        </div>

                        <div className="search-head-options">
                            <div className="sh-options-filter select-wrapper">
                                <select id="sel_filter" onChange={() => this.handleFilterChanged()}>
                                    <option>{t('Recently added')}</option>
                                    <option>{t('Most Liked')}</option>
                                </select>
                                <div className="arrow"><i className="fas fa-angle-down"></i></div>
                            </div>

                            <div className="sh-options-filter select-wrapper">
                                <select id="sel_network" onChange={() => this.handleNetworkChanged()}>
                                    <option value={support_networks.NONE}>{t('All')}</option>
                                    <option value={support_networks.ETHEREUM}>{t('Ethereum')}</option>
                                    <option value={support_networks.BSC}>{t('Binance Smart Chain')}</option>
                                </select>
                                <div className="arrow"><i className="fas fa-angle-down"></i></div>
                            </div>

                            <div className="sh-options-tags-wrapper">
                                <div className="sh-options-tags tags-list">
                                    <a className={this.state.selected_tab == TAB_TYPE.ALL? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.ALL)}>{t('All items')}</a>
                                    <a className={this.state.selected_tab == TAB_TYPE.ART? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.ART)}>{t('Art')}</a>
                                    <a className={this.state.selected_tab == TAB_TYPE.PHOTOGRAPH? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.PHOTOGRAPH)}>{t('Photograph')}</a>
                                    <a className={this.state.selected_tab == TAB_TYPE.REAL_ASSET? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.REAL_ASSET)}>{t('Real asset')}</a>
                                    <a className={this.state.selected_tab == TAB_TYPE.Manga? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.Manga)}>{t('Manga')}</a>
                                    <a className={this.state.selected_tab == TAB_TYPE.SNS? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.SNS)}>{t('SNS')}</a>
                                    <a className={this.state.selected_tab == TAB_TYPE.LOVE? "active": ""} onClick={() => this.handleTabSelected(TAB_TYPE.LOVE)}>{t('Love')}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="search-body">
                        <aside>
                            <div className="sb-aside-price-range">
                            </div>
                            <div className="sb-aside-options">
                                {/* <div className="select-field">
                                    <p className="select-field-ttl">LIKES</p>
                                    <div className="select-wrapper">
                                        <select>
                                            <option>Most liked</option>
                                        </select>
                                        <div className="arrow"><i className="fas fa-angle-down"></i></div>
                                    </div>
                                </div> */}
                                {/* <div className="select-field">
                                    <p className="select-field-ttl">OPEN</p>
                                    <div className="select-wrapper">
                                        <select>
                                            <option>Colors</option>
                                        </select>
                                        <div className="arrow"><i className="fas fa-angle-down"></i></div>
                                    </div>

                                    <div className="color-list">
                                        <div className="color-item color-item-all">
                                            <div className="color all"><span></span></div>
                                            <span className="txt">All colors</span>
                                        </div>

                                        <div className="color-item">
                                            <div className="color black"><span></span></div>
                                            <span className="txt">Black</span>
                                        </div>

                                        <div className="color-item">
                                            <div className="color green"><span></span></div>
                                            <span className="txt">Green</span>
                                        </div>

                                        <div className="color-item">
                                            <div className="color pink"><span></span></div>
                                            <span className="txt">Pink</span>
                                        </div>

                                        <div className="color-item">
                                            <div className="color purple"><span></span></div>
                                            <span className="txt">Pink</span>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="select-field">
                                    <p className="select-field-ttl">{t('Creator')}</p>
                                    <div className="select-wrapper">
                                        <select>
                                            <option>{t('Verified only')}</option>
                                        </select>
                                        <div className="arrow"><i className="fas fa-angle-down"></i></div>
                                    </div>
                                </div>
                            </div>
                            <a className="sb-aside-reset-filter" onClick={() => window.location = config.host_url + "/search"}>
                                <span className="ico"><i className="fas fa-times-circle"></i></span>
                                <span className="txt">{t('Reset filter')}</span>
                            </a>
                        </aside>

                        <main>
                            <div className="sb-main-list">
                                {
                                    filtered_tokens.map((item, index) => {
                                        var stock_txt = "";
                                        var price_txt = "";
                                        var price_comment = "";

                                        if (item.status == CONST.token_status.FIXED_PRICE) {
                                            stock_txt = t("No Auction")
                                            price_txt = BalanceUtil.format_balance(item.price, "BNB", 2);
                                            price_comment = t("Fixed Price");
                                        } else if (item.status == CONST.token_status.AUCTION) {
                                            stock_txt = t('in Stock', {count: item.bids.length});
                                            if (item.bids.length == 0) {
                                                price_comment = t("Minimum Bid");
                                                price_txt = BalanceUtil.format_balance(
                                                    item.price,
                                                    AssetUtil.get_asset_by_id(item.auction_asset_id),
                                                    2
                                                )
                                            } else {
                                                price_comment = t("Highest Bid");
                                                price_txt = BalanceUtil.format_balance(
                                                    item.bids[0].amount,
                                                    AssetUtil.get_asset_by_id(item.auction_asset_id),
                                                    2
                                                )
                                            }
                                        } else {
                                            stock_txt = t("No auction");
                                            price_comment = t("Not sell")
                                            price_txt = "";
                                        }

                                        return (
                                            <div className="sb-main-item" onClick={() => window.location = config.host_url + "/item/" + item.id}>
                                                <div className="sb-main-item-figure figure-has-overlay">
                                                    <img src={JSON.parse(item.metadata).url} alt="" />
                                                    <div className="figure-overlay">
                                                        <p className="figure-overlay" style={item.status == CONST.token_status.FIXED_PRICE || item.status == CONST.token_status.AUCTION? {}: style_hidden}>{t('PURCHASING!')}</p>
                                                        {/* <div className="figure-like"><i className="far fa-heart"></i></div> */}
                                                        {/* <a className="figure-link" href="#">
                                                            <span className="txt">Place a bid</span>
                                                            <span className="icon"><i className="fas fa-sliders-h"></i></span>
                                                        </a> */}
                                                    </div>
                                                </div>
                                                <div className="sb-main-item-tsb info-block-tsb">
                                                    <div className="ttl">
                                                        <p className="name">{item.token_name}</p>
                                                        <p className="ttl-mark eth-mark">{item.type == CONST.protocol_type.ERC721? "#" + item.token_id: item.owned_cnt + " / " + item.total_supply}</p>
                                                    </div>
                                                    <div className="stock">
                                                        <div className="stock-icons">
                                                            <div className="stock-icon">
                                                                <img src={config.avatar_url + item.owner + ".png"} onError={this.onAvatarError} clasalt=""/>
                                                            </div>
                                                            {
                                                                item.bids.map((bid, index) => {
                                                                    <div className="stock-icon">
                                                                        <img src={config.avatar_url + bid.address + ".png"} onError={this.onAvatarError} clasalt=""/>
                                                                    </div>
                                                                })
                                                            }
                                                        </div>
                                                        <p className="stock-txt">{stock_txt}</p>
                                                    </div>
                                                    <div className="bottom">
                                                        <div className="bottom-l">
                                                            <span className="icon"><i className="fas fa-sliders-h"></i></span>
                                                            <span className="txt">{price_comment}</span>
                                                            <span className="price">{price_txt}</span>
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
                            {/* <div className="sb-main-load-more">
                                <a className="sb-main-load-more btn btn-h40 btn-center" href="#">
                                    <span className="ico ico-l"><i className="fas fa-spinner"></i></span>
                                    <span className="txt">Load more</span>
                                </a>
                            </div> */}
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

export default withTranslation()(Search);