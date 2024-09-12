import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CitizenshipMapAll from './Graphs/CitizenshipMapAll';
import CitizenshipMapSingleOffice from './Graphs/CitizenshipMapSingleOffice';
import TimeSeriesAll from './Graphs/TimeSeriesAll';
import OfficeHeatMap from './Graphs/OfficeHeatMap';
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
      </div>
    </div>
  );
}

export default connect()(GraphWrapper);
