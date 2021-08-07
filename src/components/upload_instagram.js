import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {AddClass, ChangeClass} from '../js/common';
import config from '../globals/config';
import CONST from '../globals/constants';
import InstagramLogin from '@amraneze/react-instagram-login';
import InstagramEmbed from 'react-instagram-embed';
import axios from 'axios';
import oauth from 'axios-oauth-client';
import $ from 'jquery';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

class UploadInstagramPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {          
          isLoggedIn: false,
          userID: '',
          code: '',
          access_token: '',
          media_list: [],
          show_loading: true,
        };

        ChangeClass('upload');
        AddClass('has-popup');  
    }

    async getInstagramList() {
      this.showLoading();
      axios.get(config.instagram_api_url+'v11.0/' + this.state.userID +'/tweets?max_results=' + config.twitter_get_count, {
        headers: {
          'Authorization': 'Bearer ' + config.twitter_bearer_token,
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
          }
        })
        .then((res) => {
          if (res.data) {
              this.setState({tweets_list: res.data.data});
          }
        })
        .catch((err) => {
            console.log(err);
            this.hideLoading();
        })
    }

    async onTweetCreate(tweet_id){
      window.location = config.host_url + "/upload/snsdetail/"+ CONST.token_type.SINGLE + "/" + CONST.sns_type.TWITTER + "/" + tweet_id + "/" + this.state.oauth_token;
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

    async getAccessToken() {
      const res = oauth.client(axios.create(), {
        url: config.instagram_api_url+'oauth/access_token',
        grant_type: 'authorization_code',
        client_id: config.instagram_app_id,
        client_secret: config.instagram_app_secret,
        code: this.state.code,
        redirect_uri: window.location.href,
      });
      
      const response = await res();

      console.log(response);

      if (response.access_token) {
        axios.get(config.instagram_graph_api_url+'access_token?grant_type=ig_exchange_token&client_secret=' + config.instagram_app_secret +'/access_token=' + response.access_token, {
          })
          .then((res) => {
            if (res.access_token) {
                this.setState({access_token: res.access_token});
            }
          })
          .catch((err) => {
              console.log(err);
          })
      } else {
        alert('Instagram auth failed');
      }
    }

    responseInstagram = (res) => {
      console.log(res);
      if (res.error == null) {
        this.setState({ code: res});
        this.getAccessToken();
      } else {
        this.setState({ isLoggedIn: false});
      }
    };

    render() {
      return (
        <div>
          <section id="upload-lead" className="upload-lead">
              <div className="content sns-div align-center">
                {!this.state.isLoggedIn &&
                <InstagramLogin
                    clientId={config.instagram_app_id}
                    buttonText="Login with Instagram"
                    onSuccess={this.responseInstagram}
                    onFailure={this.responseInstagram}
                    scope="user_profile,user_media"
                />
                }
                {this.state.isLoggedIn &&
                  <div className="sns-div-item">
                    <a className="btn btn-h32 btn-blue" onClick={() => this.onTweetCreate()}><span>Create NFT</span></a>
                    <InstagramEmbed
                      url='https://instagr.am/p/Zw9o4/'
                      clientAccessToken={config.instagram_app_id + '|' + this.state.access_token}
                      maxWidth={320}
                      hideCaption={false}
                      containerTagName='div'
                      protocol=''
                      injectScript
                      onLoading={() => {}}
                      onSuccess={() => {}}
                      onAfterRender={() => {}}
                      onFailure={() => {}}
                    />
                  </div>
                }
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

export default UploadInstagramPage;