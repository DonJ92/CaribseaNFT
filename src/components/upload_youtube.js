import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {AddClass, ChangeClass} from '../js/common';
import config from '../globals/config';
import CONST from '../globals/constants';
import GoogleLogin from 'react-google-login';
import YouTube from 'react-youtube';
import axios from 'axios';
import $ from 'jquery';

class UploadYoutubePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {          
            isLoggedIn: false,
            accessToken: '',
            youtube_list: [],
            show_loading: true,
          };

        ChangeClass('upload');
        AddClass('has-popup');
    }

    async getYoutubeList()
    {
        this.showLoading();
        axios.get(config.youtube_api_url+'youtube/v3/search?part=snippet&forMine=true&type=video&maxResults='+ config.youtube_get_count +'&key=' + config.google_api_key, {
            headers: {
                'Authorization': 'Bearer ' + this.state.accessToken,
                'Accept': 'application/json',
            }
        })
        .then((res) => {
            if (res.data) {
                this.setState({youtube_list: res.data.items});
            }
        })
        .catch((err) => {
            console.log(err);
            this.hideLoading();
        })
    }

    onYoutubeCreate(youtube_id){
        window.location = config.host_url + "/upload/snsdetail/"+ CONST.token_type.SINGLE + "/" + CONST.sns_type.YOUTUBE + "/" + youtube_id + "/" + this.state.accessToken;
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

    responseGoogle = (res) => {
        console.log(res);
        if (res.accessToken != null) {
            this.setState({ isLoggedIn: true});
            this.setState({ accessToken: res.accessToken});
            this.getYoutubeList();
          } else {
            this.setState({ isLoggedIn: false});
          }
    }

    render() {
        return (
            <div>
                <section id="upload-lead" className="upload-lead">
                    <div className="content sns-div align-center">
                    {!this.state.isLoggedIn &&
                    <GoogleLogin
                        clientId={config.google_client_id}
                        buttonText="Login with Google"
                        theme="dark"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        scope="https://www.googleapis.com/auth/youtube"
                        cookiePolicy={'single_host_origin'}
                    />
                    }
                    {this.state.isLoggedIn &&
                        this.state.youtube_list.map((item, index) => {
                            if (this.state.youtube_list.length == index + 1) {
                              return (
                                <div className="sns-div-item">
                                  <a className="btn btn-h32 btn-blue mb-8" onClick={() => this.onYoutubeCreate(item.id.videoId)}><span>Create NFT</span></a>
                                  <YouTube videoId={item.id.videoId} opts={{ width: "300", height: "200" }} onReady={() => this.hideLoading()}/>
                                </div>
                              )
                            } else {
                              return (
                                <div className="sns-div-item">
                                  <a className="btn btn-h32 btn-blue mb-8" onClick={() => this.onYoutubeCreate(item.id.videoId)}><span>Create NFT</span></a>
                                  <YouTube videoId={item.id.videoId} opts={{ width: "300", height: "200" }}/>
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

export default UploadYoutubePage;