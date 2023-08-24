import React, { useState, Component } from "react"
import "./header.css"
import { Link } from 'react-router-dom';
import Mission from '../../../abis/Mission.json'
import { ethers } from "ethers";

class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      centerCount: null,
      centers: [],
      mission: false
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
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      this.setState({ account });
      const mission = new ethers.Contract(
        this.contractAddress,
        Mission,
        provider
      );
      this.setState({ mission });       
 
       const centerCount = await this.state.mission.centerCount(); 
       for (var i = 1; i <= centerCount; i++) {        
         const center = await this.state.mission.getCenter(i)
         if (center.owner === this.state.account) {
           this.setState({ mission:true })
         } else {
           console.log("No Center found", 9);
         }
       }

    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <>
        <header>
          <div className='container flex'>
            <div className='logo'>
              <Link to="/"> <img src='../images/logo.png' alt='' /> </Link>
            </div>
            <div className='nav'>
              <ul className="">
                <li>
                  <Link to="/">Home</Link>
                  {this.state.mission == true
                    ?
                    <Link to={`/mymission`}> My dashboard</Link>
                    :
                    <Link to={`/register`} >Register Center</Link>
                  }
                  <div className="small"> <br /> Address: {this.state.account} </div>
                </li>
              </ul>
            </div>
            <div className='button flex'>

            </div>
          </div>
          <br />
        </header>
      </>
    );
  }
}
export default Header
