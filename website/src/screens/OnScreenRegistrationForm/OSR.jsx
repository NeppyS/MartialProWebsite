import React from 'react'

import './OSR.css'

import BackIcon from "../../assets/On Screen Confirmation Form/back.svg";


function OSR() {
  return (
    <>
      <div className="parent">
        <div className="backheader">
          <div className="backcontainer">
            <div className="backimage">
              <img src={BackIcon} alt='' />
            </div>

            <div className="backtext">
              <h>Back</h>
            </div>
          </div>
        </div>

        <div className="secureparent">
          <div className="headertext">
            <h>Secure Your Gym Data Privacy.</h>
          </div>
          <div className="securedesc">
            <h>
              Register Today to Safeguard Your Privacy and Ensure You're Signing
              Up with a Verified, Trustworthy Gym.
            </h>
          </div>
          <div>
           <h>I'm In</h>
          </div>
        </div>
      </div>
    </>
  );
}
export default OSR;