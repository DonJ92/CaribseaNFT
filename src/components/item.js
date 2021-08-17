import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import Web3 from 'web3';
import {AddClass, ChangeClass} from '../js/common';
import * as API from '../adapter/api';
import config from '../globals/config';
import CONST, { protocol_type, token_status } from '../globals/constants';
import BalanceUtil from '../common/balance_util';
import ERC721 from '../contract/ERC721.json';
import ERC1155 from '../contract/ERC1155.json'
import EXCHANGE from '../contract/Exchange.json';
import EXCHANGEERC1155 from '../contract/ExchangeERC1155.json';
import ContractUtil from '../common/contract_util';
import AllTokens from '../globals/support_tokens';
import AssetUtils from '../common/asset_util';
import network_util from '../common/network_util';
import CARIBMARS from '../contract/CARIBMARS.json';
import $ from 'jquery';
import ls from 'local-storage';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, ReferenceArea,
    ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
    Label, LabelList } from 'recharts';
import provider_util from '../common/provider_util';
import base64 from 'base-64';
import {Timeline, Tweet} from 'react-twitter-widgets';
import YouTube from 'react-youtube';
import BASE64 from '../common/BASE64';

import mv from '../img/item/mv.png';
import icon_avatar_01 from '../img/common/icon-avatar-01.png';
import icon_congratulation from '../img/common/congratulation.png';
import { withTranslation } from 'react-i18next';
import support_networks from '../globals/support_networks';

class Item extends React.Component {
    constructor(props) {
        super(props);

        // var script = document.createElement('script');
        // script.src = './js/page/item.js';
        // script.async = false;
        // document.body.appendChild(script);

        ChangeClass('item');
        AddClass('has-popup');

        this.state = {
            selectedAddress: null,
            token_info: null,
            selected_tab: CONST.item_selected_tab.INFO,
            balance : 0,
            transfer_fee: 0,
            show_transfer_notice: true,
            transfer_to_address: null,
            transfer_amount: 1,
            sell_type: CONST.token_status.FIXED_PRICE,
            show_sell_notice: true,
            sell_price: 0,
            sale_amount: 1,
            burn_amount: 1,
            buy_tx_id: '...',
            selected_asset: 'BNB',
            bid_asset_balance: 0,
            bid_asset_name: 'BNB',
            show_bid_notice: true,
            bid_amount: 0,
            is_already_bid: false,
            sale_asset: 'BNB',
            is_like: false,
            tick_usd_price: 0,
            tick_bid_asset_price: 0,
            show_loading: true,
            profile: null,
            fee_distributions: [],
            chart_data: [],
            all_tick: [],
            support_tokens: {}
        };
    }

    componentDidMount() {
        this.showLoading();
        // this.getAccount();
        this.tickPrice();
        this.getAllTick();
        this.getAccount();
        setInterval(this.tickPrice.bind(this), 3000);
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

    tickPrice() {
        if (this.state.token_info != null) {
            if (this.state.token_info.token.chain_id == support_networks.ETHEREUM) {
                API.get_tick("ETHUSDT")
                .then((res) => {
                    this.setState({
                        tick_usd_price: parseFloat(res.price)
                    });
                })
            } else if (this.state.token_info.token.chain_id == support_networks.BSC) {
                API.get_tick("BNBUSDT")
                .then((res) => {
                    this.setState({
                        tick_usd_price: parseFloat(res.price)
                    });
                })
            }
        }

        if (this.state.token_info != null) {
            var symbol = AssetUtils.get_tick_symbol_by_id(this.state.token_info.token.auction_asset_id, this.state.token_info.token.chain_id);

            if (symbol != null) {
                API.get_tick(symbol)
                .then((res) => {
                    this.setState({
                        tick_bid_asset_price: parseFloat(res.price)
                    });
                });
            }
        }
    }

    getAllTick() {
        API.get_all_tick()
        .then((res) => {
            this.setState( {
                all_tick: res
            });
        })
        .catch((err) => {
            console.log(err);
        })
    }

    getPrice(symbol) {
        if (symbol == "BNBWBNB") return 1;

        for (var i = 0; i < this.state.all_tick.length; i++) {
            if (this.state.all_tick[i].symbol == symbol) {
                return this.state.all_tick[i].price;
            }
        }

        return 0;
    }

    async getAccount() {
        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            this.getTokenInfo();
            return;
        }

        const web3 = new Web3(provider);
        web3.eth.getAccounts((error,result) => {
            if (error) {
                console.log(error);

                this.getTokenInfo();
            } else {
                if (result.length < 1) {
                    this.setState({
                        selectedAddress: null
                    });

                    this.getTokenInfo();
                } else {
                    this.setState({
                        selectedAddress: result[0]
                    });

                    web3.eth.getBalance(this.state.selectedAddress, (err, balance) => {
                        if (balance != null) {
                            this.setState({
                                balance: web3.utils.fromWei(balance, "ether")
                            });
                        }
                    });

                    API.get_profile(this.state.selectedAddress)
                    .then((res) => {
                        console.log(res);
                        this.setState({
                            profile: res.profile
                        });

                        this.getTokenInfo();
                    })

                    // this.getTransferFee();
                }
            }
        });
    }

    async getTokenInfo() {
        API.get_token_info(this.props.id)
        .then(async (res) => {console.log(res);
            if (res.result) {
                this.setState({
                    token_info: res.info
                });

                if (res.info.token.chain_id == support_networks.ETHEREUM) {
                    this.setState({
                        support_tokens: AllTokens.ETHEREUM,
                        selected_asset: 'ETH'
                    });
                } else if (res.info.token.chain_id == support_networks.BSC) {
                    this.setState({
                        support_tokens: AllTokens.BSC,
                        selected_asset: 'BNB'
                    });
                }

                var chart_data = [];
                for (var i = 0; i < res.info.history.length; i++) {
                    var item = null;

                    var tx_date = res.info.history[i].updated_at.split('.')[0];
                    tx_date = tx_date.replace('T', ' ');
                    if (res.info.history[i].tx_type == CONST.tx_type.BUY) {
                        if (res.info.history[i].token_type == CONST.protocol_type.ERC721) {
                            item = {
                                date: tx_date,
                                price: res.info.history[i].amount
                            };
                        } else if (res.info.history[i].token_type == CONST.protocol_type.ERC1155) {
                            item = {
                                date: tx_date,
                                price: res.info.history[i].amount / res.info.history[i].token_cnt
                            };
                        }
                    } else if (res.info.history[i].tx_type == CONST.tx_type.EXCHANGE) {
                        if (res.info.history[i].token_type == CONST.protocol_type.ERC721) {
                            item = {
                                date: tx_date,
                                price: res.info.history[i].amount
                            };
                        } else if (res.info.history[i].token_type == CONST.protocol_type.ERC1155) {
                            item = {
                                date: tx_date,
                                price: res.info.history[i].amount / res.info.history[i].token_cnt
                            };
                        }

                        var symbol = "BNB" + AssetUtils.get_asset_by_id(res.info.history[i].asset_id);
                        var price = this.getPrice(symbol);

                        if (price == 0) {
                            item.price = 0;
                        } else {
                            item.price = Number(item.price / price).toFixed(2);
                        }
                    }

                    if (item != null) {
                        chart_data.push(item);
                    }
                }

                this.setState({
                    chart_data: chart_data
                });
                
                if (res.info.token.type == CONST.protocol_type.ERC721) {
                    API.get_fee_distribution(res.info.token.token_contract_id)
                    .then((res) => {
                        if (res.result) {
                            this.setState({
                                fee_distributions: res.distributions
                            });
            
                            this.initFeeDistributionPopup();
                            this.getLike();
                        }
                    })
                } else {
                    API.get_erc1155_fee_distribution(res.info.token.token_contract_id, res.info.token.token_id)
                    .then((res) => {
                        if (res.result) {
                            this.setState({
                                fee_distributions: res.distributions
                            });
            
                            this.initFeeDistributionPopup();
                            this.getLike();
                        }
                    })
                }

                if (res.info.token.status == CONST.token_status.AUCTION) {
                    this.setState({
                        bid_asset_name: AssetUtils.get_asset_by_id(res.info.token.auction_asset_id)
                    });

                    if (this.state.selectedAddress == null) {
                        return;
                    }

                    var provider = await provider_util.get_current_provider();

                    if (provider == null) {
                        return;
                    }

                    const web3 = new Web3(provider);

                    const ASSET = new web3.eth.Contract(ContractUtil.get_abi(res.info.token.auction_asset_id, this.state.token_info.token.chain_id), res.info.token.auction_asset_id);
                    ASSET.methods.balanceOf(this.state.selectedAddress).call({from : this.state.selectedAddress})
                    .then((res) => {
                        this.setState({
                            bid_asset_balance: web3.utils.fromWei(res, "ether")
                        })
                    });
                }

                for (var i = 0; i < res.info.bids.length; i++) {
                    if (res.info.bids[i].address == this.state.selectedAddress) {
                        this.setState({
                            is_already_bid: true
                        });
                        break;
                    }
                };
            }
        });
    }

    getLike() {
        if (this.state.selectedAddress == null) {
            this.hideLoading();
            return;
        }

        API.is_like(this.state.selectedAddress, this.state.token_info.token.token_contract_id, this.state.token_info.token.token_id)
        .then((res) => {
            this.setState({
                is_like: res.result
            });

            this.hideLoading();
        })
    }

    initFeeDistributionPopup() {
        this.state.fee_distributions.forEach((item) => {
            var tr = document.createElement('tr');
            tr.innerHTML= '<td>' + 
                    '<input id="price" class="fee" type="text"  placeholder="Please input the wallet address." autoComplete="off" value="' + item.address + '"/>' + 
                    '</td>' + 
                    '<td style="padding-left: 10px">' + 
                    '<input id="price" class="fee" type="number" min="0" max="100" placeholder="0" autoComplete="off" value="' + item.fee_percentage + '"/>' + 
                    '</td>';
            document.getElementById("fee_distribution_tbody").appendChild(tr);
        })
    }

    handleAddFeeDistribution() {
        var tr = document.createElement('tr');
        tr.innerHTML= '<td>' + 
                '<input id="price" class="fee" type="text"  placeholder="Please input the wallet address." autoComplete="off"/>' + 
                '</td>' + 
                '<td style="padding-left: 10px">' + 
                '<input id="price" class="fee" type="number" min="0" max="100" placeholder="0" autoComplete="off"/>' + 
                '</td>';

        document.getElementById("fee_distribution_tbody").appendChild(tr);
    }

    handleRemoveFeeDistribution() {
        if ($("#fee_distribution_tbody").children().length == 1) {
            return;
        }

        $("#fee_distribution_tbody").children().last().remove();
    }

    validFeeDistribution() {
        const { t } = this.props;
        var trs = $("#fee_distribution_tbody").children();
        var total = 0;

        var fee_receivers = [];
        var fee_percentages = [];

        var ret = {
            valid: false,
            fee_receivers: [],
            fee_percentages: []
        };

        for (var i = 0; i < trs.length; i++) {
            var address = trs[i].childNodes[0].children[0].value;
            var fee_percentage = trs[i].childNodes[1].children[0].value;

            if (address == "") {
                alert(t("Please input receiver address."));
                return ret;
            }

            try {
                fee_percentage = parseInt(fee_percentage);

                if (fee_percentage <= 0 || fee_percentage > 100) {
                    alert(t("Please input valid percentage."));
                    return ret;
                }

                total += fee_percentage;
            } catch {
                alert(t("Please input decimal percentage."));
                return ret;
            }

            fee_receivers.push(address);
            fee_percentages.push(fee_percentage);
        }

        if (total != 100) {
            alert(t("The sum of percentage must be 100."));
            return ret;
        }

        ret.valid = true;
        ret.fee_receivers = fee_receivers;
        ret.fee_percentages = fee_percentages;
        return ret;
    }

