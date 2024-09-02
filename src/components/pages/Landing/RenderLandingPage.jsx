import React from 'react';
// ADD IMPORTS BACK FOR GRAPHS SECTION
// import GrantRatesByOfficeImg from '../../../styles/Images/bar-graph-no-text.png';
// import GrantRatesByNationalityImg from '../../../styles/Images/pie-chart-no-text.png';
// import GrantRatesOverTimeImg from '../../../styles/Images/line-graph-no-text.png';
import GrantRatesByOfficeImg from '../../../styles/Images/bar-graph-no-text.png';
import GrantRatesByNationalityImg from '../../../styles/Images/pie-chart-no-text.png';
import GrantRatesOverTimeImg from '../../../styles/Images/line-graph-no-text.png';
import HrfPhoto from '../../../styles/Images/paper-stack.jpg';
import '../../../styles/RenderLandingPage.less';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
// for the purposes of testing PageNav
// import PageNav from '../../common/PageNav';
import PageNav from '../../common/PageNav'; // Uncommented import for PageNav


function RenderLandingPage(props) {
  const scrollToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const history = useHistory();

  return (
    <div className="main">
      {/* Add PageNav at the top of the main content */}
      <PageNav />

      <div className="header">
        <div className="header-text-container">
          <h1>Asylum Office Grant Rate Tracker</h1>
          <h3>
            The Asylum Office Grant Rate Tracker provides asylum seekers,
            researchers, policymakers, and the public an interactive tool to
            explore USCIS data on Asylum Office decisions
          </h3>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="graphs-section">
        <div className="graph">
          <img src={GrantRatesByOfficeImg} alt="Grant Rates by Office" />
        </div>
        <div className="graph">
          <img src={GrantRatesByNationalityImg} alt="Grant Rates by Nationality" />
        </div>
        <div className="graph">
          <img src={GrantRatesOverTimeImg} alt="Grant Rates Over Time" />
        </div>
      </div>

      <div className="view-more-data-btn-container">
        <Button
          type="default"
          style={{ backgroundColor: '#404C4A', color: '#FFFFFF' }}
          onClick={() => history.push('/graphs')}
        >
          View the Data
        </Button>
      </div>

      <div className="middle-section">
        <div className="hrf-img-container">
          <img src={HrfPhoto} alt="Human Rights First" className="hrf-img" />
        </div>
        <div className="middle-section-text-container">
          <h3>
            Human Rights First has created a search tool to give you a
            user-friendly way to explore a data set of asylum decisions between
            FY 2016 and May 2021 by the USCIS Asylum Office, which we received
            through a Freedom of Information Act request. You can search for
            information on asylum grant rates by year, nationality, and asylum
            office, visualize the data with charts and heat maps, and download
            the data set.
          </h3>
        </div>
      </div>
       {/* Bottom Section */}
       <div className="bottom-section">
        <h1>Explore More Data</h1>
        <div className="data-container">
          <div className="first-data-point-container">
            <h2>Data Point 1</h2>
            <p>Some description or summary about Data Point 1.</p>
          </div>
          <div className="second-data-point-container">
            <h2>Data Point 2</h2>
            <p>Some description or summary about Data Point 2.</p>
          </div>
          <div className="third-data-point-container">
            <h2>Data Point 3</h2>
            <p>Some description or summary about Data Point 3.</p>
          </div>
        </div>
      </div>
      <div>
        <p onClick={() => scrollToTop()} className="back-to-top">
          Back To Top ^
        </p>
      </div>
    </div>
  );
}
export default RenderLandingPage;
