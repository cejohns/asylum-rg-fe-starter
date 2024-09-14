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
import { resetVisualizationQuery, setVisualizationData } from '../../../state/actionCreators';
import { colors } from '../../../styles/data_vis_colors';
import ScrollToTopOnMount from '../../../utils/scrollToTopOnMount';

const { background_color } = colors;

function GraphWrapper(props) {
  const { set_view, dispatch } = props;
  let { office, view } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]); // Define data state
  //const [yearRange, setYearRange] = useState([2015, 2022]); // Define year range state

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

        const years = result.data.yearResults.map((item) => item.fiscal_year);
        const grantedPercentages = result.data.yearResults.map((item) => item.granted);

        const formattedData = [
          {
            x: years,
            y: grantedPercentages,
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'blue' },
          },
        ];

        setData(formattedData); // Set the formatted data
        dispatch(setVisualizationData(view, office || 'all', result.data)); // Dispatch with view and office
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [view, office, dispatch]);

  let map_to_render;
  if (!office) {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesAll />;
        break;
      case 'office-heat-map':
        map_to_render = <OfficeHeatMap />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapAll />;
        break;
      default:
        break;
    }
  } else {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesSingleOffice office={office} />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapSingleOffice office={office} />;
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
      {loading ? (
        <div>Loading data...</div>
      ) : (
        map_to_render
      )}
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
            // Updated state with new data based on year limits
          }}
        />
        {view === 'asylumData' && data.length > 0 && (
          <Plot
            data={data}
            layout={{
              title: 'Line Graph',
              xaxis: { title: 'X-axis' },
              yaxis: { title: 'Y-axis' },
            }}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>
    </div>
  );
}

export default connect()(GraphWrapper);
