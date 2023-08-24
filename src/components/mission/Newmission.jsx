import React, { Component } from "react";
import img from "../images/pricing.jpg";
import Back from "../common/Back";
import "./newmission.css";
import Mission from "../../abis/Mission.json";
import { ethers } from "ethers";
import ipfs from "../../ipfs";


class Newmission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      centers: [],
      name: "",
      image: "",
      address_: "",
      contact: "",
      location: "",
      email: "",
      mission: null,
      account: null,
      loading: true,
      fileUrl: '',
      centerCount: 0,

    };
    this.contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  }

  async componentDidMount() {
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const mission = new ethers.Contract(
        this.contractAddress,
        Mission,
        provider
      );
      this.setState({ mission });
      //const centerCount = await this.state.mission.centerCount();
    //  console.log('Mission: ', centerCount.toString());
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

  onChange = async (e) => {
    const file = e.target.files[0];
    try {
      const added = await ipfs.add(file);
      const url = `https://global-mission.infura-ipfs.io/ipfs/${added.path}`;
      this.setState({ fileUrl: url });
      console.log(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };


  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      this.setState({ loading: true });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const missionContract = new ethers.Contract(this.contractAddress, Mission, signer);
      const tx = await missionContract.createCenter(
        this.state.name,
        this.state.fileUrl,
        this.state.address_,
        this.state.contact,
        this.state.location,
        this.state.email, 
        {
          gasLimit: 1000000 // specify the gas limit here
        }       
      );

      this.setState({
        name: "",
        image: "",
        address_: "",
        contact: "",
        location: "",
        email: ""
      });

      await tx.wait();
      alert("Center created successfully!");
      // Redirect to another page after the transaction is processed
      window.location.href = "/mymission";
    } catch (err) {
      console.log(err);
      alert("Failed to create center.");
    }
  }

  render() {
    return (
      <>
        <section className="contact mb">
          <Back
            name="Mission registration"
            title="Join our network of missionaries"
            cover={img}
          />
          <p>&nbsp;</p>
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Register mission</h4>
                  </div>
                  {this.state.loading ? (
                    <div id="loader" className="text-center">
                      <p className="text-center">Loading...</p>
                    </div>
                  ) : (
                    <div className="card-body">
                      <form onSubmit={this.handleSubmit}>
                        <div className="form-group row">
                          <input type="text" id="name" className="form-control form-control-sm" placeholder="Enter name" value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} />
                        </div>
                        <div className="form-group row">
                          Featured Image. <input type="file" id="image" name="image" className="form-control-file" onChange={this.onChange} />
                        </div>
                        <div className="form-group row">
                          <input type="text" id="address" className="form-control form-control-sm" placeholder="Enter address" value={this.state.address_} onChange={(event) => this.setState({ address_: event.target.value })} />
                        </div>
                        <div className="form-group row">
                          <input type="text" id="contact" className="form-control form-control-sm" placeholder="Enter contact number" value={this.state.contact} onChange={(event) => this.setState({ contact: event.target.value })} />
                        </div>
                        <div className="form-group row">
                          <input type="text" id="location" className="form-control form-control-sm" placeholder="Enter location" value={this.state.location} onChange={(event) => this.setState({ location: event.target.value })} />
                        </div>
                        <div className="form-group row">
                          <input type="email" id="location" className="form-control form-control-sm" placeholder="Enter email address" value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} />
                        </div>
                        
                        <br />
                        <button className="btn btn-primary btn-sm" type="submit">Register</button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}
export default Newmission;