    async handleFeeDistribution() {
        const { t } = this.props;
        var validResult = this.validFeeDistribution();

        if (!validResult.valid) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        var distributions = [];
        for (var i = 0; i < validResult.fee_receivers.length; i++) {
            var distribution = {
                address: validResult.fee_receivers[i],
                fee_percentage: validResult.fee_percentages[i]
            };

            distributions.push(distribution);
        }

        if (this.state.token_info.token.type == CONST.token_type.ERC721) {
            const NFT = new web3.eth.Contract(ERC721.abi, this.state.token_info.token.token_contract_id);
            NFT.methods.setFeeDistributionPercentage(
                validResult.fee_receivers,
                validResult.fee_percentages
            ).send({from: this.state.selectedAddress})
            .on('error', () => this.callbackError(t('An error occured while setting fee distribution.')))
            .then((res) => {console.log(res);
                API.set_fee_distribution(this.state.token_info.token.token_contract_id, distributions)
                .then((res) => {
                    this.hideLoading();
    
                    if (res.result) {
                        document.location.reload();
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.hideLoading();
                });
            });
        } else {
            var ERC1155Distributions = [];
            for (var i = 0; i < validResult.fee_receivers.length; i++) {
                var distribution = [];
                distribution.push(validResult.fee_receivers[i]);
                distribution.push(validResult.fee_percentages[i])

                ERC1155Distributions.push(distribution);
            }
            
            const NFT = new web3.eth.Contract(ERC1155, this.state.token_info.token.token_contract_id);
            NFT.methods.setCopyRightFeeDistribution(
                this.state.token_info.token.token_id,
                ERC1155Distributions
            ).send({from: this.state.selectedAddress})
            .on('error', () => this.callbackError(t('An error occured while setting fee distribution.')))
            .then((res) => {console.log(res);
                API.set_erc1155_fee_distribution(this.state.token_info.token.token_contract_id, this.state.token_info.token.token_id, distributions)
                .then((res) => {
                    this.hideLoading();
    
                    if (res.result) {
                        document.location.reload();
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.hideLoading();
                });
            });
        }
    }

    // getTransferFee() {
    //     const web3 = new Web3(Web3.givenProvider);

    //     const NFT = new web3.eth.Contract(ERC721.abi, this.state.token_info.token.token_contract_id);
    //     NFT.methods.transferFrom(this.state.selectedAddress, this.state.selectedAddress, this.state.token_info.token.token_id).estimateGas({from: this.state.selectedAddress})
    //     .then((gasAmount) => {console.log(gasAmount);
    //         this.setState({
    //             transfer_fee: web3.utils.fromWei(gasAmount + '', "ether")
    //         });
    //     });
    // }
    
    handleTabSelect(selected_tab) {
        this.setState({
            selected_tab: selected_tab
        });
    }

    handleTransferAddress() {
        var address = document.getElementById("transfer_receiver").value;
        if (address.length != 42) {
            this.setState({
                show_transfer_notice: true,
                transfer_to_address: null
            });
        } else if (address == this.state.selectedAddress) {
            this.setState({
                show_transfer_notice: true,
                transfer_to_address: null
            });
        } else {
            API.get_profile(address)
            .then((res) => {
                if (res.result == true) {
                    this.setState({
                        show_transfer_notice: false,
                        transfer_to_address: address
                    });
                }
            })
        }
    }

    async isCorrectNetwork() {
        const { t } = this.props;
        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        var chain_id = await web3.eth.net.getId();
        if (chain_id != this.state.token_info.token.chain_id) {
            alert(t('Please select correct network.'));
            return false;
        }

        return true;
    }

    async handleTransfer() {
        const { t } = this.props;
        if (!await this.isCorrectNetwork()) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const NFT = new web3.eth.Contract(ERC721.abi, this.state.token_info.token.token_contract_id);
        NFT.methods.transferFrom(this.state.selectedAddress, this.state.transfer_to_address, this.state.token_info.token.token_id).send({from: this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while sending token.')))
        .then((res) => {console.log(res);
            API.transfer_token(this.state.token_info.token.token_contract_id, this.state.token_info.token.token_id, this.state.selectedAddress, this.state.transfer_to_address)
            .then((res) =>{
                if (res.result) {
                    window.location = config.host_url + '/profile/' + this.state.selectedAddress;
                }
            })
        });
    }

    async handleERC1155Transfer() {
        const { t } = this.props;
        if (!await this.isCorrectNetwork()) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const NFT = new web3.eth.Contract(ERC1155, this.state.token_info.token.token_contract_id);
        NFT.methods.safeTransferFrom(this.state.selectedAddress, this.state.transfer_to_address, this.state.token_info.token.token_id, this.state.transfer_amount).send({from: this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while sending token.')))
        .then((res) => {console.log(res);
            API.transfer_erc1155_token(this.props.id, this.state.selectedAddress, this.state.transfer_to_address, this.state.transfer_amount)
            .then((res) =>{
                if (res.result) {
                    window.location = config.host_url + '/profile/' + this.state.selectedAddress;
                }
            })
        });
    }

    handleSellType() {
        if (this.state.sell_type == CONST.token_status.FIXED_PRICE) {
            this.setState({
                sell_type: CONST.token_status.AUCTION
            });
            document.getElementById("uic-chk-fixed-price").checked = false;
            document.getElementById("uic-chk-auction").checked = true;
            if (this.state.token_info.token.chain_id == support_networks.ETHEREUM) {
                this.updateBalanceByAsset(this.state.support_tokens.WETH);
            } else if (this.state.token_info.token.chain_id == support_networks.BSC) {
                this.updateBalanceByAsset(this.state.support_tokens.WBNB);
            }
        } else {
            this.setState({
                sell_type: CONST.token_status.FIXED_PRICE
            });
            document.getElementById("uic-chk-fixed-price").checked = true;
            document.getElementById("uic-chk-auction").checked = false;
            if (this.state.token_info.token.chain_id == support_networks.ETHEREUM) {
                this.updateBalanceByAsset("ETH");
            } else if (this.state.token_info.token.chain_id == support_networks.BSC) {
                this.updateBalanceByAsset("BNB");
            }
        }
    }

    handleERC1155SellType() {
        if (this.state.sell_type == CONST.token_status.FIXED_PRICE) {
            this.setState({
                sell_type: CONST.token_status.AUCTION
            });
            document.getElementById("uic-chk-erc1155-fixed-price").checked = false;
            document.getElementById("uic-chk-erc1155-auction").checked = true;
            if (this.state.token_info.token.chain_id == support_networks.ETHEREUM) {
                this.updateBalanceByAsset(this.state.support_tokens.WETH);
            } else if (this.state.token_info.token.chain_id == support_networks.BSC) {
                this.updateBalanceByAsset(this.state.support_tokens.WBNB);
            }
        } else {
            this.setState({
                sell_type: CONST.token_status.FIXED_PRICE
            });
            document.getElementById("uic-chk-erc1155-fixed-price").checked = true;
            document.getElementById("uic-chk-erc1155-auction").checked = false;

            if (this.state.token_info.token.chain_id == support_networks.ETHEREUM) {
                this.updateBalanceByAsset("ETH");
            } else if (this.state.token_info.token.chain_id == support_networks.BSC) {
                this.updateBalanceByAsset("BNB");
            }
        }
    }

    handlePriceChange() {
        if (document.getElementById("price").value != "" && !isNaN(document.getElementById("price").value) && parseFloat(document.getElementById("price").value) != 0) {
            this.setState({
                show_sell_notice: false,
                sell_price: parseFloat(document.getElementById("price").value)
            });
        } else {
            this.setState({
                show_sell_notice: true
            });
        }
    }

    sellRequest() {
        const { t } = this.props;
        var asset_id = 'NONE';
        if (this.state.sell_type == CONST.token_status.AUCTION) {
            asset_id = document.getElementById("sale_asset").value;
        }

        API.sell_token(this.props.id, this.state.sell_type, this.state.sell_price, asset_id)
        .then((res) =>{console.log(res);
            this.hideLoading();

            if (res.result) {
                document.location.reload();
            } else {
                this.callbackError(t('An error occured while ordering.'));
            }
        });
    }

    ERC1155SellRequest() {
        var asset_id = 'NONE';
        if (this.state.sell_type == CONST.token_status.AUCTION) {
            asset_id = document.getElementById("erc1155_sale_asset").value;
        }

        API.sell_erc1155_token(this.props.id, this.state.sell_type, this.state.sell_price, asset_id, this.state.sale_amount)
        .then((res) =>{console.log(res);
            this.hideLoading();

            if (res.result) {
                window.location = config.host_url + "/profile/" + this.state.selectedAddress;
            }
        });
    }

    async handleApprove() {
        const { t } = this.props;

        if (!this.isElementEnabled("sell_approve")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return false;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const NFT = new web3.eth.Contract(ERC721.abi, this.state.token_info.token.token_contract_id);
        NFT.methods.approve(network_util.get_erc721_transfer_proxy_address(this.state.token_info.token.chain_id), this.state.token_info.token.token_id).send({from: this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while approving token.')))
        .then((res) => {
            this.hideLoading();
            document.getElementById("sell_approve").classList.add('btn-ready');
            document.getElementById("sell_order").classList.remove('btn-ready');
        });
    }

    async handleERC1155Approve() {
        const { t } = this.props;

        if (!this.isElementEnabled("erc1155_sell_approve")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!await this.isCorrectNetwork()) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const NFT = new web3.eth.Contract(ERC1155, network_util.get_erc1155(this.state.token_info.token.chain_id));
        NFT.methods.approve(this.state.token_info.token.token_id, this.state.sale_amount, network_util.get_exchange_erc1155(this.state.token_info.token.chain_id)).send({from: this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while approving token.')))
        .then((res) => {console.log(res);
            this.hideLoading();
            document.getElementById("erc1155_sell_approve").classList.add('btn-ready');
            document.getElementById("erc1155_sell_order").classList.remove('btn-ready');
        });
    }

    async handleSellRequest() {
        const { t } = this.props;
        if (!this.isElementEnabled("sell_order")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!await this.isCorrectNetwork()) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGE.abi, network_util.get_exchange(this.state.token_info.token.chain_id));

        if (this.state.sell_type == CONST.token_status.AUCTION) {
            Exchange.methods.AuctionRequest(this.state.token_info.token.token_contract_id, this.state.token_info.token.token_id, document.getElementById("sale_asset").value)
            .send({from: this.state.selectedAddress, value:Web3.utils.toWei(config.listing_fee + '', 'ether')})
            .on('error', () => this.callbackError(t('An error occured while ordering.')))
            .then((res) => {console.log(res);
                this.sellRequest();
            });
        } else {
            Exchange.methods.BuyRequest(this.state.token_info.token.token_contract_id, this.state.token_info.token.token_id, Web3.utils.toWei(this.state.sell_price + '', 'ether'))
            .send({from: this.state.selectedAddress, value:Web3.utils.toWei(config.listing_fee + '', 'ether')})
            .on('error', () => this.callbackError(t('An error occured while ordering.')))
            .then((res) => {console.log(res);
                this.sellRequest();
            });
        }
    }

    async handleERC1155SellRequest() {
        const { t } = this.props;
        if (!this.isElementEnabled("erc1155_sell_order")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return false;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGEERC1155.abi, network_util.get_exchange_erc1155(this.state.token_info.token.chain_id));

        if (this.state.sell_type == CONST.token_status.AUCTION) {
            Exchange.methods.AuctionERC1155Request(this.state.token_info.token.token_id, this.state.sale_amount, document.getElementById("erc1155_sale_asset").value)
            .send({from: this.state.selectedAddress, value:Web3.utils.toWei(config.listing_fee + '', 'ether')})
            .on('error', () => this.callbackError(t('An error occured while ordering.')))
            .then((res) => {console.log(res);
                this.ERC1155SellRequest();
            });
        } else {
            Exchange.methods.BuyERC1155Request(this.state.token_info.token.token_id, this.state.sale_amount, Web3.utils.toWei(this.state.sell_price + '', 'ether'))
            .send({from: this.state.selectedAddress, value:Web3.utils.toWei(config.listing_fee + '', 'ether')})
            .on('error', () => this.callbackError(t('An error occured while ordering.')))
            .then((res) => {console.log(res);
                this.ERC1155SellRequest();
            });
        }
    }

    async handlePurchase() {
        const { t } = this.props;
        if (!this.isElementEnabled("popup-purchase-01")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGE.abi, network_util.get_exchange(this.state.token_info.token.chain_id));
        Exchange.methods.buy(
            this.state.token_info.token.token_contract_id,
            this.state.token_info.token.token_id,
            this.state.token_info.owner.address,
            Web3.utils.toWei(this.state.token_info.token.price + '', 'ether'),
            this.state.selectedAddress
        ).send({from: this.state.selectedAddress, value: Web3.utils.toWei(this.state.token_info.token.price + '', 'ether')})
        .on('error', () => this.callbackError(t('An error occured while purchasing token.')))
        .then((res) => {console.log(res);
            this.setState({
                buy_tx_id: res.transactionHash
            });
            API.buy_token(this.props.id, this.state.token_info.token.owner, this.state.selectedAddress, this.state.token_info.token.price)
            .then((res) => {console.log(res);
                this.hideLoading();
                document.getElementById("popup-purchase-02").click();
            })
        })
    }

    async handleERC1155Purchase() {
        const { t } = this.props;
        if (!this.isElementEnabled("popup-erc1155-purchase-01")) {
            return false;
        }

        if (!await this.isConnected()) return;

        
        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGEERC1155.abi, network_util.get_exchange_erc1155(this.state.token_info.token.chain_id));
        Exchange.methods.buyERC1155(
            this.state.token_info.token.token_id,
            this.state.token_info.token.owned_cnt,
            this.state.token_info.owner.address,
            Web3.utils.toWei(this.state.token_info.token.price + '', 'ether'),
            this.state.selectedAddress
        ).send({from: this.state.selectedAddress, value: Web3.utils.toWei(this.state.token_info.token.price + '', 'ether')})
        .on('error', () => this.callbackError(t('An error occured while purchasing token.')))
        .then((res) => {console.log(res);
            this.setState({
                buy_tx_id: res.transactionHash
            });
            API.buy_erc1155_token(this.props.id, this.state.token_info.token.owner, this.state.selectedAddress, this.state.token_info.token.price)
            .then((res) => {console.log(res);
                this.hideLoading();
                document.getElementById("popup-purchase-02").click();
            })
        })
    }

    handleSaleAssetChanged() {
        const web3 = new Web3(Web3.givenProvider);

        var asset_id = document.getElementById("sale_asset").value;
        this.updateBalanceByAsset(asset_id);
    }

    handleERC1155SaleAssetChanged() {
        const web3 = new Web3(Web3.givenProvider);

        var asset_id = document.getElementById("erc1155_sale_asset").value;
        this.updateBalanceByAsset(asset_id);
    }

    updateBalanceByAsset(asset_id) {
        const web3 = new Web3(Web3.givenProvider);

        if (asset_id == "BNB" || asset_id == "ETH") {
            this.setState({
                selected_asset: asset_id
            });

            web3.eth.getBalance(this.state.selectedAddress, (err, balance) => {
                this.setState({
                    balance: web3.utils.fromWei(balance, "ether")
                });
            });
        } else {
            var asset_name = AssetUtils.get_asset_by_id(asset_id);

            this.setState({
                selected_asset: asset_name
            });

            const ASSET = new web3.eth.Contract(ContractUtil.get_abi(asset_id, this.state.token_info.token.chain_id), asset_id);
            ASSET.methods.balanceOf(this.state.selectedAddress).call({from : this.state.selectedAddress})
            .then((res) => {
                this.setState({
                    balance: web3.utils.fromWei(res, "ether")
                })
            });
        }
    }

    handleBidAmountChanged() {
        if (document.getElementById("bid_price").value != "" && !isNaN(document.getElementById("bid_price").value) && parseFloat(document.getElementById("bid_price").value) >= this.state.token_info.token.price) {
            this.setState({
                show_bid_notice: false,
                bid_amount: parseFloat(document.getElementById("bid_price").value)
            });
        } else {
            this.setState({
                show_bid_notice: true
            });
        }
    }

    handleERC1155BidAmountChanged() {
        if (document.getElementById("erc1155_bid_price").value != "" && !isNaN(document.getElementById("erc1155_bid_price").value) && parseFloat(document.getElementById("erc1155_bid_price").value) >= this.state.token_info.token.price) {
            this.setState({
                show_bid_notice: false,
                bid_amount: parseFloat(document.getElementById("erc1155_bid_price").value)
            });
        } else {
            this.setState({
                show_bid_notice: true
            });
        }
    }

    async handleBidApprove() {
        const { t } = this.props;
        if (!this.isElementEnabled("bid_approve")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        API.get_total_bid_amount(this.state.selectedAddress, this.state.token_info.token.auction_asset_id)
        .then((res) => {
            if (res.result) {
                const web3 = new Web3(Web3.givenProvider);

                const ASSET = new web3.eth.Contract(ContractUtil.get_abi(this.state.token_info.token.auction_asset_id, this.state.token_info.token.chain_id), this.state.token_info.token.auction_asset_id);
                ASSET.methods.approve(network_util.get_erc20_transfer_proxy(this.state.token_info.token.chain_id), Web3.utils.toWei((res.total + this.state.bid_amount) + '', 'ether')).send({from : this.state.selectedAddress})
                .on('error', () => this.callbackError(t('An error occured while approving token.')))
                .then((res) => {console.log(res);
                    this.hideLoading();
                    document.getElementById("bid_approve").classList.add('btn-ready');
                    document.getElementById("bid_request").classList.remove('btn-ready');
                });
            } else {
                this.hideLoading();
            }
        })
    }

    async handleERC1155BidApprove() {
        const { t } = this.props;
        if (!this.isElementEnabled("erc1155_bid_approve")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        API.get_total_bid_amount(this.state.selectedAddress, this.state.token_info.token.auction_asset_id)
        .then((res) => {
            if (res.result) {
                const web3 = new Web3(Web3.givenProvider);

                const ASSET = new web3.eth.Contract(ContractUtil.get_abi(this.state.token_info.token.auction_asset_id, this.state.token_info.token.chain_id), this.state.token_info.token.auction_asset_id);
                ASSET.methods.approve(network_util.get_erc20_transfer_proxy(this.state.token_info.token.chain_id), Web3.utils.toWei((res.total + this.state.bid_amount) + '', 'ether')).send({from : this.state.selectedAddress})
                .on('error', () => this.callbackError(t('An error occured while approving token.')))
                .then((res) => {console.log(res);
                    this.hideLoading();
                    document.getElementById("erc1155_bid_approve").classList.add('btn-ready');
                    document.getElementById("erc1155_bid_request").classList.remove('btn-ready');
                });
            } else {
                this.hideLoading();
            }
        })
    }

    async handleBidRequest() {
        const { t } = this.props;
        if (!this.isElementEnabled("bid_request")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return false;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGE.abi, network_util.get_exchange(this.state.token_info.token.chain_id));
        Exchange.methods.BidRequest(
            this.state.token_info.token.token_contract_id,
            this.state.token_info.token.token_id,
            this.state.token_info.token.auction_asset_id,
            Web3.utils.toWei(this.state.bid_amount + '', 'ether')
        ).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while requesting a bid.')))
        .then((res) => {console.log(res);
            API.bid_request(
                this.props.id,
                this.state.selectedAddress,
                this.state.token_info.token.auction_asset_id,
                this.state.bid_amount
            ).then((res) => {
                if (res.result) {
                    document.location.reload();
                }
            })
        });
    }

    async handleERC1155BidRequest() {
        const { t } = this.props;
        if (!this.isElementEnabled("erc1155_bid_request")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        console.log(network_util.get_exchange_erc1155(this.state.token_info.token.chain_id));
        console.log(Web3.utils.toWei(this.state.bid_amount + '', 'ether'));
        console.log(this.state.selectedAddress);

        const Exchange = new web3.eth.Contract(EXCHANGEERC1155.abi, network_util.get_exchange_erc1155(this.state.token_info.token.chain_id));
        Exchange.methods.BidERC1155Request(
            this.state.token_info.token.token_id,
            this.state.token_info.token.owned_cnt,
            this.state.token_info.token.auction_asset_id,
            Web3.utils.toWei(this.state.bid_amount + '', 'ether')
        ).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while requesting a bid.')))
        .then((res) => {console.log(res);
            API.erc1155_bid_request(
                this.props.id,
                this.state.selectedAddress,
                this.state.token_info.token.auction_asset_id,
                this.state.bid_amount
            ).then((res) => {
                if (res.result) {
                    document.location.reload();
                }
            })
        });
    }

    async handleBidCancel() {
        const { t } = this.props;
        if (!this.isElementEnabled("bid_cancel_approve")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();
        
        const Exchange = new web3.eth.Contract(EXCHANGE.abi, network_util.get_exchange(this.state.token_info.token.chain_id));
        Exchange.methods.CancelBid(
            this.state.token_info.token.token_contract_id,
            this.state.token_info.token.token_id,
            this.state.token_info.token.auction_asset_id
        ).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while canceling the bid.')))
        .then((res) => {console.log(res);
            API.cancel_bid(
                this.props.id,
                this.state.selectedAddress
            ).then((res) => {
                if (res.result) {
                    document.location.reload();
                }
            })
        });
    }

    async handleERC1155BidCancel() {
        const { t } = this.props;
        if (!this.isElementEnabled("erc1155_bid_cancel_approve")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();
        
        const Exchange = new web3.eth.Contract(EXCHANGEERC1155.abi, network_util.get_exchange_erc1155(this.state.token_info.token.chain_id));
        Exchange.methods.CancelERC1155Bid(
            this.state.token_info.token.token_id,
            this.state.token_info.token.owned_cnt,
            this.state.token_info.token.auction_asset_id
        ).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while canceling the bid.')))
        .then((res) => {console.log(res);
            API.cancel_erc1155_bid(
                this.props.id,
                this.state.selectedAddress
            ).then((res) => {
                if (res.result) {
                    document.location.reload();
                }
            })
        });
    }

    async handleERC1155BidAccept() {
        const { t } = this.props;
        if (!this.isElementEnabled("erc1155_bid_accept_approve")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGEERC1155.abi, network_util.get_exchange_erc1155(this.state.token_info.token.chain_id));
        Exchange.methods.exchangeERC1155(
            this.state.token_info.token.token_id,
            this.state.token_info.token.owned_cnt,
            this.state.selectedAddress,
            this.state.token_info.token.auction_asset_id,
            Web3.utils.toWei(this.state.token_info.bids[0].amount + '', 'ether'),
            this.state.token_info.bids[0].address
        ).send({from: this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while processing the bid.')))
        .then((res) => {console.log(res);
            API.accept_erc1155_bid(this.props.id)
            .then((res) => {
                window.location = config.host_url + "/profile/" + this.state.selectedAddress;
            })
        });
    }

    async handleBidAccept() {
        const { t } = this.props;
        if (!this.isElementEnabled("bid_accept_approve")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGE.abi, network_util.get_exchange(this.state.token_info.token.chain_id));
        Exchange.methods.exchange(
            this.state.token_info.token.token_contract_id,
            this.state.token_info.token.token_id,
            this.state.selectedAddress,
            this.state.token_info.token.auction_asset_id,
            Web3.utils.toWei(this.state.token_info.bids[0].amount + '', 'ether'),
            this.state.token_info.bids[0].address
        ).send({from: this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while processing the bid.')))
        .then((res) => {console.log(res);
            API.accept_bid(this.props.id)
            .then((res) => {
                document.location.reload();
            })
        });
    }

    async handleStakeApprove() {
        const { t } = this.props;
        if (!this.isElementEnabled("stake_approve")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const NFT = new web3.eth.Contract(ERC721.abi, this.state.token_info.token.token_contract_id);
        NFT.methods.approve(network_util.get_erc721_transfer_proxy_address(this.state.token_info.token.chain_id), this.state.token_info.token.token_id).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while approving token.')))
        .then((res) => {console.log(res);
            document.getElementById("stake_approve").classList.add('btn-ready');
            document.getElementById("stake_request").classList.remove('btn-ready');

            this.hideLoading();
        });
    }

    async handleStake() {
        const { t } = this.props;
        if (!this.isElementEnabled("stake_request")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGE.abi, network_util.get_exchange(this.state.token_info.token.chain_id));
        Exchange.methods.stake(this.state.token_info.token.token_contract_id, this.state.token_info.token.token_id).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while staking token.')))
        .then((res) => {console.log(res);
            API.stake_token(this.props.id)
            .then((res) => {
                document.location.reload();
            })
        });
    }

    async handleRevokeApprove() {
        const { t } = this.props;
        if (!this.isElementEnabled("revoke_approve")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Caribmars = new web3.eth.Contract(CARIBMARS, network_util.get_caribmars(this.state.token_info.token.chain_id));
        Caribmars.methods.approve(network_util.get_erc20_transfer_proxy(this.state.token_info.token.chain_id), config.StakingAmount).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while approving token.')))
        .then((res) => {console.log(res);
            document.getElementById("revoke_approve").classList.add('btn-ready');
            document.getElementById("revoke_request").classList.remove('btn-ready');

            this.hideLoading();
        });
    }

    async handleRevoke() {
        const { t } = this.props;
        if (!this.isElementEnabled("revoke_request")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGE.abi, network_util.get_exchange(this.state.token_info.token.chain_id));
        Exchange.methods.clearStake(this.state.token_info.token.token_contract_id, this.state.token_info.token.token_id).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while revoking token.')))
        .then((res) => {console.log(res);
            API.revoke_token(this.props.id)
            .then((res) => {
                document.location.reload();
            })
        });
    }

    async handleFixedPriceFreeeze() {
        const { t } = this.props;
        if (!this.isElementEnabled("remove_fixed_price_freeze")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const NFT = new web3.eth.Contract(ERC721.abi, this.state.token_info.token.token_contract_id);
        NFT.methods.freeApprove(this.state.token_info.token.token_id).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while freezing token.')))
        .then((res) => {console.log(res);
            document.location.reload();
        });
    }

    async handleERC1155FixedPriceFreeeze() {
        const { t } = this.props;
        if (!this.isElementEnabled("remove_erc1155_fixed_price_freeze")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const NFT = new web3.eth.Contract(ERC1155, network_util.get_erc1155(this.state.token_info.token.chain_id));
        NFT.methods.freeze(this.state.token_info.token.token_id, this.state.token_info.token.owned_cnt, network_util.get_exchange_erc1155(this.state.token_info.token.chain_id)).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while freezing token.')))
        .then((res) => {console.log(res);
            window.location = config.host_url + "/profile/" + this.state.selectedAddress;
        });
    }

    async handleFixedPriceRemoveSale() {
        const { t } = this.props;
        if (!this.isElementEnabled("remove_fixed_price_request")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGE.abi, network_util.get_exchange(this.state.token_info.token.chain_id));
        Exchange.methods.CancelBuyRequest(this.state.token_info.token.token_contract_id, this.state.token_info.token.token_id).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while removing sell.')))
        .then((res) => {console.log(res);
            API.remove_sale(this.props.id)
            .then((res) => {
                document.getElementById("remove_fixed_price_request").classList.add('btn-ready');
                document.getElementById("remove_fixed_price_freeze").classList.remove('btn-ready');

                this.hideLoading();
            })
        });
    }

    async handleERC1155FixedPriceRemoveSale() {
        const { t } = this.props;
        if (!this.isElementEnabled("remove_fixed_price_request")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGEERC1155.abi, network_util.get_exchange_erc1155(this.state.token_info.token.chain_id));
        Exchange.methods.CancelBuyERC1155Request(
            this.state.token_info.token.token_id, 
            this.state.token_info.token.owned_cnt,
            Web3.utils.toWei(this.state.token_info.token.price + '', 'ether')
        )
        .send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while removing sell.')))
        .then((res) => {console.log(res);
            API.remove_erc1155_sale(this.props.id)
            .then((res) => {
                if (res.result) {
                    document.getElementById("remove_erc1155_fixed_price_request").classList.add('btn-ready');
                    document.getElementById("remove_erc1155_fixed_price_freeze").classList.remove('btn-ready');

                    this.hideLoading();
                } else {
                    this.callbackError(t('An error occured while removing sell.'));
                }
            })
        });
    }

    async handleAuctionFreeeze() {
        const { t } = this.props;
        if (!this.isElementEnabled("remove_auction_freeze")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const NFT = new web3.eth.Contract(ERC721.abi, this.state.token_info.token.token_contract_id);
        NFT.methods.freeApprove(this.state.token_info.token.token_id).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while sending token.')))
        .then((res) => {console.log(res);
            document.location.reload();
        });
    }

    async handleAuctionRemoveSale() {
        const { t } = this.props;
        if (!this.isElementEnabled("remove_auction_request")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGE.abi, network_util.get_exchange(this.state.token_info.token.chain_id));
        Exchange.methods.CancelAuctionRequests(this.state.token_info.token.token_contract_id, this.state.token_info.token.token_id, this.state.token_info.token.auction_asset_id).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while removing sell.')))
        .then((res) => {console.log(res);
            API.remove_sale(this.props.id)
            .then((res) => {
                document.getElementById("remove_auction_request").classList.add('btn-ready');
                document.getElementById("remove_auction_freeze").classList.remove('btn-ready');

                this.hideLoading();
            })
        });
    }

    async handleERC1155AuctionFreeeze() {
        const { t } = this.props;
        if (!this.isElementEnabled("remove_erc1155_auction_freeze")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const NFT = new web3.eth.Contract(ERC1155, network_util.get_erc1155(this.state.token_info.token.chain_id));
        NFT.methods.freeze(this.state.token_info.token.token_id, this.state.token_info.token.owned_cnt, network_util.get_exchange_erc1155(this.state.token_info.token.chain_id)).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while freezing token.')))
        .then((res) => {console.log(res);
            window.location = config.host_url + "/profile/" + this.state.selectedAddress;
        });
    }

    async handleERC1155AuctionRemoveSale() {
        const { t } = this.props;
        if (!this.isElementEnabled("remove_erc1155_auction_request")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const Exchange = new web3.eth.Contract(EXCHANGEERC1155.abi, network_util.get_exchange_erc1155(this.state.token_info.token.chain_id));
        Exchange.methods.CancelAuctionERC1155Requests(this.state.token_info.token.token_id, this.state.token_info.token.owned_cnt, this.state.token_info.token.auction_asset_id).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while removing sell.')))
        .then((res) => {console.log(res);
            API.remove_erc1155_sale(this.props.id)
            .then((res) => {
                if (res.result) {
                    document.getElementById("remove_erc1155_auction_request").classList.add('btn-ready');
                    document.getElementById("remove_erc1155_auction_freeze").classList.remove('btn-ready');

                    this.hideLoading();
                } else {
                    this.callbackError(t('An error occured while removing sell.'))
                }
            })
        });
    }

    async handleBurn() {
        const { t } = this.props;
        if (!this.isElementEnabled("burn_token")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const NFT = new web3.eth.Contract(ERC721.abi, this.state.token_info.token.token_contract_id);
        NFT.methods.burn(this.state.token_info.token.token_id).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while burning token.')))
        .then((res) => {console.log(res);
            API.burn_token(this.props.id)
            .then((res) => {
                if (res.result) {
                    window.location = config.host_url + "/profile/" + this.state.selectedAddress;
                } else {
                    this.callbackError(t('An error occured while burning token.'))
                }
            })
        });
    }

    async handleERC1155Burn() {
        const { t } = this.props;
        if (!this.isElementEnabled("burn_erc1155_token")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        this.showLoading();

        const NFT = new web3.eth.Contract(ERC1155, network_util.get_erc1155(this.state.token_info.token.chain_id));
        NFT.methods.burn(this.state.selectedAddress, this.state.token_info.token.token_id, this.state.burn_amount).send({from : this.state.selectedAddress})
        .on('error', () => this.callbackError(t('An error occured while burning token.')))
        .then((res) => {console.log(res);
            API.burn_erc1155_token(this.props.id, this.state.burn_amount)
            .then((res) => {
                if (res.result) {
                    window.location = config.host_url + "/profile/" + this.state.selectedAddress;
                } else {
                    this.callbackError(t('An error occured while burning token.'))
                }
            })
        });
    }

    handleLike() {
        if (this.state.is_like) {
            this.setState({
                is_like: false
            });

            API.remove_like(this.state.selectedAddress, this.state.token_info.token.token_contract_id, this.state.token_info.token.token_id)
            .then((res) => {
                console.log(res);
            })
        } else {
            this.setState({
                is_like: true
            });

            API.add_like(this.state.selectedAddress, this.state.token_info.token.token_contract_id, this.state.token_info.token.token_id)
            .then((res) => {
                console.log(res);
            })
        }
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    isElementEnabled(id) {
        var element = document.getElementById(id);
        if (element.classList.contains("btn-ready")) {
            return false;
        }
        return true;
    }

    async isConnected() {
        const { t } = this.props;
        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return false;
        }

        const web3 = new Web3(provider);

        var accounts = await web3.eth.getAccounts();
        if (accounts.length == 0) {
            alert(t("Please connect the wallet"));
            return false;
        }
        return true;
    }

    callbackError(msg) {
        alert(msg);

        this.hideLoading();
    }

    verifyERC1155Transfer() {
        var receiver = document.getElementById("transfer_erc1155_receiver").value;
        var amount = document.getElementById("transfer_erc1155_amount").value;

        if (receiver.length != 42) {
            $("#transfer-erc1155-verify-notice").css('display', 'flex');
            $("#transfer-erc1155-receiver-not-correct").css('display', 'block');
        } else if (receiver == this.state.selectedAddress) {
            $("#transfer-erc1155-verify-notice").css('display', 'flex');
            $("#transfer-erc1155-receiver-not-correct").css('display', 'block');
        } else {
            API.get_profile(receiver)
            .then((res) => {
                if (res.result == true) {
                    $("#transfer-erc1155-receiver-not-correct").css('display', 'none');

                    if ($("#transfer-erc1155-receiver-not-correct").css('display') == 'none' && $("#transfer-erc1155-amount-not-correct").css('display') == "none") {
                        $("#transfer-erc1155-verify-notice").css('display', 'none');

                        this.setState({
                            transfer_to_address: receiver
                        });
                    }
                } else {
                    $("#transfer-erc1155-verify-notice").css('display', 'flex');
                    $("#transfer-erc1155-receiver-not-correct").css('display', 'block');
                }
            })
        }

        try {
            var tempAmount = parseInt(amount);

            if (tempAmount != amount) {
                throw new Error('not integer');
            }

            amount = tempAmount;

            if (amount > this.state.token_info.token.owned_cnt || amount < 1) {
                $("#transfer-erc1155-verify-notice").css('display', 'flex');
                $("#transfer-erc1155-amount-not-correct").css('display', 'block');
            } else {
                $("#transfer-erc1155-amount-not-correct").css('display', 'none');

                this.setState({
                    transfer_amount: amount
                });
            }
        } catch (err) {
            $("#transfer-erc1155-verify-notice").css('display', 'flex');
            $("#transfer-erc1155-amount-not-correct").css('display', 'block');
        }
    }

    verifyERC1155Sale() {
        var price = document.getElementById("sale_erc1155_price").value;
        var amount = document.getElementById("sale_erc1155_amount").value;

        try {
            var tempAmount = parseInt(amount);

            if (tempAmount != amount) {
                throw new Error('not integer');
            }

            amount = tempAmount;

            if (amount > this.state.token_info.token.owned_cnt || amount < 1) {
                $("#sale-erc1155-verify-notice").css('display', 'flex');
                $("#sale_erc1155_amount_not_correct").css('display', 'block');
            } else {
                $("#sale_erc1155_amount_not_correct").css('display', 'none');

                this.setState({
                    sale_amount: amount
                });
            }
        } catch (err) {
            $("#sale-erc1155-verify-notice").css('display', 'flex');
            $("#sale_erc1155_amount_not_correct").css('display', 'block');
        }

        try {
            var tempPrice = parseFloat(price);

            if (tempPrice != price) {
                throw new Error('not integer');
            }

            price = tempPrice;

            if (price <= 0) {
                throw new Error('price must be greater than zero.');
            }

            this.setState({
                sell_price: price
            });

            $("#sale_erc1155_price_not_correct").css('display', 'none');
        } catch (err) {
            $("#sale-erc1155-verify-notice").css('display', 'flex');
            $("#sale_erc1155_price_not_correct").css('display', 'block');
        }

        if ($("#sale_erc1155_price_not_correct").css('display') == 'none' && $("#sale_erc1155_amount_not_correct").css('display') == 'none') {
            $("#sale-erc1155-verify-notice").css('display', 'none');
        }
    }

    verifyERC1155Burn() {
        var amount = document.getElementById("burn_amount").value;

        try {
            var tempAmount = parseInt(amount);

            if (tempAmount != amount) {
                throw new Error('not integer');
            }

            amount = tempAmount;

            if (amount > this.state.token_info.token.owned_cnt || amount < 1) {
                $("#burn-erc1155-verify-notice").css('display', 'flex');
                $("#burn-erc1155-amount-not-correct").css('display', 'block');
            } else {
                $("#burn-erc1155-verify-notice").css('display', 'none');
                $("#burn-erc1155-amount-not-correct").css('display', 'none');

                this.setState({
                    burn_amount: amount
                });
            }
        } catch (err) {
            $("#burn-erc1155-verify-notice").css('display', 'flex');
            $("#burn-erc1155-amount-not-correct").css('display', 'block');
        }
    }

    isConnectedWallet() {
        if (this.state.selectedAddress == null) {
            alert('Please connect the wallet');
            return false;
        }

        return true;
    }

    handleBtnPurchaseClicked() {
        if (!this.isConnectedWallet()) return;

        $('#popup-checkout-01').fadeIn(100);
    }

    handleBtnERC1155PurchaseClicked() {
        if (!this.isConnectedWallet()) return;

        $('#popup-erc1155-checkout-01').fadeIn(100);
    }

    handleBtnPlaceBidClicked() {
        if (!this.isConnectedWallet()) return;

        $('#popup-place-a-bid-02').fadeIn(100);
    }

    handleBtnERC1155PlaceBidClicked() {
        if (!this.isConnectedWallet()) return;

        $('#popup-erc1155-place-a-bid-02').fadeIn(100);
    }

    render() {
        const { t } = this.props;

        var style_hidden = {display: "none"};

        var style_bottom_pannel = style_hidden;
        if (this.state.token_info != null) {
            if (this.state.profile != null) {
                if (this.state.token_info.owner.address == this.state.selectedAddress) {
                    if (this.state.token_info.token.status == CONST.token_status.AUCTION) {
                        style_bottom_pannel = {};
                    }
                } else {
                    if (this.state.token_info.token.status == CONST.token_status.AUCTION || this.state.token_info.token.status == CONST.token_status.FIXED_PRICE) {
                        style_bottom_pannel = {};
                    } else {
                        style_bottom_pannel = style_hidden;
                    }
                }
            } else {
                if (this.state.token_info.token.status == CONST.token_status.AUCTION || this.state.token_info.token.status == CONST.token_status.FIXED_PRICE) {
                    style_bottom_pannel = {};
                } else {
                    style_bottom_pannel = style_hidden;
                }
            }
        }

        var bid_title = "";
        var bid_price = "";
        if (this.state.token_info != null) {
            if (this.state.token_info.bids.length == 0) {
                bid_title = <p className="ib-head-infos-ttl">Minimum bid by<span>Owner</span></p>;
                bid_price = <p className="ib-head-infos-price">{this.state.token_info.token.price + ' ' + AssetUtils.get_asset_by_id(this.state.token_info.token.auction_asset_id)}<span>{BalanceUtil.format_usd_amount(this.state.token_info.token.price * this.state.tick_bid_asset_price)}</span></p>
            } else {
                bid_title = <p className="ib-head-infos-ttl">Highest bid by<span>{this.state.token_info.bids[0].name}</span></p>;
                bid_price = <p className="ib-head-infos-price">{this.state.token_info.bids[0].amount + ' ' + AssetUtils.get_asset_by_id(this.state.token_info.bids[0].asset_id)}<span>{BalanceUtil.format_usd_amount(this.state.token_info.token.price * this.state.tick_bid_asset_price)}</span></p>
            }
        }

        if (this.state.chart_data.length == 0) {
            var chart_data = (
                <div className="iip-list">
                    <div className="iip-item">
                        <div className="iip-item-fee-infos">
                            <p className="iip-item-infos-ttl">{t("There's no trade history.")}</p>
                        </div>
                    </div>
                </div>
            )
        } else {
            var chart_data = (
                <ResponsiveContainer width='100%' height="auto" aspect={4.0/3.0}>
                    <LineChart
                        data={this.state.chart_data}
                        margin={{ top: 0, right: 20, bottom: 0, left: -20 }}
                    >
                        <CartesianGrid vertical={false} stroke="#000" />
                        <XAxis dataKey="date" interval="preserveStartEnd" stroke="#000" tickFormatter={(date) => date.toString().slice(0, 10)}/>
                        <YAxis domain={['auto', 'auto']} stroke="#000"/>
                        <Tooltip
                            wrapperStyle={{
                                borderColor: 'white',
                                boxShadow: '2px 2px 3px 0px rgb(204, 204, 204)',
                            }}
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#666666' }}
                            formatter={(price) => price + ' BNB'}
                        />
                        <Line dataKey="price" stroke="#000" dot={true} />
                    </LineChart>
                </ResponsiveContainer>
            )
        }

        return (
            <div>
                <section id="item" className="item">
                    <div className="content">
                        <div className="item-inner">
                            <div className="item-mv">
                                <div className="item-mv-wrapper">
                                    { this.state.token_info != null && this.state.token_info.collection.id == 5 && JSON.parse(base64.decode(JSON.parse(this.state.token_info.token.metadata).description)).type == CONST.sns_type.TWITTER &&
                                        <Tweet tweetId={JSON.parse(base64.decode(JSON.parse(this.state.token_info.token.metadata).description)).id}/>
                                    }
                                    { this.state.token_info != null && this.state.token_info.collection.id == 5 && JSON.parse(base64.decode(JSON.parse(this.state.token_info.token.metadata).description)).type == CONST.sns_type.YOUTUBE &&
                                        <YouTube videoId={JSON.parse(base64.decode(JSON.parse(this.state.token_info.token.metadata).description)).id} opts={{width:'100%'}}/>
                                    }
                                    { this.state.token_info != null && this.state.token_info.collection.id != 5 &&
                                        <img src={this.state.token_info == null? mv: JSON.parse(this.state.token_info.token.metadata).url} alt="" />
                                    }
                                    <div className="item-mv-cat-list">
                                        <p className="item-mv-cat-item black">{this.state.token_info == null? "...": this.state.token_info.collection.name}</p>
                                        {/* <p className="item-mv-cat-item purple">UNLOCKABLE</p> */}
                                    </div>
                                    <div className="item-mv-actions" style={this.state.selectedAddress == null || this.state.profile == null || ls.get(CONST.local_storage_key.KEY_CONNECTED) == 0? style_hidden: {}}>
                                        {/* <a className="item-mv-actions-btn item-mv-actions-btn-close" href="#"><i className="fas fa-times"></i></a> */}
                                        <a className="item-mv-actions-btn item-mv-actions-btn-like" onClick={() => this.handleLike()}><i className={this.state.is_like? "fas fa-heart": "far fa-heart"}></i></a>
                                        <a id="btn-show-item-popup" className="item-mv-actions-btn" href="#" style={this.state.token_info != null && this.state.selectedAddress == this.state.token_info.token.owner? {}: style_hidden}>
                                            <i className="fas fa-ellipsis-h"></i>
                                            <div id="item-popup" className="item-popup" style={this.state.token_info == null || this.state.token_info.token.token_contract_id != this.state.token_info.token.token_contract_id? {}: style_hidden}>
                                                <div className="item-popup-list">
                                                    <div id="btn_stake" className="item-popup-item" href="#" style={this.state.token_info != null && this.state.token_info.token.status == CONST.token_status.NONE && this.state.token_info.token.type == CONST.protocol_type.ERC721? {}: style_hidden}>
                                                        <div className="item-popup-item-icon"><i className="fas fa-dollar-sign"></i></div>
                                                        <p className="item-popup-item-ttl">{t('Stake token')}</p>
                                                    </div>
                                                    <div id="btn_revoke" className="item-popup-item" href="#" style={this.state.token_info != null && this.state.token_info.token.status == CONST.token_status.STAKED && this.state.token_info.token.type == CONST.protocol_type.ERC721? {}: style_hidden}>
                                                        <div className="item-popup-item-icon"><i className="fas fa-dollar-sign"></i></div>
                                                        <p className="item-popup-item-ttl">{t('Revoke token')}</p>
                                                    </div>
                                                    <div id="btn_transfer" className="item-popup-item" style={this.state.token_info != null && this.state.token_info.token.status == CONST.token_status.NONE && this.state.token_info.token.type == CONST.protocol_type.ERC721? {}: style_hidden}>
                                                        <div className="item-popup-item-icon"><i className="fas fa-exchange-alt"></i></div>
                                                        <p className="item-popup-item-ttl">{t('Transfer token')}</p>
                                                    </div>
                                                    <div id="btn_erc1155_transfer" className="item-popup-item" style={this.state.token_info != null && this.state.token_info.token.status == CONST.token_status.NONE && this.state.token_info.token.type == CONST.protocol_type.ERC1155? {}: style_hidden}>
                                                        <div className="item-popup-item-icon"><i className="fas fa-exchange-alt"></i></div>
                                                        <p className="item-popup-item-ttl">{t('Transfer token')}</p>
                                                    </div>
                                                    <div id="btn_burn" className="item-popup-item red" href="#" style={this.state.token_info != null && (this.state.token_info.token.status == CONST.token_status.NONE || this.state.token_info.token.status == CONST.token_status.STAKED) && this.state.token_info.token.type == CONST.protocol_type.ERC721? {}: style_hidden}>
                                                        <div className="item-popup-item-icon"><i className="fas fa-times-circle"></i></div>
                                                        <p className="item-popup-item-ttl">{t('Burn token')}</p>
                                                    </div>
                                                    <div id="btn_burn_erc1155" className="item-popup-item red" href="#" style={this.state.token_info != null && (this.state.token_info.token.status == CONST.token_status.NONE || this.state.token_info.token.status == CONST.token_status.STAKED) && this.state.token_info.token.type == CONST.protocol_type.ERC1155? {}: style_hidden}>
                                                        <div className="item-popup-item-icon"><i className="fas fa-times-circle"></i></div>
                                                        <p className="item-popup-item-ttl">{t('Burn token')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="item-infos">
                                <div className="item-infos-top">
                                    <div className="item-infos-ttl">{this.state.token_info == null? "...": this.state.token_info.token.token_name + (this.state.token_info.token.type == CONST.protocol_type.ERC721? " #" + this.state.token_info.token.token_id: " " + this.state.token_info.token.owned_cnt + " / " + this.state.token_info.token.total_supply)}</div>
                                    <div className="item-infos-head" style={this.state.token_info == null || this.state.token_info.token.status != CONST.token_status.FIXED_PRICE? style_hidden: {}}>
                                        <p className="mark eth">{this.state.token_info == null? '...': this.state.token_info.token.price} {this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.BSC? "BNB": "ETH"}</p>
                                        <p className="mark usd">{BalanceUtil.format_usd_amount(this.state.token_info == null? 0: this.state.token_info.token.price * this.state.tick_usd_price)}</p>
                                        {/* <p>10 in stock</p> */}
                                    </div>
                                    {/* <div className="item-infos-desc">
                                        Smart Contract Address: {this.state.token_info == null? '...': this.state.token_info.token.token_contract_id}
                                    </div> */}
                                    <div className="item-infos-desc">
                                        {this.state.token_info == null? "...": BASE64.decode(JSON.parse(this.state.token_info.token.metadata).description)}
                                    </div>

                                    <div className="item-infos-sell">
                                        <a id="btn_sell" className="btn btn-blue" href="#" style={this.state.token_info != null && this.state.selectedAddress == this.state.token_info.token.owner && this.state.token_info.token.status == CONST.token_status.NONE && this.state.token_info.token.type == CONST.protocol_type.ERC721? {}: style_hidden}>{t('List for sell')}</a>
                                        <a id="btn_erc1155_sell" className="btn btn-blue" href="#" style={this.state.token_info != null && this.state.selectedAddress == this.state.token_info.token.owner && this.state.token_info.token.status == CONST.token_status.NONE && this.state.token_info.token.type == CONST.protocol_type.ERC1155? {}: style_hidden}>{t('List for sell')}</a>
                                        <a id="remove_fixed_price_sale" className="btn btn-blue" href="#" style={this.state.token_info != null && this.state.selectedAddress == this.state.token_info.token.owner && this.state.token_info.token.status == CONST.token_status.FIXED_PRICE && this.state.token_info.token.type == CONST.protocol_type.ERC721? {marginBottom: '0px'}: style_hidden}>{t('Remove from sell')}</a>
                                        <a id="remove_erc1155_fixed_price_sale" className="btn btn-blue" href="#" style={this.state.token_info != null && this.state.selectedAddress == this.state.token_info.token.owner && this.state.token_info.token.status == CONST.token_status.FIXED_PRICE && this.state.token_info.token.type == CONST.protocol_type.ERC1155? {marginBottom: '0px'}: style_hidden}>{t('Remove from sell')}</a>
                                        <a id="remove_auction_sale" className="btn btn-blue" href="#" style={this.state.token_info != null && this.state.selectedAddress == this.state.token_info.token.owner && this.state.token_info.token.status == CONST.token_status.AUCTION && this.state.token_info.token.type == CONST.protocol_type.ERC721? {}: style_hidden}>{t('Remove from sell')}</a>
                                        <a id="remove_erc1155_auction_sale" className="btn btn-blue" href="#" style={this.state.token_info != null && this.state.selectedAddress == this.state.token_info.token.owner && this.state.token_info.token.status == CONST.token_status.AUCTION && this.state.token_info.token.type == CONST.protocol_type.ERC1155? {}: style_hidden}>{t('Remove from sell')}</a>
                                    </div>
                                    
                                    <div className="item-infos-tags tags-list">
                                        <a className={this.state.selected_tab == CONST.item_selected_tab.INFO? "active": ""} onClick={() => this.handleTabSelect(CONST.item_selected_tab.INFO)}>{t('Info')}</a>
                                        <a className={this.state.selected_tab == CONST.item_selected_tab.OWNERS? "active": ""} onClick={() => this.handleTabSelect(CONST.item_selected_tab.OWNERS)}>{t('Owners')}</a>
                                        <a className={this.state.selected_tab == CONST.item_selected_tab.HISTORY? "active": ""} onClick={() => this.handleTabSelect(CONST.item_selected_tab.HISTORY)}>{t('History')}</a>
                                        <a className={this.state.selected_tab == CONST.item_selected_tab.BIDS? "active": ""} onClick={() => this.handleTabSelect(CONST.item_selected_tab.BIDS)}>{t('Bids')}</a>
                                    </div>
                                    <div className="item-infos-panel" style={this.state.selected_tab == CONST.item_selected_tab.INFO? {}: style_hidden}>
                                        <div className="iip-list">
                                            <div className="iip-item" onClick={() => window.location = config.host_url + "/profile/" + this.state.token_info.owner.address}>
                                                <div className="iip-item-figure">
                                                    <img src={config.avatar_url + (this.state.token_info == null || this.state.token_info.owner.has_avatar == 0? "default": this.state.token_info.owner.address) + ".png"} onError={this.onAvatarError} alt="" />
                                                </div>
                                                <div className="iip-item-infos">
                                                    <p className="iip-item-infos-ttl">{t('Owner')}</p>
                                                    <p className="iip-item-infos-name">{this.state.token_info == null? "...": this.state.token_info.owner.name}</p>
                                                </div>
                                            </div>

                                            <div className="iip-item" onClick={() => window.location = config.host_url + "/profile/" + this.state.token_info.deployer.address}>
                                                <div className="iip-item-figure">
                                                    <img src={config.avatar_url + (this.state.token_info == null || this.state.token_info.deployer.has_avatar == 0? "default": this.state.token_info.deployer.address) + ".png"} onError={this.onAvatarError} alt="" />
                                                </div>
                                                <div className="iip-item-infos">
                                                    <p className="iip-item-infos-ttl">{t('Creator')}</p>
                                                    <p className="iip-item-infos-name">{this.state.token_info == null? "...": this.state.token_info.deployer.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item-infos-panel" style={this.state.selected_tab == CONST.item_selected_tab.OWNERS? {}: style_hidden}>
                                        <div className="iip-list">
                                            {
                                            this.state.token_info != null && this.state.token_info.owners.map((item, index) => {
                                                return (
                                                    <div className="iip-item" onClick={() => window.location = config.host_url + "/profile/" + item.address}>
                                                        <div className="iip-item-figure">
                                                            <img src={config.avatar_url + (item.has_avatar == 0? "default": item.address) + ".png"} onError={this.onAvatarError} alt="" />
                                                        </div>
                                                        <div className="iip-item-infos">
                                                            <p className="iip-item-infos-ttl">{item.name}</p>
                                                            {/* <p className="iip-item-infos-name">{TimeUtil.format_datetime(item.updated_at)}</p> */}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="item-infos-panel" style={this.state.selected_tab == CONST.item_selected_tab.HISTORY? {}: style_hidden}>
                                        <div className="iip-list">
                                            {
                                            this.state.token_info != null && this.state.token_info.history.map((item, index) => {
                                                var text = "...";
                                                var updated_at = item.updated_at.split('.')[0];
                                                updated_at = updated_at.replace('T', ' ');

                                                switch(item.tx_type) {
                                                    case CONST.tx_type.MINT:
                                                        text = t("Mint by", {name: item.name});
                                                        break;
                                                    case CONST.tx_type.TRANSFER:
                                                        text = t("Transferred by", {name: item.name});
                                                        break;
                                                    case CONST.tx_type.BUY:
                                                        text = t("Sold by", {name: item.name});
                                                        break;
                                                    case CONST.tx_type.EXCHANGE:
                                                        text = t("Exchanged by", {name: item.name});
                                                        break;
                                                    case CONST.tx_type.STAKE:
                                                        text = t("Staked by simple", {name: item.name})
                                                        break;
                                                    case CONST.tx_type.REVOKE:
                                                        text = t("Revoked by simple", {name: item.name})
                                                        break;
                                                    default:
                                                        text = "NONE";
                                                        break;
                                                }

                                                return (
                                                    <div className="iip-item">
                                                        <div className="iip-item-figure">
                                                            <img src={config.avatar_url + (item.has_avatar == 0? "default": item.from_address) + ".png"} onError={this.onAvatarError} alt="" />
                                                        </div>
                                                        <div className="iip-item-infos">
                                                            <p className="iip-item-infos-ttl">{text}</p>
                                                            <p className="iip-item-infos-name">{updated_at}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="item-infos-panel" style={this.state.selected_tab == CONST.item_selected_tab.BIDS? {}: style_hidden}>
                                        <div className="iip-list">
                                            {
                                            this.state.token_info != null && this.state.token_info.bids.map((item, index) => {
                                                var updated_at = item.updated_at.split('.')[0];
                                                updated_at = updated_at.replace('T', ' ');

                                                return (
                                                    <div className="iip-item" onClick={() => window.location = config.host_url + "/profile/" + item.address}>
                                                        <div className="iip-item-figure">
                                                            <img src={config.avatar_url + (item.has_avatar == 0? "default": item.address) + ".png"} onError={this.onAvatarError} alt="" />
                                                        </div>
                                                        <div className="iip-item-infos">
                                                            <p className="iip-item-infos-ttl">{t('Bid with', {name: item.name, amount: item.amount, asset: AssetUtils.get_asset_by_id(item.asset_id)})}</p>
                                                            <p className="iip-item-infos-name">{updated_at}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="item-infos-top">
                                    <div className="item-infos-tags tags-list ttl_copyright">
                                        <p className="item-copyright">{t('Smart Contract Address')}({this.state.token_info == null? t("Unknown"): network_util.get_chain_name(this.state.token_info.token.chain_id)})</p>
                                    </div>
                                    <div className="item-infos-panel">
                                        <div className="iip-list">
                                            <div className="iip-item">
                                                <div className="iip-item-contract-infos">
                                                    <p className="iip-item-infos-ttl">{this.state.token_info == null? '...': this.state.token_info.token.token_contract_id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="item-infos-bottom" style={style_bottom_pannel}>
                                    <div className="iib-head" style={this.state.token_info != null && this.state.token_info.token.status == CONST.token_status.AUCTION? {}: style_hidden}>
                                        <div className="iib-head-avatar">
                                            <img src={icon_avatar_01} alt="" />
                                        </div>
                                        <div className="iib-head-infos">
                                            {bid_title}
                                            {bid_price}
                                        </div>
                                    </div>

                                    <div className="iib-btn-groups" style={this.state.token_info != null && (this.state.token_info.token.status == CONST.token_status.FIXED_PRICE || this.state.token_info.token.status == CONST.token_status.AUCTION)? {}: style_hidden}>
                                        <a id="btn-purchase-now" className="btn btn-blue" onClick={() => this.handleBtnPurchaseClicked()} style={this.state.token_info != null && this.state.token_info.token.status == CONST.token_status.FIXED_PRICE && this.state.token_info.token.type == CONST.protocol_type.ERC721 && this.state.token_info.owner.address != this.state.selectedAddress? {}: style_hidden}><span className="txt">{t('Purchase now')}</span></a>
                                        <a id="btn-erc1155-purchase-now" className="btn btn-blue" onClick={() => this.handleBtnERC1155PurchaseClicked()} style={this.state.token_info != null && this.state.token_info.token.status == CONST.token_status.FIXED_PRICE && this.state.token_info.token.type == CONST.protocol_type.ERC1155 && this.state.token_info.owner.address != this.state.selectedAddress? {}: style_hidden}><span className="txt">{t('Purchase now')}</span></a>
                                        <a id="btn-place-a-bid" className="btn" onClick={() => this.handleBtnPlaceBidClicked()} style={this.state.token_info != null && this.state.selectedAddress != this.state.token_info.owner.address && this.state.token_info.token.status == CONST.token_status.AUCTION && this.state.is_already_bid == false && this.state.token_info.token.type == CONST.protocol_type.ERC721? {}: style_hidden}><span className="txt">{t('Place a bid')}</span></a>
                                        <a id="btn-erc1155-place-a-bid" className="btn" onClick={() => this.handleBtnERC1155PlaceBidClicked()} style={this.state.token_info != null && this.state.selectedAddress != this.state.token_info.owner.address && this.state.token_info.token.status == CONST.token_status.AUCTION && this.state.is_already_bid == false && this.state.token_info.token.type == CONST.protocol_type.ERC1155? {}: style_hidden}><span className="txt">{t('Place a bid')}</span></a>
                                        <a id="btn-cancel-bid" className="btn" href="#" style={this.state.token_info != null && this.state.token_info.token.status == CONST.token_status.AUCTION && this.state.is_already_bid == true && this.state.token_info.token.type == CONST.protocol_type.ERC721? {}: style_hidden}><span className="txt">{t('Cancel my bid')}</span></a>
                                        <a id="btn-cancel-erc1155-bid" className="btn" href="#" style={this.state.token_info != null && this.state.token_info.token.status == CONST.token_status.AUCTION && this.state.is_already_bid == true && this.state.token_info.token.type == CONST.protocol_type.ERC1155? {}: style_hidden}><span className="txt">{t('Cancel my bid')}</span></a>
                                        <a id="btn-accept-bid" className="btn btn-blue" href="#" style={this.state.token_info != null && this.state.token_info.owner.address == this.state.selectedAddress && this.state.token_info.token.status == CONST.token_status.AUCTION && this.state.token_info.bids.length > 0 && this.state.token_info.token.type == CONST.protocol_type.ERC721? {}: style_hidden}><span className="txt">{t('Accept now')}</span></a>
                                        <a id="btn-accept-erc1155-bid" className="btn btn-blue" href="#" style={this.state.token_info != null && this.state.token_info.owner.address == this.state.selectedAddress && this.state.token_info.token.status == CONST.token_status.AUCTION && this.state.token_info.bids.length > 0 && this.state.token_info.token.type == CONST.protocol_type.ERC1155? {}: style_hidden}><span className="txt">{t('Accept now')}</span></a>
                                    </div>

                                    <div className="iib-tail">
                                        <div>
                                            <p>{t('Service fee')}</p>
                                            <p className="black">{config.service_fee}%</p>
                                            <p>{BalanceUtil.format_balance(this.state.balance, this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.ETHEREUM? 'ETH':'BNB')}</p>
                                            <p>{BalanceUtil.format_usd_amount(this.state.balance * this.state.tick_usd_price)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="item-infos-top">
                                    <div className="item-infos-tags tags-list ttl_copyright">
                                        <p className="item-copyright">{t('Copyright Fee')} ({this.state.token_info == null? 0: this.state.token_info.token.fee_percentage}%)</p>
                                        <div className="eb-body-block-add" style={this.state.token_info != null && this.state.token_info.deployer.address == this.state.selectedAddress? {}: style_hidden}>
                                            <a id="btn_edit_fee"  className="btn btn-h40 btn-fs-14">
                                                <span className="ico ico-l"><i className="fas fa-edit"></i></span>
                                                <span className="txt">{t('Edit')}</span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="item-infos-panel">
                                        <div className="iip-list">
                                            {
                                                this.state.fee_distributions.map((item, index) => {
                                                    return (
                                                        <div className="iip-item">
                                                            <div className="iip-item-figure">
                                                                <img src={config.avatar_url + item.address + ".png"} onError={this.onAvatarError} alt="" />
                                                            </div>
                                                            <div className="iip-item-fee-infos">
                                                                <p className="iip-item-infos-ttl">Receiver</p>
                                                                <p className="iip-item-infos-name">{item.address.slice(0, 10) + "..." + item.address.slice(36, 42)}</p>
                                                            </div>
                                                            <div className="iip-item-fee-percentage">
                                                                <p>{item.fee_percentage}%</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="item-infos-top">
                                    <div className="item-infos-tags tags-list ttl_copyright">
                                        <p className="item-copyright">{t('Price History')}</p>
                                    </div>
                                    <div className="item-infos-panel">
                                        {chart_data}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div id="popup-transfer-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Transfer')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('You can transfer this nft token to the other person.')}</p>
                            <input id="transfer_receiver" type="text" placeholder={"e.g. " + t('Please input the receiver address.')} onChange={() => this.handleTransferAddress()}/>
                            <table className="popup-table">
                                <tbody>
                                    <tr>
                                        <td>{t('Your balance')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.balance, this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.BSC? 'BNB': 'ETH')}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Service fee')}</td>
                                        <td>0 {this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.BSC? 'BNB': 'ETH'}</td>
                                    </tr>
                                    {/* <tr>
                                        <td>You will pay</td>
                                        <td>{BalanceUtil.format_balance(this.state.transfer_fee)}</td>
                                    </tr> */}
                                </tbody>
                            </table>
                            <div id="transfer-verify-notice" className="popup-verify-notice" style={this.state.show_transfer_notice? {}: style_hidden}>
                                <div className="popup-vn-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div className="popup-vn-infos">
                                    <p className="popup-vn-infos-ttl">{t('This receiver is not registered')}</p>
                                </div>
                                <div className="popup-vn-avatar">
                                </div>
                            </div>

                            <a id="popup-transfer-01-continue" className="btn btn-full btn-blue mb-8" href="#"><span className="txt">{t('I understand, continue')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-transfer-02" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-spinner"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Transfer')}</p>
                                        <p className="popup-item-info-txt">{t('Send transaction with your wallet')}</p>
                                    </div>
                                </div>
                            </div>

                            <a  id="popup-transfer-02-continue" className="btn btn-full btn-blue mb-8" onClick={() => this.handleTransfer()}><span className="txt">{t('I understand, continue')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-erc1155-transfer-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Transfer')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('You can transfer this nft token to the other person.')}</p>
                            <input id="transfer_erc1155_receiver" type="text" placeholder={"e.g. " + t('Please input the receiver address.')} onChange={() => this.verifyERC1155Transfer()}/>
                            <div className="amount-panel">
                                <p>{t('Amount')}</p>
                                <input id="transfer_erc1155_amount" type="number" defaultValue="0" min="1" max={this.state.token_info == null? "1": this.state.token_info.token.owned_cnt} onChange={() => this.verifyERC1155Transfer()}/>
                            </div>
                            <table className="popup-table">
                                <tbody>
                                    <tr>
                                        <td>{t('Your balance')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.balance, this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.BSC? 'BNB': 'ETH')}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Service fee')}</td>
                                        <td>0 {this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.BSC? 'BNB': 'ETH'}</td>
                                    </tr>
                                    {/* <tr>
                                        <td>You will pay</td>
                                        <td>{BalanceUtil.format_balance(this.state.transfer_fee)}</td>
                                    </tr> */}
                                </tbody>
                            </table>
                            <div id="transfer-erc1155-verify-notice" className="popup-verify-notice">
                                <div className="popup-vn-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div className="popup-vn-infos">
                                    <p id="transfer-erc1155-receiver-not-correct" className="popup-vn-infos-ttl">{t('This receiver is not registered')}</p>
                                    <p id="transfer-erc1155-amount-not-correct" className="popup-vn-infos-ttl" style={{display: 'none'}}>{t('Amount is not correct.')}</p>
                                </div>
                                <div className="popup-vn-avatar">
                                </div>
                            </div>

                            <a id="popup-transfer-erc1155-01-continue" className="btn btn-full btn-blue mb-8" href="#"><span className="txt">{t('I understand, continue')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-erc1155-transfer-02" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-spinner"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Transfer')}</p>
                                        <p className="popup-item-info-txt">{t('Send transaction with your wallet')}</p>
                                    </div>
                                </div>
                            </div>

                            <a  id="popup-transfer-02-continue" className="btn btn-full btn-blue mb-8" onClick={() => this.handleERC1155Transfer()}><span className="txt">{t('I understand, continue')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-sale-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Sell the token')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('You can sell this nft token with fixed price or auction.')}</p>
                            <table className="popup-table">
                                <thead>
                                    <tr>
                                        <th>
                                            {t('Price')}
                                        </th>
                                        <th align="right">
                                            <div align="right">
                                                <input id="price" type="text" className="price" placeholder="0" autoComplete="off" onChange={() => this.handlePriceChange()}/>
                                                <div className="uic-main-item-field-select">
                                                    <select id="sale_asset" onChange={() => this.handleSaleAssetChanged()}>
                                                        {this.state.sell_type == CONST.token_status.FIXED_PRICE? 
                                                            <option value={this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.BSC? "BNB": "ETH"}>{this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.BSC? "BNB": "ETH"}</option>:
                                                            (
                                                                Object.keys(this.state.support_tokens).map((item, index) => {
                                                                    return (<option value={this.state.support_tokens[item]}>{item}</option>)
                                                                })
                                                            )}
                                                    </select>
                                                    <span><i className="fas fa-angle-down"></i></span>
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{t('Your balance')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.balance, this.state.selected_asset)}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Service fee')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.show_sell_notice? 0: config.service_fee * this.state.sell_price / 100, this.state.selected_asset)}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Fixed Price')}</td>
                                        <td>
                                            <div className="uic-main-item-field-check">
                                                <input id="uic-chk-fixed-price" type="checkbox" onClick={() => this.handleSellType()}/>
                                                <label htmlFor="uic-chk-fixed-price"></label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t('Auction')}</td>
                                        <td>
                                            <div className="uic-main-item-field-check">
                                                <input id="uic-chk-auction" type="checkbox" onClick={() => this.handleSellType()}/> 
                                                <label htmlFor="uic-chk-auction"></label>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <td>You will pay</td>
                                        <td>{BalanceUtil.format_balance(this.state.transfer_fee)}</td>
                                    </tr> */}
                                </tbody>
                            </table>
                            <div id="sale-verify-notice" className="popup-verify-notice" style={this.state.show_sell_notice? {}: style_hidden}>
                                <div className="popup-vn-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div className="popup-vn-infos">
                                    <p className="popup-vn-infos-ttl">{t('Price is not correct.')}</p>
                                </div>
                                <div className="popup-vn-avatar">
                                </div>
                            </div>

                            <a id="popup-sale-01-continue" className="btn btn-full btn-blue mb-8" href="#"><span className="txt">{t('I understand, continue')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-sale-02" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Approve')}</p>
                                        <p className="popup-item-info-txt">{t('Approve your nft token.')}</p>
                                    </div>
                                </div>
                                <a id="sell_approve" className="btn btn-full btn-blue" onClick={() => this.handleApprove()}><span className="txt">{t('Start now')}</span></a>
                            </div>

                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-check"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Order')}</p>
                                        <p className="popup-item-info-txt">{t('Send sell order.')}</p>
                                    </div>
                                </div>
                                <a id="sell_order" className="btn btn-full btn-blue btn-ready" onClick={() => this.handleSellRequest()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-erc1155-sale-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Sell the token')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('You can sell this nft token with fixed price or auction.')}</p>
                            <div className="amount-panel">
                                <p>{t('Amount')}</p>
                                <input id="sale_erc1155_amount" type="number" defaultValue="0" min="1" max={this.state.token_info == null? "1": this.state.token_info.token.owned_cnt} onChange={() => this.verifyERC1155Sale()}/>
                            </div>
                            <table className="popup-table">
                                <thead>
                                    <tr>
                                        <th>
                                            {t('Price')}
                                        </th>
                                        <th align="right">
                                            <div align="right">
                                                <input id="sale_erc1155_price" type="text" className="price" placeholder="0" autoComplete="off" onChange={() => this.verifyERC1155Sale()}/>
                                                <div className="uic-main-item-field-select">
                                                    <select id="erc1155_sale_asset" onChange={() => this.handleERC1155SaleAssetChanged()}>
                                                    {this.state.sell_type == CONST.token_status.FIXED_PRICE? 
                                                            <option value={this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.BSC? "BNB": "ETH"}>{this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.BSC? "BNB": "ETH"}</option>:
                                                            (
                                                                Object.keys(this.state.support_tokens).map((item, index) => {
                                                                    return (<option value={this.state.support_tokens[item]}>{item}</option>)
                                                                })
                                                            )}
                                                    </select>
                                                    <span><i className="fas fa-angle-down"></i></span>
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{t('Your balance')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.balance, this.state.selected_asset)}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Service fee')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.show_sell_notice? 0: config.service_fee * this.state.sell_price / 100, this.state.selected_asset)}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Fixed Price')}</td>
                                        <td>
                                            <div className="uic-main-item-field-check">
                                                <input id="uic-chk-erc1155-fixed-price" type="checkbox" defaultChecked="true" onClick={() => this.handleERC1155SellType()}/>
                                                <label htmlFor="uic-chk-erc1155-fixed-price"></label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t('Auction')}</td>
                                        <td>
                                            <div className="uic-main-item-field-check">
                                                <input id="uic-chk-erc1155-auction" type="checkbox" onClick={() => this.handleERC1155SellType()}/> 
                                                <label htmlFor="uic-chk-erc1155-auction"></label>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <td>You will pay</td>
                                        <td>{BalanceUtil.format_balance(this.state.transfer_fee)}</td>
                                    </tr> */}
                                </tbody>
                            </table>
                            <div id="sale-erc1155-verify-notice" className="popup-verify-notice">
                                <div className="popup-vn-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div className="popup-vn-infos">
                                    <p id="sale_erc1155_amount_not_correct" className="popup-vn-infos-ttl">{t('Amount is not correct.')}</p>
                                    <p id="sale_erc1155_price_not_correct" className="popup-vn-infos-ttl">{t('Price is not correct.')}</p>
                                </div>
                                <div className="popup-vn-avatar">
                                </div>
                            </div>

                            <a id="popup-sale-erc1155-01-continue" className="btn btn-full btn-blue mb-8" href="#"><span className="txt">{t('I understand, continue')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-erc1155-sale-02" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Approve')}</p>
                                        <p className="popup-item-info-txt">{t('Approve your nft token.')}</p>
                                    </div>
                                </div>
                                <a id="erc1155_sell_approve" className="btn btn-full btn-blue" onClick={() => this.handleERC1155Approve()}><span className="txt">{t('Start now')}</span></a>
                            </div>

                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-check"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Order')}</p>
                                        <p className="popup-item-info-txt">{t('Send sell order.')}</p>
                                    </div>
                                </div>
                                <a id="erc1155_sell_order" className="btn btn-full btn-blue btn-ready" onClick={() => this.handleERC1155SellRequest()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-checkout-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Checkout')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('You are about to purchase the NFT Token.')}</p>
                            <table className="popup-table">
                                <thead>
                                    <tr>
                                        <th>{this.state.token_info == null? "...": this.state.token_info.token.price}</th>
                                        <th>{this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.ETHEREUM? "ETH": 'BNB'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{t('Your balance')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.balance, this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.ETHEREUM? "ETH": 'BNB')}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Service fee')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.token_info == null? 0: config.service_fee * this.state.token_info.token.price / 100, this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.ETHEREUM? "ETH": 'BNB')}</td>
                                    </tr>
                                    {/* <tr>
                                        <td>You will pay</td>
                                        <td>0.007 BNB</td>
                                    </tr> */}
                                </tbody>
                            </table>
                            {/* <div className="popup-verify-notice">
                                <div className="popup-vn-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div className="popup-vn-infos">
                                    <p className="popup-vn-infos-ttl">This creator is not verified</p>
                                    <p className="popup-vn-infos-txt">Purchase this item at your own risk</p>
                                </div>
                                <div className="popup-vn-avatar">
                                </div>
                            </div> */}

                            <a id="popup-purchase-01" className="btn btn-full btn-blue mb-8" onClick={() => this.handlePurchase()}><span className="txt">{t('I understand, Purchase')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-checkout-02" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-spinner"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Purchasing')}</p>
                                        <p className="popup-item-info-txt">{t('Sending transaction with your wallet')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="popup-verify-notice">
                                <div className="popup-vn-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div className="popup-vn-infos">
                                    <p className="popup-vn-infos-ttl">{t('This creator is not verified')}</p>
                                    <p className="popup-vn-infos-txt">{t('Purchase this item at your own risk')}</p>
                                </div>
                                <div className="popup-vn-avatar">
                                    <img src={icon_avatar_01} alt="" />
                                </div>
                            </div>

                            <a  id="popup-purchase-02" className="btn btn-full btn-blue mb-8" href="#"><span className="txt">{t('I understand, continue')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-checkout-03" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl"></p>
                            <div id="congratulation-popup-close" className="icon icon-40 popup-close-1" onClick={() => window.location = config.host_url + "/profile/" + this.state.selectedAddress}>
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-complete-ttl">
                                Yay!<span><img src={icon_congratulation} alt=""/></span>
                            </p>

                            <p className="popup-lead center">
                                {t('You successfully purchased')}<br/>
                                {/* <span>COINZ</span> from UI8 */}
                            </p>

                            <div className="popup-complete-box">
                                <div className="popup-complete-box-row">
                                    <p>{t('Status')}</p>
                                    <p>{t('Transaction ID')}</p>
                                </div>
                                <div className="popup-complete-box-row">
                                    <p className="blue">{t('Completed')}</p>
                                    <p className="black">{this.state.buy_tx_id.slice(0, 12) + "..." + this.state.buy_tx_id.slice(57, this.state.buy_tx_id.length)}</p>
                                </div>
                            </div>

                            {/* <p className="popup-lead center mb-16">Time to show-off</p>

                            <div className="popup-sns">
                                <a className="popup-sns-link" href="#"><i className="fab fa-facebook"></i></a>
                                <a className="popup-sns-link" href="#"><i className="fab fa-twitter"></i></a>
                                <a className="popup-sns-link" href="#"><i className="fab fa-instagram"></i></a>
                                <a className="popup-sns-link" href="#"><i className="fab fa-pinterest"></i></a>
                            </div> */}
                        </div>
                    </div>
                </div>

                <div id="popup-erc1155-checkout-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Checkout')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('You are about to purchase the NFT Token.')}</p>
                            <table className="popup-table">
                                <thead>
                                    <tr>
                                        <th>{this.state.token_info == null? "...": this.state.token_info.token.price}</th>
                                        <th>{this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.ETHEREUM? "ETH": 'BNB'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr>
                                        <td>{t('Your balance')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.balance, this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.ETHEREUM? "ETH": 'BNB')}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Service fee')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.token_info == null? 0: config.service_fee * this.state.token_info.token.price / 100, this.state.token_info != null && this.state.token_info.token.chain_id == support_networks.ETHEREUM? "ETH": 'BNB')}</td>
                                    </tr>
                                    {/* <tr>
                                        <td>You will pay</td>
                                        <td>0.007 BNB</td>
                                    </tr> */}
                                </tbody>
                            </table>
                            {/* <div className="popup-verify-notice">
                                <div className="popup-vn-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div className="popup-vn-infos">
                                    <p className="popup-vn-infos-ttl">This creator is not verified</p>
                                    <p className="popup-vn-infos-txt">Purchase this item at your own risk</p>
                                </div>
                                <div className="popup-vn-avatar">
                                </div>
                            </div> */}

                            <a id="popup-erc1155-purchase-01" className="btn btn-full btn-blue mb-8" onClick={() => this.handleERC1155Purchase()}><span className="txt">{t('I understand, Purchase')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-place-a-bid-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl"></p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-wallet-mark">
                                <div className="popup-wallet-mark-icon"><i className="fas fa-wallet"></i></div>
                            </div>
                            <p className="popup-lead center">
                                {t('You need to connect your wallet first to sign message and send transaction to Ethereum network')}
                            </p>
                            <a id="btn-show-place-a-bid-01" className="btn btn-full btn-blue mb-8" href="#"><span className="txt">{t('Connect wallet')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-place-a-bid-02" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Place a bid')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('You are about to place a bid')}</p>

                            <p className="popup-table-ttl">{t('Your bid')}</p>
                            <table className="popup-table">
                                <thead>
                                    <tr>
                                        <th>
                                            <input id="bid_price" type="text" className="price_left" placeholder={t("Enter bid")} autoComplete="off" style={{textAlign: 'left'}} onChange={() => this.handleBidAmountChanged()}/>
                                        </th>
                                        <th>{this.state.token_info != null? AssetUtils.get_asset_by_id(this.state.token_info.token.auction_asset_id): 'BNB'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{t('Your balance')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.bid_asset_balance, this.state.bid_asset_name)}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Service fee')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.show_bid_notice? 0: config.service_fee * this.state.bid_amount / 100, this.state.bid_asset_name)}</td>
                                    </tr>
                                    {/* <tr>
                                        <td>You will pay</td>
                                        <td>0.007 BNB</td>
                                    </tr> */}
                                </tbody>
                            </table>

                            <div id="bid-verify-notice" className="popup-verify-notice" style={this.state.show_bid_notice? {}: style_hidden}>
                                <div className="popup-vn-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div className="popup-vn-infos">
                                    <p className="popup-vn-infos-ttl">{t('The bid amount is incorrect.')}</p>
                                </div>
                                <div className="popup-vn-avatar">
                                </div>
                            </div>

                            <a id="btn-show-place-a-bid-02" className="btn btn-full btn-blue mb-8" href="#"><span className="txt">{t('Place a bid')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-place-a-bid-03" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Approve')}</p>
                                        <p className="popup-item-info-txt">{t('Approve your tokens for bid')}</p>
                                    </div>
                                </div>
                                <a id="bid_approve" className="btn btn-full btn-blue" onClick={() => this.handleBidApprove()}><span className="txt">{t('Start now')}</span></a>
                            </div>

                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-check"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Bid')}</p>
                                        <p className="popup-item-info-txt">{t('Bid your request')}</p>
                                    </div>
                                </div>
                                <a id="bid_request" className="btn btn-full btn-blue btn-ready" onClick={() => this.handleBidRequest()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-erc1155-place-a-bid-02" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Place a bid')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('You are about to place a bid')}</p>

                            <p className="popup-table-ttl">{t('Your bid')}</p>
                            <table className="popup-table">
                                <thead>
                                    <tr>
                                        <th>
                                            <input id="erc1155_bid_price" type="text" className="price_left" placeholder={t("Enter bid")} autoComplete="off" style={{textAlign: 'left'}} onChange={() => this.handleERC1155BidAmountChanged()}/>
                                        </th>
                                        <th>{this.state.token_info != null? AssetUtils.get_asset_by_id(this.state.token_info.token.auction_asset_id): 'BNB'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{t('Your balance')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.bid_asset_balance, this.state.bid_asset_name)}</td>
                                    </tr>
                                    <tr>
                                        <td>{t('Service fee')}</td>
                                        <td>{BalanceUtil.format_balance(this.state.show_bid_notice? 0: config.service_fee * this.state.bid_amount / 100, this.state.bid_asset_name)}</td>
                                    </tr>
                                    {/* <tr>
                                        <td>You will pay</td>
                                        <td>0.007 BNB</td>
                                    </tr> */}
                                </tbody>
                            </table>

                            <div id="erc1155-bid-verify-notice" className="popup-verify-notice" style={this.state.show_bid_notice? {}: style_hidden}>
                                <div className="popup-vn-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div className="popup-vn-infos">
                                    <p className="popup-vn-infos-ttl">{t('The bid amount is incorrect.')}</p>
                                </div>
                                <div className="popup-vn-avatar">
                                </div>
                            </div>

                            <a id="btn-show-erc1155-place-a-bid-02" className="btn btn-full btn-blue mb-8" href="#"><span className="txt">{t('Place a bid')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-erc1155-place-a-bid-03" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Approve')}</p>
                                        <p className="popup-item-info-txt">{t('Approve your tokens for bid')}</p>
                                    </div>
                                </div>
                                <a id="erc1155_bid_approve" className="btn btn-full btn-blue" onClick={() => this.handleERC1155BidApprove()}><span className="txt">{t('Start now')}</span></a>
                            </div>

                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-check"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Bid')}</p>
                                        <p className="popup-item-info-txt">{t('Bid your request')}</p>
                                    </div>
                                </div>
                                <a id="erc1155_bid_request" className="btn btn-full btn-blue btn-ready" onClick={() => this.handleERC1155BidRequest()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-cancel-bid-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Cancel')}</p>
                                        <p className="popup-item-info-txt">{t('Cancel your bid')}</p>
                                    </div>
                                </div>
                                <a id="bid_cancel_approve" className="btn btn-full btn-blue" onClick={() => this.handleBidCancel()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-cancel-erc1155-bid-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Cancel')}</p>
                                        <p className="popup-item-info-txt">{t('Cancel your bid')}</p>
                                    </div>
                                </div>
                                <a id="erc1155_bid_cancel_approve" className="btn btn-full btn-blue" onClick={() => this.handleERC1155BidCancel()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-accept-bid-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Accept')}</p>
                                        <p className="popup-item-info-txt">{t('Accept the highest bid')}</p>
                                    </div>
                                </div>
                                <a id="bid_accept_approve" className="btn btn-full btn-blue" onClick={() => this.handleBidAccept()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-accept-erc1155-bid-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Accept')}</p>
                                        <p className="popup-item-info-txt">{t('Accept the highest bid')}</p>
                                    </div>
                                </div>
                                <a id="erc1155_bid_accept_approve" className="btn btn-full btn-blue" onClick={() => this.handleERC1155BidAccept()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-stake-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Approve')}</p>
                                        <p className="popup-item-info-txt">{t('Approve your tokens for stake')}</p>
                                    </div>
                                </div>
                                <a id="stake_approve" className="btn btn-full btn-blue" onClick={() => this.handleStakeApprove()}><span className="txt">{t('Start now')}</span></a>
                            </div>

                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-check"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Stake')}</p>
                                        <p className="popup-item-info-txt">{t("Stake your token")}</p>
                                    </div>
                                </div>
                                <a id="stake_request" className="btn btn-full btn-blue btn-ready" onClick={() => this.handleStake()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-revoke-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Approve')}</p>
                                        <p className="popup-item-info-txt">{t('Approve your tokens for revoke')}</p>
                                    </div>
                                </div>
                                <a id="revoke_approve" className="btn btn-full btn-blue" onClick={() => this.handleRevokeApprove()}><span className="txt">{t('Start now')}</span></a>
                            </div>

                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Revoke')}</p>
                                        <p className="popup-item-info-txt">{t('Revoke your staked token')}</p>
                                    </div>
                                </div>
                                <a id="revoke_request" className="btn btn-full btn-blue btn-ready" onClick={() => this.handleRevoke()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-remove-fixed-price-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-check"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Remove')}</p>
                                        <p className="popup-item-info-txt">{t('Remove from sell')}</p>
                                    </div>
                                </div>
                                <a id="remove_fixed_price_request" className="btn btn-full btn-blue" onClick={() => this.handleFixedPriceRemoveSale()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Freeze')}</p>
                                        <p className="popup-item-info-txt">{t('Freeze your nft token')}</p>
                                    </div>
                                </div>
                                <a id="remove_fixed_price_freeze" className="btn btn-full btn-blue btn-ready" onClick={() => this.handleFixedPriceFreeeze()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-remove-erc1155-fixed-price-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-check"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Remove')}</p>
                                        <p className="popup-item-info-txt">{t('Remove from sell')}</p>
                                    </div>
                                </div>
                                <a id="remove_erc1155_fixed_price_request" className="btn btn-full btn-blue" onClick={() => this.handleERC1155FixedPriceRemoveSale()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Freeze')}</p>
                                        <p className="popup-item-info-txt">{t('Freeze your nft token')}</p>
                                    </div>
                                </div>
                                <a id="remove_erc1155_fixed_price_freeze" className="btn btn-full btn-blue btn-ready" onClick={() => this.handleERC1155FixedPriceFreeeze()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-remove-auction-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-check"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Remove')}</p>
                                        <p className="popup-item-info-txt">{t('Remove from sell')}</p>
                                    </div>
                                </div>
                                <a id="remove_auction_request" className="btn btn-full btn-blue" onClick={() => this.handleAuctionRemoveSale()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Freeze')}</p>
                                        <p className="popup-item-info-txt">{t('Freeze your nft token')}</p>
                                    </div>
                                </div>
                                <a id="remove_auction_freeze" className="btn btn-full btn-blue btn-ready" onClick={() => this.handleAuctionFreeeze()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-remove-erc1155-auction-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-check"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Remove')}</p>
                                        <p className="popup-item-info-txt">{t('Remove from sell')}</p>
                                    </div>
                                </div>
                                <a id="remove_erc1155_auction_request" className="btn btn-full btn-blue" onClick={() => this.handleERC1155AuctionRemoveSale()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Freeze')}</p>
                                        <p className="popup-item-info-txt">{t('Freeze your nft token')}</p>
                                    </div>
                                </div>
                                <a id="remove_erc1155_auction_freeze" className="btn btn-full btn-blue btn-ready" onClick={() => this.handleERC1155AuctionFreeeze()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-fee-distribution-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Copyright Fee Distribution')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('You can change the fee distribution receivers and percentage.')}</p>
                            <table className="popup-table">
                                <thead>
                                    <tr>
                                        <th style={{width: "80%"}}>
                                            {t('Fee Receiver')}
                                        </th>
                                        <th>
                                            {t('Percent')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="fee_distribution_tbody">
                                </tbody>
                            </table>
                            <div className="fee-operations">
                                <a id="btn_add_fee"  className="btn btn-h40 btn-fs-14" onClick={() => this.handleAddFeeDistribution()}>
                                    <span className="ico ico-l"><i className="fas fa-plus"></i></span>
                                    <span className="txt">{t('Add')}</span>
                                </a>
                                <a id="btn_remove_fee"  className="btn btn-h40 btn-fs-14" onClick={() => this.handleRemoveFeeDistribution()}>
                                    <span className="ico ico-l"><i className="fas fa-minus"></i></span>
                                    <span className="txt">{t('Remove')}</span>
                                </a>
                            </div>

                            <a id="popup-fee-continue" className="btn btn-full btn-blue mb-8" onClick={() => this.handleFeeDistribution()}><span className="txt">{t('I understand, continue')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-burn-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Burn')}</p>
                                        <p className="popup-item-info-txt">{t('Burn this token forever.')}</p>
                                    </div>
                                </div>
                                <a id="burn_token" className="btn btn-full btn-blue" onClick={() => this.handleBurn()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-erc1155-burn-01" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Burn')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('You will burn nft tokens forever.')}</p>
                            <div className="amount-panel">
                                <p>{t('Amount')}</p>
                                <input id="burn_amount" type="number" defaultValue="0" min="1" max={this.state.token_info == null? "1": this.state.token_info.token.owned_cnt} onChange={() => this.verifyERC1155Burn()}/>
                            </div>
                            <div id="burn-erc1155-verify-notice" className="popup-verify-notice">
                                <div className="popup-vn-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div className="popup-vn-infos">
                                    <p id="burn-erc1155-amount-not-correct"className="popup-vn-infos-ttl">{t('Amount is not correct.')}</p>
                                </div>
                                <div className="popup-vn-avatar">
                                </div>
                            </div>

                            <a id="popup-burn-erc1155-01-continue" className="btn btn-full btn-blue mb-8" href="#"><span className="txt">{t('I understand, continue')}</span></a>
                            <a className="btn btn-full btn-cancel mb-8" href="#"><span className="txt">{t('Cancel')}</span></a>
                        </div>
                    </div>
                </div>

                <div id="popup-erc1155-burn-02" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close">
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-arrow-up"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Burn')}</p>
                                        <p className="popup-item-info-txt">{t('Burn this token forever.')}</p>
                                    </div>
                                </div>
                                <a id="burn_erc1155_token" className="btn btn-full btn-blue" onClick={() => this.handleERC1155Burn()}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
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
            </div>
        );
    }
}

export default withTranslation()(Item);