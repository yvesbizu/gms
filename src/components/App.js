import React, { Component } from 'react';
import './App.css';
import Home from "../components/home/Home"

import Header from "../components/common/header/Header"
import Footer from "../components/common/footer/Footer"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Newmission from './mission/Newmission'
import Missions from './mission/Missions'
import Newapartment from "../components/apartments/Newapartment"
import Viewmission from './mission/Viewmission'
import Viewmissionpublic from './mission/Viewmissionpublic'
import Viewapartment from './apartments/Viewapartment'

class App extends Component {
  render() {
    return (
      <>
        <Router>
        <Header />
          <Routes>
            <Route exact path='/' element={< Home />}></Route>
            <Route exact path='/register' element={< Newmission />}></Route>
            <Route exact path='/missions' element={< Missions />}></Route>
            <Route exact path='/newapartment/:id' element={< Newapartment />}></Route>
            <Route exact path='/mymission' element={ <Viewmission /> }></Route>
            <Route exact path='/mission/:id' element={ <Viewmissionpublic /> }></Route>
            <Route exact path='/viewapartment/:id' element={< Viewapartment />}></Route>
          </Routes>
          <Footer />
        </Router>
      </>
    );
  }
}

export default App;
