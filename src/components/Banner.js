import React, { Component } from 'react';
import logo1 from './../images/house.jpg'
import logo2 from './../images/house4.jpg'
import logo3 from './../images/house3.jpg' 

class Banner extends Component {

    generateImage(title, image, description) {
      return <div className="carousel-item active" style={{backgroundImage: `url(${image})`}}>
                <div className="carousel-caption d-none d-md-block">
                  <h3>{title}</h3>
                  <p>{description}}</p>
                </div>
              </div>
    }

    render() {  
      return (
          <header>
          <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" className=""></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="1" className=""></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="2" className="active"></li>
            </ol>
            <div className="carousel-inner" role="listbox">
              
              {/* {this.generateImage("Let's Remortgage", "../../images/house.jpg","This is a description for the first slide.")}
              {this.generateImage("Let's Remortgage", "../../images/house4.jpg","This is a description for the first slide.")}
              {this.generateImage("Let's Remortgage", "../../images/house3.jpg","This is a description for the first slide.")} */}
              <div className="carousel-item active" style={{backgroundImage: `url(${logo1})`}}>
                <div className="carousel-caption d-none d-md-block">
                  <h3>Let's Remortgage</h3>
                  <p>This is a description for the first slide.</p>
                </div>
              </div>
              <div className="carousel-item" style={{backgroundImage: `url(${logo2})`}}>
                <div className="carousel-caption d-none d-md-block">
                  <h3>New Mortgage</h3>
                  <p>This is a description for the second slide.</p>
                </div>
              </div>
        
              <div className="carousel-item" style={{backgroundImage: `url(${logo3})`}}>
                <div className="carousel-caption d-none d-md-block">
                  <h3>Other serivces</h3>
                  <p>This is a description for the third slide.</p>
                </div>
              </div>
            </div>
            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </header>
      )
    }
}

export default Banner