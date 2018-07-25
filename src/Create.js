import React, { Component } from 'react';
import Pixel_Board from './components/Pixel_Board';
import BeadSummary from './components/BeadSummary';
import './Create.css';

class Create extends Component {
    state = {
        image_url_input: '',
        width_input: '60',
        height_input: '60',
        title_input: '',
        tag_input: '',
        image_url: '',
        width_px: '0',
        height_px: '0',
        tempSolution: [],
        items: [],
        tags: []
    }

    handleWidthInputChange = (e) => {
        const { target: { value } } = e;
        if (+value > 100) {
            this.setState({ width_input: '100' });
        } else {
            this.setState({ width_input: value });
        }
    }

    handleHeightInputChange = (e) => {
        const { target: { value } } = e;
        if (+value > 100) {
            this.setState({ height_input: '100' });
        } else {
            this.setState({ height_input: value });
        }
    }

    handleURLInputChange = (e) => {
        const { target: { value } } = e;
        this.setState({ image_url_input: value });
    }

    handleTitleInputChange = (e) => {
        const { target: { value } } = e;
        this.setState({ title_input: value });
    }

    handleTagInputChange = (e) => {
        const { target: { value } } = e;
        this.setState({ tag_input: value });
    }

    addHashtag = () => {
        const { tag_input, tags } = this.state;
        if (tags.indexOf(tag_input) === - 1) {
            const tagArr = [...tags, tag_input];
            this.setState({ tags: tagArr, tag_input: '' });
        } else {
            this.setState({ tag_input: '' });
        }
    }

    removeHashtag = (tag) => {
        const { tags } = this.state;
        const newTags = tags.reduce((acc, curr) => {
           if (curr !== tag) {
               acc.push(curr);
           }
           return acc;
        }, []);
        this.setState({ tags: newTags });
    }

    loadImage = () => {
        const { image_url_input } = this.state;
        this.setState({ image_url: image_url_input });
    }

    fetchTempSolution = () => {
        const { image_url, width_input, height_input } = this.state;
        const fetchURL = `http://localhost:3000/api/beads/temp?width=${width_input}&height=${height_input}&url=${image_url}`;
        console.log(fetchURL);
        fetch(fetchURL)
            .then(res => res.json())
            .then(tempSolution => this.setState({ tempSolution, width_px: width_input, height_px: height_input }))
            .then(() => this.summarizeTempBeads());
    }

    summarizeTempBeads = () => {
        const { tempSolution } = this.state;
        const items = tempSolution.reduce((acc, bead) => {
            const tempColour = acc.find(colour => {
                return colour.bead_id === bead.bead_id;
            })
            if (tempColour) {
                tempColour.quantity++;
            } else if (bead.colour_name !== null) {
                acc.push({ ...bead, quantity: 1 });
            }
            return acc;
        }, [])
            .sort((a, b) => b.quantity - a.quantity);
        this.setState({ items })
    }

    calcTotalBeads = () => {
        const { items } = this.state;
        return items.reduce((acc, item) => {
            return acc + item.quantity;
        }, 0);
    }

    render() {
        const { image_url, width_px, height_px, image_url_input, width_input, height_input, tempSolution, items, title_input, tag_input, tags } = this.state;
        const total = this.calcTotalBeads();
        return (
            <div className="background-color-primary-0">
                <div className="hero background-color-primary-2">
                    <p>Create some Pixel Art!</p>
                </div>
                <div id="CreateForm" >
                    <div className="field">
                        <label className="label">Image URL:</label>
                        <div className="control">
                            <input className="input is-small" type="text" placeholder="Text input" value={image_url_input} onChange={this.handleURLInputChange} />
                        </div>
                        <div className='card-content is-flex is-horizontal-center'>
                            <input className="button button-create" type="submit" value="Load Image" onClick={this.loadImage} />
                        </div>
                        <div className='card-content is-flex is-horizontal-center'>
                            <figure className="image is-128x128 create-image">
                                <img src={image_url || require('./images/PBP-logo-3.png')} />
                            </figure>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <label className="label">Width (beads):</label>
                                <input className="input is-small" type="text" placeholder="Text input" value={width_input} onChange={this.handleWidthInputChange} />
                            </div>
                            <div className="column">
                                <label className="label">Height (beads):</label>
                                <input className="input is-small" type="text" placeholder="Text input" value={height_input} onChange={this.handleHeightInputChange} />
                            </div>
                        </div>
                        <div className='card-content is-flex is-horizontal-center'>
                            <input className="button button-create" type="submit" value="Generate Solution" onClick={this.fetchTempSolution} />
                        </div>
                    </div>
                    <h1 id="create-beads-h1">{total > 0 ? ("Solution:") : ''}</h1>
                </div>
                <Pixel_Board board={tempSolution} width={width_px} height={height_px} image_url={image_url} />
                <div id="CreateForm" >
                    <h1 id="create-beads-h1">{total > 0 ? ("Beads required: " + total + " total") : ''}</h1>
                    <div class="bead_shop">
                        {
                            items.map((item) => {
                                return (
                                    <BeadSummary bead={item} />
                                )
                            })
                        }
                    </div>
                    <div className="field">
                        <label className="label">Solution Title:</label>
                        <div className="control">
                            <input className="input is-small" type="text" placeholder="Text input" value={title_input} onChange={this.handleTitleInputChange} />
                        </div>
                        <br />
                        <label className="label">Solution Hashtags:</label>
                        <div className="columns">
                            <div className="column">
                                <div className="control">
                                    <input className="input is-small" type="text" placeholder="Text input" value={tag_input} onChange={this.handleTagInputChange} />
                                </div>
                            </div>
                            <div className="column">
                                <div className=''>
                                    <input className="button button-create is-small" type="submit" value="Add Hashtag" onClick={this.addHashtag} />
                                </div>
                            </div>
                        </div>
                            <TagList tags={tags} removeHashtag={this.removeHashtag} />
                        <div className='card-content is-flex is-horizontal-center'>
                            <input className="button button-create" type="submit" value="Submit Solution" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Create;

const TagList = (props) => {
    const { tags, removeHashtag } = props;
    return (
        <div class="field is-grouped is-grouped-multiline">
            {
                tags.map((tag, i) => {
                    return (
                        <div key={i + tag} class="control">
                            <div class="tags has-addons">
                                <span class="tag">{tag}</span>
                                <span class="tag is-delete" onClick={() => removeHashtag(tag)} ></span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}