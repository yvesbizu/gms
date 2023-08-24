import React, { Component } from "react"
import img from "../images/pricing.jpg"
import Back from "../common/Back"
import "./newlisting.css"
import Accomodation from '../../abis/Accommodation.json'
import { ethers } from "ethers"
import { useParams } from "react-router-dom";
import ipfs from '../../ipfs';

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}

class Newmission extends Component {


    constructor(props) {
        super(props)
        this.state = {
            account: '',
            accitemCount: 0,
            apartments: [],
            loading: true,
            fileUrl: '',
            name: '',
            image: '',
            price: 0,
            roomNum: 0,
            bedNum: 0,
            description: ''

        };
        this.contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

        // this.createCenter = this.createApartment.bind(this)
    }

    async componentWillMount() {
        await this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        const accommodation = new ethers.Contract(
            this.contractAddress,
            Accomodation,
            provider
        );

        this.setState({ accommodation })
        this.setState({ loading: false })
    }


    onChange = async (e) => {
        const file = e.target.files[0]
        try {
            const added = await ipfs.add(file)
            const url = `https://global-mission.infura-ipfs.io/ipfs/${added.path}`
            this.setState({ fileUrl: url })
            console.log(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    };


    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            this.setState({ loading: true });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const accomodationContract = new ethers.Contract(this.contractAddress, Accomodation, signer);
            const tx = await accomodationContract.createAccitem(
                this.props.params.id,
                this.state.name,
                this.state.fileUrl,
                this.state.price,
                this.state.roomNum,
                this.state.bedNum,
                this.state.description,
                {
                    gasLimit: 1000000 // specify the gas limit here
                }
            );

            this.setState({
                name: '',
                image: '',
                price: 0,
                roomNum: 0,
                bedNum: 0,
                description: '',
                loading: false
            });

            await tx.wait();
            alert('Apartment created successfully!');
            // Redirect to another page after the transaction is processed
            window.location.href = '/mymission';
        } catch (err) {
            console.log(err);
            alert('Failed to create apartment.');
            this.setState({ loading: false });
        }
    }


    render() {
        return (
            <>
                <section className='contact mb'>
                    <Back name='Add Apartment' title='Missionaries network Apartment' cover={img} />
                    <p>&nbsp;</p>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">Add Apartments</h5>
                                    </div>
                                    {this.state.loading
                                        ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                                        :
                                        <div className="card-body">
                                            <form onSubmit={this.handleSubmit}>
                                                <div className="form-group row">
                                                    <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                                                    <div className="col-sm-10">
                                                        <input type="text" id="name" className="form-control" placeholder="Enter name" value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="image" className="col-sm-2 col-form-label">Image URL</label>
                                                    <div className="col-sm-10">
                                                        <input type="file" id="image" name="image" className="form-control" placeholder="Enter image URL" onChange={this.onChange} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="bedNum" className="col-sm-2 col-form-label">Beds</label>
                                                    <div className="col-sm-4">
                                                        <input type="number" id="bedNum" className="form-control" placeholder="Enter number of beds" value={this.state.bedNum} onChange={(event) => this.setState({ bedNum: event.target.value })} />
                                                    </div>
                                                    <label htmlFor="roomNum" className="col-sm-2 col-form-label">Rooms</label>
                                                    <div className="col-sm-4">
                                                        <input type="number" id="roomNum" className="form-control" placeholder="Enter number of rooms" value={this.state.roomNum} onChange={(event) => this.setState({ roomNum: event.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="price" className="col-sm-2 col-form-label">Price</label>
                                                    <div className="col-sm-10">
                                                        <input type="number" id="price" className="form-control" placeholder="Enter price" value={this.state.price} onChange={(event) => this.setState({ price: event.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
                                                    <div className="col-sm-10">
                                                        <textarea id="description" className="form-control" placeholder="Enter description" value={this.state.description} onChange={(event) => this.setState({ description: event.target.value })}></textarea>
                                                    </div>
                                                </div>
                                                <br />
                                                <button className="btn btn-primary btn-sm" type="submit"> Submit </button>
                                            </form>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}

export default withParams(Newmission)
