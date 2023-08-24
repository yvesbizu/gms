import Heading from "../../common/Heading"
import "./style.css"
import React, { Component } from "react";
import { ethers } from "ethers";
import Mission from "../../../abis/Mission.json";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

class Location extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      loading: true,
      show: false,
      centerCount: 0,
      centers: [],
    };
    this.missionContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  }

  async componentWillMount() {
    await this.loadMissionData();
  }


  async loadMissionData() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const mission = new ethers.Contract(
        this.missionContractAddress,
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
  render() {
    return (
      <>
        <section className='location padding'>
          <div className='container'>
            <Heading title='Explore By Missionary centers' subtitle='Our platform features accommodation and retreat centers that provide support to missionaries. These facilities provide a variety of services and amenities to help missionaries work more comfortably and efficiently.' />

            <div className='content grid3 mtop'>
              {this.state.centers.map((center, key) => {
                return (
                  <div key={key} className='box' >
                    <Link to={`/mission/${center.id}`}>
                      <img src={center.image} alt='' />
                      <div className='overlay'>
                        <h5>{center.name}</h5>
                        <p>
                          <FontAwesomeIcon icon={faMapMarkerAlt} /> <label>{center.location}</label> <br />
                          <FontAwesomeIcon icon={faPhoneAlt} /> <label>{center.contact}</label> <br />
                          <FontAwesomeIcon icon={faEnvelope} /> <label>{center.email}</label>
                        </p>
                      </div>
                    </Link>
                  </div>

                );
              })}

            </div>
          </div>
        </section>
      </>
    );
  }
}

export default Location
