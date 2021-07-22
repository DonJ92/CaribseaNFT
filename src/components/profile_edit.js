import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../styles/style.css';
import Web3 from 'web3';
import * as API from '../adapter/api';
import $ from 'jquery';

import {AddClass, ChangeClass} from '../js/common';

import avatar_large from '../img/common/avatar-large.png';
import hand from '../img/profile/hand.png';
import config from '../globals/config';
import { withTranslation } from 'react-i18next';

class ProfileEdit extends React.Component {
    constructor(props) {
        super(props);

        ChangeClass('profile');
        AddClass('has-popup');

        this.state = {
            address: null,
            avatar: null,
            cover: null,
            name: '',
            url: '',
            description: '',
            portfolior: '',
            twitter_username: '',
            show_loading: true,
            preview_png: config.avatar_url + "default.png"
        }
    }

    componentDidMount() {
        this.showLoading();
        this.GetAccounts();
    }

    GetAccounts() {
        const web3 = new Web3(Web3.givenProvider);
        web3.eth.getAccounts((error,result) => {
            if (error) {
                console.log(error);
                this.hideLoading();
            } else {
                if (result.length < 1) {
                } else {
                    this.setState({address: result[0]});

                    API.get_profile(this.state.address)
                    .then((res) => {
                        this.hideLoading();

                        if (!res.result) throw new Error('Getting profile failed.');

                        var profile = JSON.parse(res.profile);
                        document.getElementById("name").value = profile.name;
                        document.getElementById("url").value = profile.url;
                        document.getElementById("description").value = profile.description;
                        document.getElementById("portfolio").value = profile.portfolio;
                        document.getElementById("twitter_username").value = profile.twitter_username;
                        document.getElementById("instagram_username").value = profile.instagram_username;
                        document.getElementById("facebook_username").value = profile.facebook_username;

                        this.setState({
                            avatar: profile.has_avatar == 1? this.state.address + '.png': 'default',
                            cover: profile.has_cover == 1? this.state.address + '.png': 'default',
                            preview_png: config.avatar_url + this.state.address + '.png'
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                }
            }
        });
    }

    onFileChanged=event=>{
        const formData = new FormData(); 
     
        // Update the formData object 
        formData.append( 
            "myFile", 
            event.target.files[0], 
            this.state.address + ".png"
        ); 
        
        // Request made to the backend api 
        // Send formData object 
        axios.post(config.backend_url + "/upload_preview", formData)
        .then((res) => {
            if (res.data.result) {
                this.setState({preview_png: config.preview_url + res.data.file_name});
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    handleFileSelect = (e) => {
        var input = document.getElementById('avatar');
        input.click();
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

    Update() {
        var profile = {
            name: document.getElementById("name").value,
            address: this.state.address,
            url: document.getElementById("url").value,
            description: document.getElementById("description").value,
            portfolio: document.getElementById("portfolio").value,
            twitter_username: document.getElementById("twitter_username").value,
            instagram_username: document.getElementById("instagram_username").value,
            facebook_username: document.getElementById("facebook_username").value
        };

        if (!this.validInput(profile)) {
            return;
        }

        this.showLoading();

        if (this.state.preview_png.includes(config.avatar_url)) {
            this.UpdateProfile(profile);
            return;
        }
        
        var previewPaths = this.state.preview_png.split("/");
        
        axios.get(config.backend_url + "/upload_avatar/" + previewPaths[previewPaths.length - 1] + "/" + this.state.address)
        .then((res) => {
            this.UpdateProfile(profile);
        })
        .catch((err) => {
            console.log(err);

            this.hideLoading();
        })
    }

    Reset() {
        document.getElementById("name").value = "";
        document.getElementById("url").value = "";
        document.getElementById("description").value = "";
        document.getElementById("portfolio").value = "";
        document.getElementById("twitter_username").value = "";
        document.getElementById("instagram_username").value = "";
        document.getElementById("facebook_username").value = "";
    }

    validInput(profile) {
        if (profile.name == "") {
            alert("Please input name.");
            return false;
        }

        if (profile.description == "") {
            alert("Please input description.");
            return false;
        }

        if (profile.address == null) {
            alert("Plese connect the wallet.");
            return false;
        }

        return true;
    }

    UpdateProfile(profile) {
        API.update_profile(profile)
        .then((res) => {
            console.log(res);
            if (res.result == true) {
                window.location = "/profile/" + this.state.address;
            } else {
                this.hideLoading();

                alert('Updating profile failed.');
            }
        })
        .catch((err) => {
            console.log(err);
            this.hideLoading();
        });
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    render() {
        const { t } = this.props;

        var style_hidden = {display: 'none'};

        return (
            <div>
                <section id="edit-profile" className="edit-profile">
                    <div className="content">
                        <div className="edit-profile-inner">
                            <div className="ep-head">
                                <h2 className="ep-head-ttl">{t('Edit profile')}</h2>
                                <p className="ep-head-txt">
                                    You can set preferred display name, create <span>your profile URL</span> and manage other personal settings.
                                </p>
                            </div>

                            <div className="ep-body">
                                <div className="eb-body-col">
                                    <div className="eb-body-photo">
                                        <div className="eb-body-photo-avatar">
                                            <img src={this.state.preview_png} onError={this.onAvatarError} alt="" />
                                        </div>

                                        <div className="eb-body-photo-infos">
                                            <p className="eb-body-photo-infos-ttl">{t('Profile photo')}</p>
                                            <p className="eb-body-photo-infos-txt">
                                                We recommend an image of at least 400x400.<br class="br-480-no"/>
                                                Gifs work too <span><img src={hand} alt="" /></span>
                                            </p>
                                            <a className="btn btn-h40" onClick={this.handleFileSelect}><span className="txt">{t('Upload')}</span></a>
                                            <input id='avatar' type='file' accept='image/png' style={{display: 'none'}} onChange={this.onFileChanged}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="eb-body-col">
                                    <div className="eb-body-block">
                                        <p className="eb-body-block-ttl">{t('Account info')}</p>

                                        <div className="eb-body-block-field">
                                            <p className="eb-body-block-field-ttl">{t('DISPLAY NAME')}</p>
                                            <div className="eb-body-block-field-wrapper">
                                                <input id="name" type="text" placeholder={t('Enter your display name')}/>
                                            </div>
                                        </div>

                                        <div className="eb-body-block-field">
                                            <p className="eb-body-block-field-ttl">{t('CUSTOM URL')}</p>
                                            <div className="eb-body-block-field-wrapper">
                                                <input id="url" type="text" placeholder={t('Your custom URL')}/>
                                            </div>
                                        </div>

                                        <div className="eb-body-block-field">
                                            <p className="eb-body-block-field-ttl">{t('DESCRIPTION')}</p>
                                            <div className="eb-body-block-field-wrapper">
                                                <textarea id="description" placeholder={t('About yourself in a few words')}></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="eb-body-block">
                                        <p className="eb-body-block-ttl">{t('Social')}</p>

                                        <div className="eb-body-block-field">
                                            <p className="eb-body-block-field-ttl">{t('PORTFOLIO OR WEBSITE')}</p>
                                            <div className="eb-body-block-field-wrapper">
                                                <input id="portfolio" type="text" placeholder={t('Enter URL')}/>
                                            </div>
                                        </div>

                                        <div className="eb-body-block-field">
                                            <p className="eb-body-block-field-ttl">{t('TWITTER ACCOUNT')}</p>
                                            <div className="eb-body-block-field-wrapper">
                                                <input id="twitter_username" className="" type="text" placeholder={t('twitter username')}/>
                                                {/* <a className="btn-verify btn btn-h32 btn-fs-14" href="#"><span className="txt">Verify account</span></a> */}
                                            </div>
                                        </div>

                                        <div className="eb-body-block-field">
                                            <p className="eb-body-block-field-ttl">{t('INSTAGRAM ACCOUNT')}</p>
                                            <div className="eb-body-block-field-wrapper">
                                                <input id="instagram_username" className="" type="text" placeholder={t('instagram username')}/>
                                                {/* <a className="btn-verify btn btn-h32 btn-fs-14" href="#"><span className="txt">Verify account</span></a> */}
                                            </div>
                                        </div>

                                        <div className="eb-body-block-field">
                                            <p className="eb-body-block-field-ttl">{t('FACEBOOK ACCOUNT')}</p>
                                            <div className="eb-body-block-field-wrapper">
                                                <input id="facebook_username" className="" type="text" placeholder={t('facebook username')}/>
                                                {/* <a className="btn-verify btn btn-h32 btn-fs-14" href="#"><span className="txt">Verify account</span></a> */}
                                            </div>
                                        </div>

                                        {/* <div className="eb-body-block-add">
                                            <a className="btn btn-h40 btn-fs-14" href="#">
                                                <span className="ico ico-l"><i className="fas fa-plus"></i></span>
                                                <span className="txt">Add more social account</span>
                                            </a>
                                        </div> */}
                                    </div>

                                    <p className="eb-body-txt">
                                        {t("To update your settings your should sign message through your wallet. Click 'Update profile' then sign the message.")}
                                    </p>

                                    <div className="eb-body-btn-group">
                                        <a className="btn btn-blue btn-mr8" onClick={() => this.Update()}>
                                            <span className="txt">{t('Update Profile')}</span>
                                        </a>
                                        <a className="btn btn-color-gray btn-no-border" onClick={() => this.Reset()}>
                                            <span className="ico ico-l"><i className="far fa-times-circle"></i></span>
                                            <span className="txt">{t('Clear all')}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div id="loading-popup" className="popup">
                    <div className="popup-box">
                        <div className="loading-popup-head">
                            <div className="loader"></div>
                            <p className="loading-popup-head-ttl">Please wait...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(ProfileEdit);