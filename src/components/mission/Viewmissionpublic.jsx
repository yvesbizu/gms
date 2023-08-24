import React, { Component } from "react"
import Back from "../common/Back"
import Heading from "../common/Heading"
import img from "../images/about.jpg"
import "./viewmission.css"
import Mission from '../../abis/Mission.json'
import Accomodation from '../../abis/Accommodation.json'
import { ethers } from "ethers";
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}


class Viewmissionpublic extends Component {
  async componentWillMount() {

    await this.loadMission1Data()
    await this.loadApartmentsData()
  }

  constructor(props) {
    super(props)
    this.state = {
      center_id: null,
      center_name: '',
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

  async loadMission1Data() {
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
      if (apartment.centerId ==  this.props.params.id) {
        this.setState({
          apartments: [...this.state.apartments, apartment]
        })
      } else {
        console.log("This hotel has no rooms");
      }
    }
    this.setState({ loading: false })
  }





  render() {
    return (
      <>
        <section className='My Dashboard'>
          <Back cover={img} />
          <div className='container flex mtop'>
            <div>
              <p>Address: {this.state.center_address}</p>
              <p>Contact: {this.state.contact}</p>
              <p>Location: {this.state.location}</p>
              <p>Email: {this.state.email}</p>

              <Link to='' className='btn btn-primary btn-small'>Contact</Link>
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
                      <h5>{apartment.name}</h5>
                      <p className="smallfont">
                        <i className='fa fa-location-dot'></i>{apartment.owner}
                      </p>
                      <p>
                        <i className='fa fa-location-dot'></i>Location
                      </p>
                    </div>
                    <div className='container button flex'>
                      <div>
                        <button onClick={this.showModal} className='btn btn-primary btn-sm'>{apartment.price.toString()} Eth</button> <label htmlFor=''>/Night</label>
                      </div>
                      <span>Type</span>
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

export default withParams(Viewmissionpublic)
