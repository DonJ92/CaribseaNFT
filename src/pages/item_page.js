import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Item from '../components/item';

class ItemPage extends React.Component {
    constructor(props) {
        super(props);

        const { id } = this.props.match.params;

        this.state = {
            id: id
        }
    }

    render() {
        return (
            <div>
                <div>
                    <Header/>
                    <Item id={this.state.id}/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default ItemPage;