import React, { Component } from "react"
import Accomodation from '../../../abis/Accommodation.json'
import { BrowserRouter as Router, Routes, Route, Link, Switch } from 'react-router-dom'
import { ethers } from "ethers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faMapMarkerAlt, faPhoneAlt, faEnvelope, faBuilding, faCoins  } from '@fortawesome/free-solid-svg-icons'

class RecentCard extends Component {

  async componentWillMount() {
    await this.loadApartmentsData()
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
      
        this.setState({
          apartments: [...this.state.apartments, apartment]
        })
      
    }
    this.setState({ loading: false })
  
}

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true,
      fileUrl: '',
      show: false,
      accitemCount: 0,
      apartments: [],
      centers:[]
    }

    this.closeModal = this.closeModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.accommodationContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  }

  async closeModal() {
    this.setState({ show: false });
  }

  async showModal(event) {
    await this.setState({ roomId: event.target.id });
    this.setState({ show: true });
    console.log("Current Room ID ", this.state.roomId);
  }



  render() {
    return (
      <>
         
      
        <div className='content grid3 mtop'>
          {this.state.apartments.map((apartment, key) => {
            return (
              <div className='box shadow' key={key}>
                <div className='img'>
                  <Link to={`viewapartment/${apartment.id}`}>
                    <img src={apartment.image} alt='' />
                  </Link>                
                </div>
                <div className='text'>
                  <div className='category flex'>
                    <i className='fa fa-heart'></i>
                  </div>
                 <p><strong><FontAwesomeIcon icon={faBuilding} /> {apartment.name}</strong></p>
                  <p className="smallfont">
                  Owner: {apartment.owner}
                  </p>
                  <p>
                    {apartment.description}
                  </p>
                </div>
                <div className='button flex'>
                  <div>
                    <strong>
                    <FontAwesomeIcon icon={faCoins} /> {apartment.price.toString()} Eth</strong>
                      <label htmlFor=''>/Night</label>
                  </div>                 
                </div>
              </div>
            )
          })}
        </div>

        
      </>
    );
  }
}

export default RecentCard
