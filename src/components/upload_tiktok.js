import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {AddClass, ChangeClass} from '../js/common';
import config from '../globals/config';
import CONST from '../globals/constants';
import axios from 'axios';
import $ from 'jquery';

class UploadTiktokPage extends React.Component {
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

    authHandler = (err, data) => {
      console.log(data);
      if (data != null) {
        this.setState({ isLoggedIn: true});
        this.setState({ userID: data.user_id});
        this.setState({ user_name: data.screen_name});
        this.setState({ oauth_token: data.oauth_token});
        this.getTweetsList(data.user_id);
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
                <div></div>
                }
                {this.state.isLoggedIn &&
                  <div></div>
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

export default UploadTiktokPage;