
import React, { Component } from "react";
import img from "../images/pricing.jpg";
import Back from "../common/Back";
import "./newmission.css";
import { ethers } from "ethers";
import Mission from "../../abis/Mission.json";
import {  Link } from "react-router-dom";

class Newmission extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: "",
            centerCount: 0,
            centers: [],
            loading: true,
            fileUrl: "",
        };
        this.contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    }

    async componentDidMount() {
        await this.loadBlockchainData();
        
    }

    async loadBlockchainData() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Fetch the network information
    const network = await provider.getNetwork();
    const networkName = network.name;

    console.log("Current network:", networkName);

            const mission = new ethers.Contract(
                this.contractAddress,
                Mission,
                provider
            )
           this.setState({ mission })    
            const centerCount = await this.state.mission.centerCount();       
            console.log(centerCount.toString());

           
           
            this.setState({ centerCount })
            // Load centers
            for (var i = 1; i <= centerCount; i++) {
                const center = await this.state.mission.getCenter(i)
                this.setState({
                    centers: [...this.state.centers, center]
                })
            }



            this.setState({ loading: false });


            window.ethereum.on("accountsChanged", async () => {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const account = ethers.utils.getAddress(accounts[0]);
                this.setState({ account });
            });
        } catch (error) {
            console.log(error);
        }
    }

    async fetchCenters() {
        const centers = [];
        const centerCount = await this.state.mission.centerCount();
      
        for (let i = 0; i < centerCount; i++) {
          const center = await this.state.mission.centers(i);
          centers.push(center);
        }
      
        this.setState({ centers });
      }

    render() {
        return (
            <>
                <section className='contact mb'>
                    <Back name='Registered centers' title='Missionaries network center' cover={img} />
                    <p>&nbsp;</p>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">All centers</h5>
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
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Address</th>
                                                        <th scope="col">Location</th>
                                                        <th scope="col">Contact</th>
                                                        <th scope="col">Email</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.centers.map((center, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <th scope="row">{center.id.toString()}</th>
                                                                <td>{center.owner}</td>
                                                                <td>{center.name}</td>
                                                                <td>{center.address_}</td>
                                                                <td>{center.location}</td>
                                                                <td>{center.contact}</td>
                                                                <td>{center.email}</td>
                                                                <td><Link to='' className="btn btn-primary btn-sm"> Approve </Link> </td>
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

export default Newmission
