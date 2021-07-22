import React, {useContext} from 'react';
import '../styles/style.css';
import {ChangeClass,AddClass} from '../js/common';
import { UseWalletProvider, useWallet } from 'use-wallet'
import constants, { wallet_type } from '../globals/constants';
import ls from 'local-storage';

import img_catch from '../img/connect-wallet/catch.jpg';
import img_metamask from '../img/connect-wallet/metamask.png';
import img_bsc_wallet from '../img/connect-wallet/binance_chain_wallet.png';
import config from '../globals/config';
import { withTranslation } from 'react-i18next';

function ConnectWalletFn ({ t, i18n }) {
    const metamask_wallet = useWallet();

    ChangeClass('connect-wallet');

    function Connect_metamask() {
        if (window.ethereum == undefined) {
            alert(t("Please install metamask"));
            return;
        }

        if (parseInt(window.ethereum.chainId) != config.chain_id) {
            alert(t("Please select ethereum or bsc network on metamask"));
            return false;
        }

        window.ethereum.enable()
        .then((res) => {
            ls.set(constants.local_storage_key.KEY_CONNECTED, 1);
            window.location.reload();
        })
        .catch((err) => {
            ls.clear();
        });
    }

    return (

        <div>
            <div id="cw-head" className="cw-head">
                <div className="content">
                    <div className="cw-head-row">
                        <h2 className="cw-head-ttl">
                            <a href="/"><i className="fas fa-long-arrow-alt-left"></i></a>
                            {t('Connect your wallet')}
                        </h2>
                    </div>
                </div>
            </div>

            <div id="cw-body" calss="cw-body">
                <div className="content">
                    <div className="cw-body-inner">
                        <div className="cw-body-menu">
                            <ul className="cw-body-menu-list">
                                <li className="cw-body-menu-item">
                                    <a onClick={() => Connect_metamask() }>
                                        <div className="cw-body-menu-icon icon-01">
                                            <img src={img_metamask} className="fas fa-wallet"/>
                                        </div>
                                        <span>{t('MetaMask')}</span>
                                    </a>
                                </li>

                                {/* <li className="cw-body-menu-item">
                                    <a href="/connect-wallet-02.html">
                                        <div className="cw-body-menu-icon icon-02">
                                            <img src={img_bsc_wallet} className="fas fa-wallet"/>
                                        </div>
                                        <span>Binance Chain Wallet</span>
                                    </a>
                                </li>

                                <li className="cw-body-menu-item">
                                    <a href="#">
                                        <div className="cw-body-menu-icon icon-03">
                                            <i className="fas fa-wallet"></i>
                                        </div>
                                        <span>MyEtherWallet</span>
                                    </a>
                                </li>

                                <li className="cw-body-menu-item">
                                    <a href="#">
                                        <div className="cw-body-menu-icon icon-04">
                                            <i className="fas fa-wallet"></i>
                                        </div>
                                        <span>Wallet Connect</span>
                                    </a>
                                </li> */}
                            </ul>
                        </div>
                        <div className="cw-body-content">
                            <div className="cw-body-catch">
                                <img src={img_catch} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(ConnectWalletFn)