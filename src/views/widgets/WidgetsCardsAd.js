// src/views/widgets/WidgetsCardsAd.js
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Import CoreUI components and icons
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilOptions } from '@coreui/icons';

const WidgetsDropdown = (props) => {
  const { className, widgetsData } = props;

  // Helper function to get the list of links to display in the dropdown
  const getWidgetLinks = (widget) => {
    if (widget.links && Array.isArray(widget.links)) {
      return widget.links;
    } else if (widget.link) {
      return [{ label: widget.title || 'View', route: widget.link }];
    }
    return [];
  };

  return (
    <CRow className={className} xs={{ gutter: 4 }}>
      {widgetsData.map((widget) => {
        // Construct the main widget component first
        const widgetContent = (
          <CWidgetStatsA
            color={widget.color}
            value={
              <>
                {widget.value}{' '}
                {widget.percentageChange && (
                  <span className="fs-6 fw-normal">
                    ({widget.percentageChange} <CIcon icon={widget.changeIcon} />)
                  </span>
                )}
              </>
            }
            title={widget.title}
            action={
              // If the entire widget is a link, we don't need a separate action button.
              // Otherwise, show the dropdown menu.
              widget.buttonLink ? null : (
                getWidgetLinks(widget).length > 0 ? (
                  // Show dropdown menu with custom links if they exist
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {getWidgetLinks(widget).map((link, index) =>
                        link.route.startsWith('/') ? (
                          <CDropdownItem key={index} as={Link} to={link.route}>
                            {link.label}
                          </CDropdownItem>
                        ) : (
                          <CDropdownItem
                            key={index}
                            href={link.route}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                          </CDropdownItem>
                        )
                      )}
                    </CDropdownMenu>
                  </CDropdown>
                ) : (
                  // Default dropdown actions if no custom links
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem>Action</CDropdownItem>
                      <CDropdownItem>Another action</CDropdownItem>
                      <CDropdownItem>Something else here...</CDropdownItem>
                      <CDropdownItem disabled>Disabled action</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                )
              )
            }
            chart={
              widget.chartData ? (
                widget.id === 'sessions' ? ( // This can be improved by adding a 'chartType' prop to your data
                  <CChartBar
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={widget.chartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { grid: { display: false, drawTicks: false }, ticks: { display: false } },
                        y: {
                          border: { display: false },
                          grid: { display: false, drawBorder: false, drawTicks: false },
                          ticks: { display: false },
                        },
                      },
                    }}
                  />
                ) : (
                  <CChartLine
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={widget.chartData}
                    options={{
                      plugins: { legend: { display: false } },
                      maintainAspectRatio: false,
                      scales: {
                        x: { border: { display: false }, grid: { display: false, drawBorder: false }, ticks: { display: false } },
                        y: {
                          min:
                            widget.chartData.datasets &&
                            widget.chartData.datasets[0] &&
                            widget.chartData.datasets[0].data
                              ? Math.min(...widget.chartData.datasets[0].data) - 10 : 0,
                          max:
                            widget.chartData.datasets &&
                            widget.chartData.datasets[0] &&
                            widget.chartData.datasets[0].data
                              ? Math.max(...widget.chartData.datasets[0].data) + 10 : 100,
                          display: false,
                          grid: { display: false },
                          ticks: { display: false },
                        },
                      },
                      elements: {
                        line: { borderWidth: 1, tension: 0.4 },
                        point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
                      },
                    }}
                  />
                )
              ) : null
            }
          />
        );

        // This is the correct structure for the return inside the map
        return (
          <CCol sm={6} xl={4} xxl={3} key={widget.id}>
            {/* Conditionally wrap the entire widget in a Link if buttonLink exists */}
            {widget.buttonLink ? (
              <Link to={widget.buttonLink} style={{ textDecoration: 'none' }}>
                {widgetContent}
              </Link>
            ) : (
              widgetContent
            )}
          </CCol>
        );
      })}
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
      changeIcon: PropTypes.string,
      color: PropTypes.string,
      chartData: PropTypes.object,
      link: PropTypes.string,
      buttonLink: PropTypes.string,
      buttonText: PropTypes.string,
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