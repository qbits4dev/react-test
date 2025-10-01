// src/views/widgets/WidgetsCardsAd.js
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// CoreUI imports
import { CRow, CCol, CWidgetStatsA } from '@coreui/react';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import { getStyle } from '@coreui/utils';

const WidgetsDropdown = ({ className, widgetsData }) => {
  const navigate = useNavigate();

  // Handle color scheme changes for charts
  useEffect(() => {
    const handleColorSchemeChange = () => {
      // Optionally handle dynamic theme color changes
    };
    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange);
    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange);
    };
  }, []);

  const handleCardClick = (widget) => {
    if (widget.buttonLink) navigate(widget.buttonLink);
    else if (widget.link) {
      widget.link.startsWith('http') ? window.open(widget.link, '_blank') : navigate(widget.link);
    } else if (widget.links && widget.links.length > 0) {
      const firstLink = widget.links[0].route;
      firstLink.startsWith('http') ? window.open(firstLink, '_blank') : navigate(firstLink);
    }
  };

  return (
    <CRow className={`${className} g-3`}>
      {widgetsData.map((widget) => (
        <CCol
          xs={6} // 2 cards side by side on mobile
          sm={6}
          md={4}
          lg={3}
          key={widget.id}
          className="d-flex align-items-stretch"
        >
          <div
            onClick={() => handleCardClick(widget)}
            style={{
              cursor: 'pointer',
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            className="widget-card-hover"
          >
            <CWidgetStatsA
              color={widget.color}
              value={
                <>
                  {widget.value}{' '}
                  {widget.percentageChange && (
                    <span className="fs-6 fw-normal" style={{ color: '#6c757d' }}>
                      ({widget.percentageChange})
                    </span>
                  )}
                </>
              }
              title={widget.title}
              style={{
                minHeight: '150px', // decreased card height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1rem', // smaller padding
              }}
              chart={
                widget.chartData ? (
                  widget.id === 'sessions' ? (
                    <CChartBar
                      className="mt-2 mx-3 rounded-chart"
                      style={{ height: '50px', borderRadius: '6px', background: '#f8f9fa' }}
                      data={widget.chartData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { grid: { display: false, drawTicks: false }, ticks: { display: false } },
                          y: { display: false, grid: { display: false }, ticks: { display: false } },
                        },
                      }}
                    />
                  ) : (
                    <CChartLine
                      className="mt-2 mx-3 rounded-chart"
                      style={{ height: '50px', borderRadius: '6px', background: '#f8f9fa' }}
                      data={widget.chartData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { border: { display: false }, grid: { display: false }, ticks: { display: false } },
                          y: {
                            min:
                              widget.chartData.datasets &&
                              widget.chartData.datasets[0] &&
                              widget.chartData.datasets[0].data
                                ? Math.min(...widget.chartData.datasets[0].data) - 10
                                : 0,
                            max:
                              widget.chartData.datasets &&
                              widget.chartData.datasets[0] &&
                              widget.chartData.datasets[0].data
                                ? Math.max(...widget.chartData.datasets[0].data) + 10
                                : 100,
                            display: false,
                            grid: { display: false },
                            ticks: { display: false },
                          },
                        },
                        elements: { line: { borderWidth: 2, tension: 0.4 }, point: { radius: 3, hitRadius: 8, hoverRadius: 4 } },
                      }}
                    />
                  )
                ) : null
              }
            />
          </div>
        </CCol>
      ))}
      <style>
        {`
          .widget-card-hover:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          }
        `}
      </style>
    </CRow>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  widgetsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      percentageChange: PropTypes.string,
      color: PropTypes.string,
      chartData: PropTypes.object,
      link: PropTypes.string,
      buttonLink: PropTypes.string,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          route: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};

export default WidgetsDropdown;
