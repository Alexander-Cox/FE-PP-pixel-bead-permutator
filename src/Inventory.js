import React, { Component } from 'react';
import './Inventory.css';
import Pictogram from './components/Pictogram';

class Inventory extends Component {
    state = {
        username: '',
        user_id: 0,
        items: [],
        new_beads: []
    }

    componentDidMount = () => {
        const { user_id, username } = this.props;
        this.setState({ user_id, username });
        this.fetchInventoryData(user_id);
    }

    fetchInventoryData = (user_id) => {
        Promise.all([
            fetch(`http://localhost:3000/api/inventory/${user_id}`),
            fetch('http://localhost:3000/api/beads')
        ])
            .then(([items, beads]) => {
                return Promise.all([items.json(), beads.json()])
            })
            .then(([items, beads]) => {
                const curr_beadsIds = items.map(item => item.bead_id);
                const new_beads = beads.filter(bead => curr_beadsIds.indexOf(bead.id) === -1);
                return this.setState({ items, new_beads })
            });
    }

    resetInventoryState = () => {
        const { user_id } = this.state
        this.fetchInventoryData(user_id);
    }

    getTotalBeads = () => {
        const { items } = this.state;
        return items.reduce((acc, item) => {
            return acc + item.quantity;
        }, 0);
    }

    putInventoryBeadsUp(event) {
        const { target } = event;
        return console.dir(target);
    }



    displayMoreBeads = () => {
        const { new_beads } = this.state;
        const addBeads = new_beads.map((bead) => {
            return (
                <div class="box">
                    <div class="columns">
                        <div class="column bead-colour-div" style={{ backgroundColor: `rgb(${bead.r},${bead.g},${bead.b})` }}>
                            <p className="p-inv">Brand: {bead.brand}</p>
                            <p className="p-inv">Colour: {bead.colour_name}</p>
                            <p className="p-inv">Style: {bead.style}</p>
                            <p className="p-inv">Size: {bead.size}</p>
                        </div>
                        <div class="column is-one-quarter">
                            <input id="amount" class="input is-small" type="text" placeholder="Amount" />
                            <a class="button is-primary is-small">+</a>
                        </div>
                    </div>
                </div>
            )
        })
        return addBeads;
    }

    render() {
        const { username, items } = this.state;
        const total = this.getTotalBeads();
        return (
            <div>
                <div className="hero background-color-complement-2">
                    <p>My Inventory</p>
                </div>
                <div className="background-color-complement-0">
                    <div id="inventoryContent">
                        <h1>{"Showing beads for " + username + ": " + total + " Beads Total"}</h1>
                        <Pictogram items={items} total={total} resetInventoryState={this.resetInventoryState} />
                        <div className="inventory-add background-color-complement-3">
                            <h1 id="inv_id_h1">Add To Your Inventory:</h1>
                            <div class="bead_shop">
                                {
                                    this.displayMoreBeads()
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Inventory;