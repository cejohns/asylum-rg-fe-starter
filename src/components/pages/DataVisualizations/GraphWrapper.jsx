import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CitizenshipMapAll from './Graphs/CitizenshipMapAll';
import CitizenshipMapSingleOffice from './Graphs/CitizenshipMapSingleOffice';
import TimeSeriesAll from './Graphs/TimeSeriesAll';
import OfficeHeatMap from './Graphs/OfficeHeatMap';
import Plot from 'react-plotly.js';
import TimeSeriesSingleOffice from './Graphs/TimeSeriesSingleOffice';
import YearLimitsSelect from './YearLimitsSelect';
import ViewSelect from './ViewSelect';
import axios from 'axios';
import { resetVisualizationQuery, setVisualizationData, setHeatMapYears } from '../../../state/actionCreators'; // Import action creators
import { colors } from '../../../styles/data_vis_colors';
import ScrollToTopOnMount from '../../../utils/scrollToTopOnMount';

const { background_color } = colors;

function GraphWrapper(props) {
  const { set_view, dispatch } = props;
  let { office, view } = useParams();
  const [loading, setLoading] = useState(false); // State to manage loading
  const [yearRange, setYearRange] = useState([2015, 2022]); // Default year range
  const [data, setData] = useState([]); // New state to hold fetched data


  if (!view) {
    set_view('time-series');
    view = 'time-series';
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let result;
        if (view === 'citizenship') {
          result = await axios.get('https://hrf-asylum-be-b.herokuapp.com/cases/citizenshipSummary');
        } else {
          result = await axios.get('https://hrf-asylum-be-b.herokuapp.com/cases/fiscalSummary');
        }
        console.log("API response:", result.data);
        console.log("Years Array (x-axis):", result.data.yearResults); 
        console.log("First element in Years Array:", result.data.yearResults[0]);
        console.log("First element in Years Array:", result.data.yearResults[0].granted);
        console.log("Denied Cases:", result.data.denied);
     

// Loop through the years array and log the corresponding values
years.forEach((year, index) => {
  console.log(`Year: ${year}, Granted Percentage: ${grantedPercentage[index]}`);
});

// Assuming 'data' is your array of year objects

const grantedData = data.map(yearObj => yearObj.granted);  // Extracts the 'granted' values from each year

// Log the granted data for each year
grantedData.forEach((granted, index) => {
  console.log(`Year: ${data[index].fiscal_year}, Granted Percentage: ${granted}`);
});

        
        dispatch(setVisualizationData(view, office || 'all', result.data)); // Dispatch with view and office
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [view, office, dispatch]);

  

  // Handle year range updates
  const handleYearRangeUpdate = (newRange) => {
    setYearRange(newRange); // Update the year range
    // Dispatch the updated years to Redux
    dispatch(setHeatMapYears(view, office || 'all', 0, newRange[0]));
    dispatch(setHeatMapYears(view, office || 'all', 1, newRange[1]));
  };

  // Render the appropriate graph based on the view and office
  let map_to_render;
  if (!office) {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesAll loading={loading} yearRange={yearRange} />;
        break;
      case 'office-heat-map':
        map_to_render = <OfficeHeatMap loading={loading} yearRange={yearRange} />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapAll loading={loading} yearRange={yearRange} />;
        break;
      default:
        break;
    }
  } else {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesSingleOffice office={office} loading={loading} yearRange={yearRange} />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapSingleOffice office={office} loading={loading} yearRange={yearRange} />;
        break;
      default:
        break;
    }
  }

  const clearQuery = (view, office) => {
    dispatch(resetVisualizationQuery(view, office));
  };

  // Filter data by the selected year range
  const filteredData = Array.isArray(data) ? data.filter(d => d.fiscal_year >= yearRange[0] && d.fiscal_year <= yearRange[1]) : [];
  // Prepare data for Plotly
  const years = filteredData.map(d => d.fiscal_year);
  const totalCases = filteredData.map(d => d.totalCases);
  const totalGranted = filteredData.map(d => d.totalGranted);
  const denied = filteredData.map(d => d.denied);
  const grantedPercentage = filteredData.map(d => d.granted);
  const grantedData = data.map(yearObj => yearObj.granted);  // Extract granted data (y-axis)

  console.log(years, totalCases, grantedPercentage);

  return (
    <div
    className="map-wrapper-container"
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      minHeight: '50px',
      backgroundColor: background_color,
    }}
  >
    <ScrollToTopOnMount />
    {map_to_render}
    <div
      className="user-input-sidebar-container"
      style={{
        width: '300px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <ViewSelect set_view={set_view} />
      <YearLimitsSelect
        view={view}
        office={office}
        clearQuery={clearQuery}
        updateStateWithNewData={(years, view, office, stateSettingCallback) => {
          // Updated state with new data based on year limits (can be extended for API)
        }}
      />
      {view === 'asylumData' && (
      <Plot
      data={[
        {
          x: years,  // Fiscal years
          y: grantedData,  // Granted percentages
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Granted Percentage (%)',
        }
      ]}
      layout={{ title: 'Asylum Grant Rate Over Time', paper_bgcolor: background_color }}
    />
     
      )}
    </div>
  </div>

  );
}

export default connect()(GraphWrapper);
