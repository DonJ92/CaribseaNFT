import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {ChangeClass, AddClass} from '../js/common';

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

        var script = document.createElement('script');
        script.src = './js/page/faq.js';
        script.async = true;
        document.body.appendChild(script);

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
        var style_hidden = {display: 'none'};

        return (
            <div>
                <div id="faq-head" className="faq-head">
                    <div className="content">
                        <h2 className="faq-head-ttl">
                            <span>LEARN TO GET STARTED</span>
                            Frequently asked questions
                        </h2>
                        <p className="faq-head-txt">
                            Join Stacks community now to get free updates and also a lot of freebies are<br/>
                            waiting for you or <a href="#">Contact Support</a>
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
                                            <span className="txt">General</span>
                                        </a>
                                    </li>
                                    <li className={this.state.selected_tab == SELECTED_TAB.PRODUCTS? "faq-menu-item current": "faq-menu-item"}>
                                        <a onClick={() => this.handleSelectedTab(SELECTED_TAB.PRODUCTS)}>
                                            <span className="ico"><img src={icon_02}/></span>
                                            <span className="txt">Products</span>
                                        </a>
                                    </li>
                                    <li className={this.state.selected_tab == SELECTED_TAB.GOVERNANCE? "faq-menu-item current": "faq-menu-item"}>
                                        <a onClick={() => this.handleSelectedTab(SELECTED_TAB.GOVERNANCE)}>
                                            <span className="ico"><img src={icon_03}/></span>
                                            <span className="txt">Governance</span>
                                        </a>
                                    </li>
                                    <li className={this.state.selected_tab == SELECTED_TAB.SUPPORT? "faq-menu-item current": "faq-menu-item"}>
                                        <a onClick={() => this.handleSelectedTab(SELECTED_TAB.SUPPORT)}>
                                            <span className="ico"><img src={icon_04}/></span>
                                            <span className="txt">Support</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="faq-body-r">
                                <div class="faq-select select-wrapper">
                                    <select id="sel_tab" onChange={() => this.handleSelectedTab(document.getElementById("sel_tab").value)}>
                                        <option value={SELECTED_TAB.GENERAL}>General</option>
                                        <option value={SELECTED_TAB.PRODUCTS}>Products</option>
                                        <option value={SELECTED_TAB.GOVERNANCE}>Governance</option>
                                        <option value={SELECTED_TAB.SUPPORT}>Support</option>
                                    </select>
                                    <div class="arrow"><i class="fas fa-angle-down"></i></div>
                                </div>

                                <div id="general-panel" style={this.state.selected_tab == SELECTED_TAB.GENERAL? {}: style_hidden}>
                                    <div className="faq-item">
                                        <a className="faq-item-ttl active" href="#">
                                            What are the official Carib websites?
                                            <span className="arrow"><i className="fas fa-angle-up"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                <a href="https://caribmars.finance/">https://caribmars.finance/</a><br/>
                                                <a href="https://app.caribmars.finance/">https://app.caribmars.finance/</a>
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            What is Caribswap?
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                Caribswap is DEX & NFT Marketplace.
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            What is DEX?
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                DEX are a type of cryptocurrency exchange which allows for direct peer-to-peer cryptocurrency transactions to take place online securely and without the need for an intermediary.
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            What is NFT? ERC-721Token?
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                NFT stands for non-fungible tokens like ERC-721 (a smart contract standard) tokens which are hosted on Ethereum’s own blockchain. An NFT is a digital asset that represents real-world objects like art, music, in-game items and videos. They are bought and sold online, frequently with cryptocurrency, and they are generally encoded with the same underlying software as many cryptos.<br/>
                                                <a href="https://101blockchains.com/non-fungible-tokens-nft/">https://101blockchains.com/non-fungible-tokens-nft/</a><br/>
                                                <a href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md">https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md</a>
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>
                                </div>

                                <div id="products-panel" style={this.state.selected_tab == SELECTED_TAB.PRODUCTS? {}: style_hidden}>
                                    <div className="faq-item">
                                        <a className="faq-item-ttl active" href="#">
                                            What does “minting” mean?
                                            <span className="arrow"><i className="fas fa-angle-up"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                The process of tokenizing your work and creating an NFT.
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            Can I gift or send a collectible to someone?
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                Yes, just go on the detail page of a collectible you own, open the “...” menu and select “transfer token”
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            What does “burn a token” mean?
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                The ERC-721 standard does not only allow the creation of NFTs, but also includes a possibility to destroy them - i.e. burning the token.
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            Automatic LP
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                Every transfer contributes towards automatically generating liquidity that goes into multiple pools used by exchanges.
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            How much does exchange fee cost?
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                Service fee: 2.5%<br/>
                                                Listing fee: 0.015 BNB<br/>
                                                Copyright fee: according to deployer’s setting will be required

                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>
                                </div>

                                <div id="governance-panel" style={this.state.selected_tab == SELECTED_TAB.GOVERNANCE? {}: style_hidden}>
                                    <div className="faq-item">
                                        <a className="faq-item-ttl active" href="#">
                                            What is CaribNFT governance system? How does it work?
                                            <span className="arrow"><i className="fas fa-angle-up"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                CaribNFT is managed by a decentralized community of CaribMars token-holders and their delegates, who propose and vote on upgrades to the protocol.<br/>
                                                <br/>
                                                CaribMars is governance token.
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            CaribMars Address
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                CaribMars is deployed at 0x111111111111111111 on the Ethereum mainnet.
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>

                                    <div className="faq-item">
                                        <a className="faq-item-ttl" href="#">
                                            CaribMars transfer fee
                                            <span className="arrow"><i className="fas fa-angle-down"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                10%, (5% of transfer fee will be burned automatically, 47.5% will be distributed to holders, 47.5% will be used to generate liquidity)
                                            </p>
                                            {/* <a className="btn btn-h40" href="#"><span className="txt">Learn more</span></a> */}
                                        </div>
                                    </div>
                                </div>

                                <div id="support-panel" style={this.state.selected_tab == SELECTED_TAB.SUPPORT? {}: style_hidden}>
                                    <div className="faq-item">
                                        <a className="faq-item-ttl active" href="#">
                                            Support
                                            <span className="arrow"><i className="fas fa-angle-up"></i></span>
                                        </a>
                                        <div className="faq-item-content">
                                            <p className="faq-item-content-txt">
                                                If you have any questions about using the protocol, it's best to ask in either Discord or Telegram
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

export default FAQ;