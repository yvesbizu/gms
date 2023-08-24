import React, { Component } from "react"
import Back from "../common/Back"
import Heading from "../common/Heading"
import img from "../images/about.jpg"
import "./viewmission.css"
import Mission from '../../abis/Mission.json'
import Accomodation from '../../abis/Accommodation.json'
import { ethers } from "ethers";
import { Link } from "react-router-dom"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope, faBuilding, faCoins } from '@fortawesome/free-solid-svg-icons';


class Viewmission extends Component {
  async componentWillMount() {
    await this.loadMissionData()
    await this.loadApartmentsData()
  }

  constructor(props) {
    super(props)
    this.state = {
      center_id: null,
      name: '',
      featured_image: '',
      mission_address: '',
      contact: '',
      location: '',
      email: '',
      accitemCount: 0,
      apartments: [],
    };
    this.missionContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    this.accommodationContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  }

  async loadMissionData() {


    //////////////////////////////
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    const mission = new ethers.Contract(
      this.missionContractAddress,
      Mission,
      provider
    )
    this.setState({ mission })

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    this.setState({ account });


    this.setState({ mission })
    const centerCount = await this.state.mission.centerCount()
    this.setState({ centerCount })
    console.log("This hotel has no rooms", centerCount.toString());
    // Load center
    for (var i = 1; i <= centerCount; i++) {
      const center = await this.state.mission.getCenter(i)
      if (center.owner === this.state.account) {

        this.setState({
          center_id: center.id,
          center_name: center.name,
          featured_image: center.image,
          center_address: center.address_,
          contact: center.contact,
          location: center.location,
          email: center.email
        });


      } else {
        console.log("No Center found", 9);
      }
    }
    this.setState({ loading: false })

  }

  async loadApartmentsData() {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    const accommodation = new ethers.Contract(
      this.accommodationContractAddress,
      Accomodation,
      provider
    );

    this.setState({ accommodation })

    const accitemCount = await this.state.accommodation.accitemCount()
    this.setState({ accitemCount })

    // Load apartments
    for (var i = 1; i <= accitemCount; i++) {
      const apartment = await accommodation.getAccitem(i)
      if (apartment.owner == this.state.account) {
        this.setState({
          apartments: [...this.state.apartments, apartment]
        })
      } else {
        console.log("This hotel has no rooms");
      }
    }
    this.setState({ loading: false })

  }


  async closeModal() {
    this.setState({ show: false });
  }

  async showModal(event) {
    await this.setState({ roomId: event.target.id });
    this.setState({ show: true });
    console.log("Current Room ID ", this.state.roomId);
  }

  key = async (e) => {
    const file = e.target.files[0]
    try {
      this.setState({ nights: e.target.value })
      console.log('name is: ', this.state.nights)

    } catch (error) {
      console.log('Error: ', error)
    }
  };

  render() {
    return (
      <>
        <section className='My Dashboard'>
          <Back name='Center Details' title={`Welcome ${this.state.center_name} Center/Mission`} cover={img} />
          <div className='container flex mtop'>
            <div>
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Address: {this.state.center_address}
              </p>
              <p>
                <FontAwesomeIcon icon={faPhoneAlt} /> Contact: {this.state.contact}
              </p>
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Location: {this.state.location}
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} /> Email: {this.state.email}
              </p>

              <Link to={`/newapartment/${this.state.center_id}`} className='btn btn-primary btn-small'>List Apartment</Link>
            </div>
            <div className='right row'>
              <img src={this.state.featured_image} className="rounded mission-img img-thumbnail float-right" />
            </div>
          </div>
          <br />

          <div className='container flex'>
            <div className="content grid3 mtop">
              {this.state.apartments.map((apartment, key) => {
                return (
                  <div className='box shadow' key={key}>
                    <div className='img'>
                      <Link to={`viewlisting/${apartment.id}`}>
                        <img src={apartment.image} alt='' />
                      </Link>
                    </div>
                    <div className='container text'>
                      <div className='category flex'>
                        <i className='fa fa-heart'></i>
                      </div>
                      <br />
                      <p><FontAwesomeIcon icon={faBuilding} /> Apartment name:  {apartment.name}</p>
                      <p className="smallfont">
                        Owner: {apartment.owner}
                      </p>
                    </div>
                    <div className='container button flex'>
                      <div>
                      </div>
                      <span> <FontAwesomeIcon icon={faCoins} /> Price: {apartment.price.toString()} ETH </span>
                    </div>
                    <br />
                  </div>
                )
              })}
            </div>
          </div>

          <br />

        </section>


      </>
    );
  }
}

export default Viewmission
