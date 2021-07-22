import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {AddClass, ChangeClass} from '../js/common';
import config from '../globals/config';
import CONST from '../globals/constants';
import InstagramLogin from '@amraneze/react-instagram-login';
import axios from 'axios';
import $ from 'jquery';

class UploadInstagramPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {          
          isLoggedIn: false,
          userID: '',
          user_name: '',
          oauth_token: '',
          tweets_list: [],
          show_loading: true,
        };

        ChangeClass('upload');
        AddClass('has-popup');
    }

    async getTweetsList(user_id) {
      this.showLoading();
      axios.get(config.cors_url + config.twitter_api_url+'2/users/'+ user_id +'/tweets?max_results=' + config.twitter_get_count, {
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
      document.location = "/upload/snsdetail/"+ CONST.token_type.SINGLE + "/" + CONST.sns_type.TWITTER + "/" + tweet_id + "/" + this.state.oauth_token;
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

    responseInstagram = (res) => {
      console.log(res);
      if (res != null) {
        this.setState({ isLoggedIn: true});
        this.setState({ userID: res.user_id});
        this.setState({ user_name: res.screen_name});
        this.setState({ oauth_token: res.oauth_token});
        this.getTweetsList(res.user_id);
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
                    clientId="5fd2f11482844c5eba963747a5f34556"
                    buttonText="Login with Instagram"
                    onSuccess={this.responseInstagram}
                    onFailure={this.responseInstagram}
                />
                }
                {this.state.isLoggedIn &&
                  this.state.tweets_list.map((item, index) => {
                    if (this.state.tweets_list.length == index + 1) {
                      return (
                        <div className="sns-div-item">
                          <a className="btn btn-h32 btn-blue" onClick={() => this.onTweetCreate(item.id)}><span>Create NFT</span></a>
                          
                        </div>
                      )
                    } else {
                      return (
                        <div className="sns-div-item">
                          <a className="btn btn-h32 btn-blue" onClick={() => this.onTweetCreate(item.id)}><span>Create NFT</span></a>
                          
                        </div>
                      )
                    }
                  })
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