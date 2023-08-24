import React, { Component } from "react"
import Back from "../common/Back"
import Heading from "../common/Heading"
import img from "../images/about.jpg"
import "./viewapartment.css"
import Accommodation from '../../abis/Accommodation.json'
import { ethers } from "ethers"
import { useParams } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faUser, faBuilding,faBed, faDoorOpen, faInfoCircle, faCalendarAlt, faEquals } from '@fortawesome/free-solid-svg-icons'


function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class Viewlisting extends Component {
  async componentWillMount() {
    await this.loadBlockchainData()
  }

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      pricePerDay: '',
      price: 0,
      price: '',
      image: '',
      room_num: null,
      bed_num: null,
      description: '',
      isBooked: null,
      owner: null,
      from: '',
      to: ''
    };
    this.accommodationContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  }

  async loadBlockchainData() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    const accommodation = new ethers.Contract(
      this.accommodationContractAddress,
      Accommodation,
      provider
    );

    this.setState({ accommodation })
    // Load products 
    const apartmemt = await accommodation.getAccitem(this.props.params.id)
    this.setState({
      name: apartmemt.name,
      pricePerDay: apartmemt.price.toString(),
      image: apartmemt.image,
      room_num: apartmemt.roomNum.toString(),
      bed_num: apartmemt.bedNum.toString(),
      description: apartmemt.description,
      isBooked: apartmemt.isBooked,
      owner: apartmemt.owner
    });
    console.log("Product", this.props.params.id);
    this.setState({ loading: false })
  }

  handleBooking = async (event) => {
    event.preventDefault();
    try {
      this.setState({ loading: true });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const accomodationContract = new ethers.Contract(this.accommodationContractAddress, Accommodation, signer);

      let price = this.state.price;

      const priceInWei = ethers.utils.parseEther(price.toString());
      //const numDays = this.state.days;
      const numDays = parseInt(this.state.days.toString());
      const tx = await accomodationContract.bookAccitem(
        this.props.params.id, 2, {
        value: priceInWei,
        gasLimit: 1000000 // specify the gas limit here
      }
      );

      this.setState({ loading: false });

      await tx.wait();
      alert('Apartment booked successfully!');
      // Redirect to another page after the transaction is processed
      window.location.href = '/mybookings';
    } catch (err) {
      console.log(err);
      alert('Failed to book apartment.');
      this.setState({ loading: false });
    }
  }


  handleDateChange = (event) => {
    const { name, value } = event.target;
    const { from, to } = this.state;

    // If both dates are set, calculate the number of days and price
    if (name === 'to' && from) {
      const fromDate = new Date(from);
      const toDate = new Date(value);
      const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
      const price = this.state.pricePerDay * days;

      this.setState({ to: value, days, price });
    } else if (name === 'from' && to) {
      const fromDate = new Date(value);
      const toDate = new Date(to);
      const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
      const price = this.state.pricePerDay * days;

      this.setState({ from: value, days, price });
    } else {
      this.setState({ [name]: value });
    }
  }

  render() {
    return (
      <>
        <section className='about'>
          <Back name='Apartment' title='Missionaries network Apartment.' cover={img} />
          <div className='container flex mtop'>
            <div className='container text'>
           
              <table>
                <tr>
                  <td>
                    <p>
                    <FontAwesomeIcon icon={faBuilding} /> Apartment name: {this.state.name} <br />                   
                      <FontAwesomeIcon icon={faCoins} /> Price: {this.state.pricePerDay} ETH  <br />                 
                      <FontAwesomeIcon icon={faUser} /> Owner: {this.state.owner} <br />                  
                      <FontAwesomeIcon icon={faBed} /> Number of beds: {this.state.bed_num} <br />                  
                      <FontAwesomeIcon icon={faDoorOpen} /> Number of rooms: {this.state.room_num} <br />                  
                      <FontAwesomeIcon icon={faInfoCircle} /> Description: {this.state.description}
                    </p>
                  </td>
                  <td>
                    <div className="mission-img">
                      <img src={this.state.image} alt='' />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <hr />
                    <form onSubmit={this.handleSubmit}>
                      <div className="form-group row">
                        <div className="col-sm-3">
                          <label htmlFor="from" className="col-sm-2 col-form-label">From:</label>
                          <input type="date" id="from" name="from" className="form-control form-control-sm" value={this.state.from} onChange={this.handleDateChange} />
                        </div>
                        <div className="col-sm-3">
                          <label htmlFor="to" className="col-sm-2 col-form-label">To:</label>
                          <input type="date" id="to" name="to" className="form-control form-control-sm" value={this.state.to} onChange={this.handleDateChange} />
                        </div>
                      </div>

                      <p>
                        <FontAwesomeIcon icon={faCoins} /> Price per Night: <strong>{this.state.pricePerDay} ETH</strong>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faCalendarAlt} /> Number of days: <strong>{this.state.days}</strong>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faEquals} /> Total price: <strong>{this.state.price} ETH </strong>
                      </p>
                      {!this.state.isBooked
                        ? <button onClick={this.handleBooking} className="btn btn-primary btn-sm">
                          Book now
                        </button>
                        : null
                      }
                    </form>

                  </td>
                </tr>
              </table>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default withParams(Viewlisting)
