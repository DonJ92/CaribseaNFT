import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {ChangeClass, AddClass} from '../js/common';
import { withTranslation } from 'react-i18next';

import icon_01 from '../img/faq/icon-01.png';
import icon_02 from '../img/faq/icon-02.png';
import icon_03 from '../img/faq/icon-03.png';
import icon_04 from '../img/faq/icon-04.png';

var SELECTED_TAB = {
    GENERAL: 0,
    PRODUCTS: 1,
    GOVERNANCE: 2,
    SUPPORT: 3
};

class FAQ extends React.Component {
    constructor(props) {
        super(props);

        // var script = document.createElement('script');
        // script.src = './js/page/faq.js';
        // script.async = true;
        // document.body.appendChild(script);

        ChangeClass('faq');

        this.state = {
            selected_tab: SELECTED_TAB.GENERAL
        };
    }

    handleSelectedTab(index) {
        this.setState({
            selected_tab: index
        });
    }

    render() {
        const { t } = this.props;

        var style_hidden = {display: 'none'};

        return (
            <div>
                <div id="faq-head" className="faq-head">
                    <div className="content">
                        <h2 className="faq-head-ttl">
                            <span>{t('LEARN TO GET STARTED')}</span>
                            {t('Frequently asked questions')}
                        </h2>
                        <p className="faq-head-txt">
                        </p>
                    </div>
                </div>

                <div id="faq-body" className="faq-body">
                    <div className="content">
                        <div className="faq-body-inner">
                            <div className="faq-body-l">
                                <ul className="faq-menu-list">
                                    <li className={this.state.selected_tab == SELECTED_TAB.GENERAL? "faq-menu-item current": "faq-menu-item"}>
                                        <a onClick={() => this.handleSelectedTab(SELECTED_TAB.GENERAL)}>
                                            <span className="ico"><img src={icon_01}/></span>
                                            <span className="txt">{t('General')}</span>
                                        </a>
                                    </li>
                                    <li className={this.state.selected_tab == SELECTED_TAB.PRODUCTS? "faq-menu-item current": "faq-menu-item"}>
                                        <a onClick={() => this.handleSelectedTab(SELECTED_TAB.PRODUCTS)}>
                                            <span className="ico"><img src={icon_02}/></span>
                                            <span className="txt">{t('Products')}</span>
                                        </a>
                                    </li>
                                    <li className={this.state.selected_tab == SELECTED_TAB.GOVERNANCE? "faq-menu-item current": "faq-menu-item"}>
                                        <a onClick={() => this.handleSelectedTab(SELECTED_TAB.GOVERNANCE)}>
                                            <span className="ico"><img src={icon_03}/></span>
                                            <span className="txt">{t('Governance')}</span>
                                        </a>
                                    </li>
                                    <li className={this.state.selected_tab == SELECTED_TAB.SUPPORT? "faq-menu-item current": "faq-menu-item"}>
                                        <a onClick={() => this.handleSelectedTab(SELECTED_TAB.SUPPORT)}>
                                            <span className="ico"><img src={icon_04}/></span>
                                            <span className="txt">{t('Support')}</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="faq-body-r">
                                <div className="faq-select select-wrapper">
                                    <select id="sel_tab" onChange={() => this.handleSelectedTab(document.getElementById("sel_tab").value)}>
                                        <option value={SELECTED_TAB.GENERAL}>{t('General')}</option>
                                        <option value={SELECTED_TAB.PRODUCTS}>{t('Products')}</option>
                                        <option value={SELECTED_TAB.GOVERNANCE}>{t('Governance')}</option>
                                        <option value={SELECTED_TAB.SUPPORT}>{t('Support')}</option>
                                    </select>
                                    <div className="arrow"><i className="fas fa-angle-down"></i></div>
                                </div>

                                <div id="general-panel" style={this.state.selected_tab == SELECTED_TAB.GENERAL? {}: style_hidden}>
                                    <div className="faq-item">
                                        <a className="faq-item-ttl active" href="#">
                                            {t('What are the official CaribMars websites?')}
                                            <span className="arrow"><i className="fas fa-angle-up"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                {t('caribsea.io is started from below link as its project.')}<br/>
                                                <a href="https://caribmars.finance/">https://caribmars.finance/</a><br/>
                                                {/* caribsea.io is started from <a href="https://caribmars.finance/">https://caribmars.finance/</a> as its project.<br/> */}
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            {t('What is Carib.io? What can I do in this website?')}
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                {t('Caribsea.io is a marketplace where you can mint NFT to sell and buy your favorite NFT. You can mint NFT token in our platform to sell your digital art, digital asset, your social media posts and anything which can be NFT token. As for social media post, you must upload your contents after approved by API to avoid fake NFT.')}
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            {t('What is NFT? ERC-721Token? ERC-1155Token?')}
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                {t('NFT stands for non-fungible tokens like ERC-721 (a smart contract standard) tokens which are hosted on Ethereum’s own blockchain. An NFT is a digital asset that represents real-world objects like art, music, in-game items and videos. They are bought and sold online, frequently with cryptocurrency, and they are generally encoded with the same underlying software as many cryptos.')}<br/>
                                                {t('As for ERC721, ERC721 is a standard for representing ownership of non-fungible tokens, that is, where each token is unique.')}
<br/><br/>
{t('ERC721 is a more complex standard than ERC20, with multiple optional extensions, and is split across a number of contracts. The OpenZeppelin Contracts provide flexibility regarding how these are combined, along with custom useful extensions. Check out the API Reference to learn more about these.')}<br/><br/>
{t('ERC-1155 is a digital token standard created by Enjin that can used to create both fungible (currencies) and non-fungible (digital cards, pets and in-game skins) assets on the Ethereum Network. By using the Ethereum network, ERC-1155 tokens are secure, tradable and immune to hacking. To find out more about the specifications of the ERC-1155 standard, check out EIP 1155.')}

{t('ERC-1155 a new way of creating tokens that allow for more efficient trades and bundling of transactions – thus saving costs. This token standard allows for the creation of both utility tokens (such as $BNB or $BAT) and also Non-Fungible Tokens like CryptoKitties.')}


{t('ERC-1155 includes optimizations that allow for more efficient and safer transactions. Transactions could be bundled together – thus reducing the cost of transferring tokens. ERC-1155 builds on previous work such as ERC-20 (utility tokens) and ERC-721 (rare one-time collectibles).')}

                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>
                                </div>

                                <div id="products-panel" style={this.state.selected_tab == SELECTED_TAB.PRODUCTS? {}: style_hidden}>
                                    <div className="faq-item">
                                        <a className="faq-item-ttl active" href="#">
                                            {t("What does \"minting\" mean?")}
                                            <span className="arrow"><i className="fas fa-angle-up"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                {t('The process of tokenizing your work and creating an NFT.')}
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            {t('Can I gift or send a collectible to someone?')}
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                {t('Yes, just go on the detail page of a collectible you own, open the “...” menu and select “transfer token”')}
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            {t("What does \"burn a token\" mean?")}
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                {t('The ERC-721 standard does not only allow the creation of NFTs, but also includes a possibility to destroy them - i.e. burning the token.')}
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                </div>

                                <div id="governance-panel" style={this.state.selected_tab == SELECTED_TAB.GOVERNANCE? {}: style_hidden}>
                                    <div className="faq-item">
                                        <a className="faq-item-ttl active" href="#">
                                            {t('What is CaribNFT governance system? How does it work?')}
                                            <span className="arrow"><i className="fas fa-angle-up"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                {t('CaribNFT is managed by a decentralized community of CaribMars token-holders and their delegates, who propose and vote on upgrades to the protocol.')}<br/>
                                                <br/>
                                                {t('CaribMars is governance token.')}
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            {t('CaribMars Address')}
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                {t('CaribMars is deployed at 0xD923F0eDA700a27457A46791Ae3aFD25F89Ad996 on the BSC mainnet.')}
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>
                                </div>

                                <div id="support-panel" style={this.state.selected_tab == SELECTED_TAB.SUPPORT? {}: style_hidden}>
                                    <div className="faq-item">
                                        <a className="faq-item-ttl active" href="#">
                                            {t('Support')}
                                            <span className="arrow"><i className="fas fa-angle-up"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                {t("If you have any questions about using the protocol, it's best to ask in either Discord or Telegram")}
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(FAQ);