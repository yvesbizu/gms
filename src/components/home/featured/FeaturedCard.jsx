import React, { Component } from "react";
import { ethers } from "ethers";
import Mission from "../../../abis/Mission.json";
import { Link } from 'react-router-dom';

class FeaturedCard extends Component {
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
        <div className="content grid5 mtop">
          {this.state.centers.map((center, key) => {
            return (
              <div key={key}>
                <Link to={`/mission/${center.id}`}> <img src={center.image} alt="" />
                </Link>
                <h4>{center.name}</h4>
                <label></label>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default FeaturedCard;
