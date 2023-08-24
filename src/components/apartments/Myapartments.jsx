import React, { Component } from "react"
import img from "../images/pricing.jpg"
import Back from "../common/Back"
import "./newlisting.css"
import Accomodation from '../../abis/Accommodation.json'
import Web3 from 'web3'
import { useParams, Link } from "react-router-dom";

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}

class Myapartment extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Accomodation.networks[networkId]
        if (networkData) {
            const accommodation = web3.eth.Contract(Accomodation.abi, networkData.address)
            this.setState({ accommodation })
            const accitemCount = await accommodation.methods.accitemCount().call()
            this.setState({ accitemCount })

            // Load apartments
            for (var i = 1; i <= accitemCount; i++) {
                const apartment = await accommodation.methods.accitems(i).call()
                if ( apartment.center_id == this.props.params.id) {             
                    console.log("Center id:", this.props.params.id);
                    this.setState({
                        apartments: [...this.state.apartments, apartment]
                    })
                } else {
                    console.log("This hotel has no rooms");
                }
            }
            this.setState({ loading: false })
        } else {
            window.alert('Mission contract not deployed to detected network.')
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            accitemCount: 0,
            apartments: [],
            loading: true,
            fileUrl: ''
        }
    }


    render() {
        return (
            <>
                <section className='contact mb'>
                    <Back name='All our Apartment' title='Missionaries network' cover={img} />
                    <p>&nbsp;</p>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">All my Apartments</h5>
                                    </div>
                                    {this.state.loading
                                        ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                                        :
                                        <div className="card-body">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Owner</th>
                                                        <th scope="col">Center</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Price</th>
                                                        <th scope="col">Number of Rooms</th>
                                                        <th scope="col">Number of Bed</th>
                                                        <th scope="col">Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.apartments.map((apartment, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <th scope="row">1</th>
                                                                <td>{apartment.image}</td>
                                                                <td>{ apartment.center_id.toString()}</td>
                                                                <td>{apartment.name}</td>
                                                                <td>{window.web3.utils.fromWei(apartment.price.toString(), 'Ether')} ETH</td>
                                                                <td>{apartment.room_num.toString()}</td>
                                                                <td>{apartment.bed_num.toString()}</td>
                                                                <td>{apartment.description}</td>
                                                                <td>{apartment.description}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
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

export default withParams(Myapartment)
