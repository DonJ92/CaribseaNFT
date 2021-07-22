import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Profile from '../components/profile';

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);

        const { address } = this.props.match.params;console.log(address);

        this.state = {
            address: address
        }
    }

    render() {
        return (
            <div>
                <Header/>
                <Profile address={ this.state.address }/>
                <Footer/>
            </div>
        );
    }
}

export default ProfilePage;