import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './index.css';
import App from './App';
import Header from './components/header';
import WelCome from './components/welcome';
import TopNFT from './components/top_nft';
import PickUp from './components/pickup';
import PopularSellers from './components/popular_sellers';
import HotBid from './components/hot_bid';
import HotCollection from './components/hot_collection';
import Discover from './components/discover';
import Earn from './components/earn';
import Footer from './components/footer';
import ProfileEdit from './components/profile_edit';
import Search from './components/search';
import SearchNoResult from './components/Search_no_result';
import SimpleNav from './components/simple_nav';
import Activity from './components/activity';
import Item from './components/item';
import FAQ from './components/faq';
import UploadType from './components/upload_type';
import UploadTwitterPage from './components/upload_twitter';
import UploadYoutubePage from './components/upload_youtube';
import UploadTiktokPage from './components/upload_twitter';
import UploadInstagramPage from './components/upload_instagram';
import ConnectWallet from './components/connect_wallet';
import ProfilePage from './pages/profile_page';
import UploadDetailPage from './pages/upload_detail_page';
import UploadSNSDetailPage from './pages/upload_sns_detail_page';
import ItemPage from './pages/item_page';
import reportWebVitals from './reportWebVitals';
import config from './globals/config';
import {useWallet, UseWalletProvider} from 'use-wallet';

import './libs/fontawesome/css/all.min.css';
import './libs/swiper/css/swiper-bundle.min.css';

import './js/script.js';
import SearchPage from './pages/search_page';

import './i18n';

var script = document.createElement('script');
script.src = '../../libs/jquery/jquery-3.5.1.min.js';
script.async = true;
document.body.appendChild(script);

script = document.createElement('script');
script.src = '../../libs/swiper/js/swiper-bundle.min.js';
script.async = true;
document.body.appendChild(script);

script = document.createElement('script');
script.src = '../../js/page/home.js';
script.async = true;
document.body.appendChild(script);

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

function Main () {
  return (
    <UseWalletProvider chainId={config.chain_id}>
      <Router>
        <Route exact path="/">
          <div>
            <Header/>
            <WelCome/>
            <TopNFT/>
            <PickUp/>
            <PopularSellers/>
            <HotBid/>
            {/* <HotCollection/> */}
            <Discover/>
            <Earn/>
            <Footer/>
          </div>
        </Route>
        <Route path="/profile/:address" component={ProfilePage}>
        </Route>
        <Route path="/edit_profile">
          <div>
            <Header/>
            <SimpleNav/>
            <ProfileEdit/>
            <Footer/>
          </div>
        </Route>
        <Route path="/search/" component={SearchPage}>
        </Route>
        <Route path="/search_keyword/:keyword" component={SearchPage}>
        </Route>
        <Route path="/search_no_result">
          <div>
            <Header/>
            <SearchNoResult/>
            <Footer/>
          </div>
        </Route>
        <Route path="/activity">
          <div>
            <Header/>
            <SimpleNav/>
            <Activity/>
            <Footer/>
          </div>
        </Route>
        <Route path="/item/:id" component={ItemPage}>
        </Route>
        <Route path="/faq">
          <div>
            <Header/>
            <FAQ/>
            <HotBid/>
            <Footer/>
          </div>
        </Route>
        <Route path="/upload/type">
          <div>
            <Header/>
            <SimpleNav/>
            <UploadType/>
            <Footer/>
          </div>
        </Route>
        <Route path="/upload/detail/:type" component={UploadDetailPage}>
        </Route>
        <Route path="/upload/snsdetail/:type/:sns_type/:id/:token" component={UploadSNSDetailPage}>
        </Route>
        <Route path="/upload/twitter/:type">
          <div>
            <Header/>
            <UploadTwitterPage/>
            <Footer/>
          </div>
        </Route>
        <Route path="/upload/youtube/:type">
          <div>
            <Header/>
            <UploadYoutubePage/>
            <Footer/>
          </div>
        </Route>
        <Route path="/upload/tiktok/:type">
          <div>
            <Header/>
            <UploadTiktokPage/>
            <Footer/>
          </div>
        </Route>
        <Route path="/upload/instagram/:type">
          <div>
            <Header/>
            <UploadInstagramPage/>
            <Footer/>
          </div>
        </Route>
        <Route path="/connect">
          <div>
            <Header/>
            <ConnectWallet/>
            <Footer/>
          </div>
        </Route>
      </Router>
    </UseWalletProvider>
  );
}



ReactDOM.render(
  <Main/>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
