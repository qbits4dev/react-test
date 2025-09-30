// src/views/widgets/WidgetsCardsAd.js
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Import CoreUI components and icons
import {
  CRow,
  CCol,
  CButton,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons';

const WidgetsDropdown = (props) => {
  const { className, widgetsData } = props;

  // Refs are typically used for direct DOM manipulation or accessing component instances.
  // In this case, they were used in the original WidgetsDropdown for chart updates
  // on color scheme change. We'll keep them, but you might need to manage multiple
  // refs if each widget has a chart that needs updating based on its own data or type.
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);

  const [activeWidgetId, setActiveWidgetId] = useState(null);

  const handleWidgetClick = (widgetId) => {
    setActiveWidgetId(widgetId === activeWidgetId ? null : widgetId);
  };

  useEffect(() => {
    const handleColorSchemeChange = () => {
      // This useEffect is based on the original WidgetsDropdown.js and assumes
      // specific charts. If your widgets have different chart types or you need
      // more granular control, you might need to adjust this logic or remove it
      // if you handle chart updates differently based on the widgetsData.
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary');
          widgetChartRef1.current.update();
        });
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info');
          widgetChartRef2.current.update();
        });
      }
    };

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange);

    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange);
    };
  }, [widgetChartRef1, widgetChartRef2]);

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
      {widgetsData.map((widget) => (
        <CCol xs={6} md={4} lg={3} key={widget.id}>
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
              widget.buttonLink ? (
                <Link to={widget.buttonLink}>
                  <CButton color="light" size="sm">
                    {widget.buttonText || 'Go'}
                  </CButton>
                </Link>
              ) : getWidgetLinks(widget).length > 0 ? (
                // Show dropdown menu with custom links
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
                // Default dropdown actions if no custom link
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
            }
            chart={
              widget.chartData ? (
                widget.id === 'sessions' ? (
                  <CChartBar
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={widget.chartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        x: {
                          grid: { display: false, drawTicks: false },
                          ticks: { display: false },
                        },
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
                        x: {
                          border: { display: false },
                          grid: { display: false, drawBorder: false },
                          ticks: { display: false },
                        },
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
        </CCol>
      ))}
    </CRow>
  );


  // return (
  //   <CRow className={className} xs={{ gutter: 4 }}>
  //     {widgetsData.map((widget) => ( // Map over the widgetsData prop
  //       <CCol sm={6} xl={4} xxl={3} key={widget.id}> {/* Use widget.id as key */}
  //         <CWidgetStatsA
  //           color={widget.color} // Use data from the widget object
  //           value={
  //             <>
  //               {widget.value}{' '}
  //               {widget.percentageChange && ( // Conditionally render percentage change
  //                 <span className="fs-6 fw-normal">
  //                   ({widget.percentageChange} <CIcon icon={widget.changeIcon} />)
  //                 </span>
  //               )}
  //             </>
  //           }
  //           title={widget.title} // Use data from the widget object
  //           action={
  //             widget.buttonLink ? ( // Condition 1: Render a button if 'buttonLink' exists
  //               <Link to={widget.buttonLink}>
  //                 <CButton color="light" size="sm"> {/* Use CButton for styling */}
  //                   {widget.buttonText || 'Go'} {/* Use buttonText if provided, otherwise 'Go' */}
  //                 </CButton>
  //               </Link>
  //             ) : getWidgetLinks(widget).length > 0 ? ( // Condition 2: Render a dropdown of links if 'links' array or single 'link' exists
  //               <CDropdown // Use CDropdown to display the list of links
  //                 alignment="end"
  //                 visible={activeWidgetId === widget.id}
  //                 onVisibleChange={(visible) => !visible && setActiveWidgetId(null)} // Close dropdown when clicking outside
  //               >
  //                 <CDropdownToggle color="transparent" caret={false} className="text-white p-0" onClick={() => handleWidgetClick(widget.id)}>
  //                   <CIcon icon={cilOptions} /> {/* Use an icon to indicate clickable action */}
  //                 </CDropdownToggle>
  //                 <CDropdownMenu>
  //                   {getWidgetLinks(widget).map((link, index) => ( // Map over the combined links
  //                     link.route.startsWith('/') ? ( // Check if it's an internal link
  //                       <CDropdownItem key={index} as={Link} to={link.route}> {/* Use Link component */}
  //                         {link.label}
  //                       </CDropdownItem>
  //                     ) : ( // External link within the dropdown
  //                        <CDropdownItem key={index} href={link.route} target="_blank" rel="noopener noreferrer">
  //                          {link.label}
  //                        </CDropdownItem>
  //                     )
  //                   ))}
  //                 </CDropdownMenu>
  //               </CDropdown>
  //             ) : (
  //               // Default Condition: Render the default dropdown if no buttonLink and no links
  //               <CDropdown alignment="end">
  //                 <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
  //                   <CIcon icon={cilOptions} />
  //                 </CDropdownToggle>
  //                 <CDropdownMenu>
  //                   <CDropdownItem>Action</CDropdownItem>
  //                   <CDropdownItem>Another action</CDropdownItem>
  //                   <CDropdownItem>Something else here...</CDropdownItem>
  //                   <CDropdownItem disabled>Disabled action</CDropdownItem>
  //                 </CDropdownMenu>
  //               </CDropdown>
  //             )
  //           }
  //           chart={
  //             // Render chart only if chartData exists
  //             widget.chartData ? (
  //               // You might need more sophisticated logic here to determine which chart component to use
  //               // based on the widget data (e.g., a 'chartType' property in your data)
  //               widget.id === 'sessions' ? ( // Example: Use CChartBar for the widget with id 'sessions'
  //                 <CChartBar
  //                   className="mt-3 mx-3"
  //                   style={{ height: '70px' }}
  //                   data={widget.chartData} // Use data from the widget object
  //                   options={{
  //                     maintainAspectRatio: false,
  //                     plugins: {
  //                       legend: {
  //                         display: false,
  //                       },
  //                     },
  //                     scales: {
  //                       x: {
  //                         grid: {
  //                           display: false,
  //                           drawTicks: false,
  //                         },
  //                         ticks: {
  //                           display: false,
  //                         },
  //                       },
  //                       y: {
  //                         border: {
  //                           display: false,
  //                         },
  //                         grid: {
  //                           display: false,
  //                           drawBorder: false,
  //                           drawTicks: false,
  //                         },
  //                         ticks: {
  //                           display: false,
  //                         },
  //                       },
  //                     },
  //                   }}
  //                 />
  //               ) : ( // Example: Use CChartLine for all other widgets
  //                 <CChartLine
  //                   className="mt-3 mx-3"
  //                   style={{ height: '70px' }}
  //                   data={widget.chartData} // Use data from the widget object
  //                   options={{
  //                     plugins: {
  //                       legend: {
  //                         display: false,
  //                       },
  //                     },
  //                     maintainAspectRatio: false,
  //                     scales: {
  //                       x: {
  //                         border: {
  //                           display: false,
  //                         },
  //                         grid: {
  //                           display: false,
  //                           drawBorder: false,
  //                         },
  //                         ticks: {
  //                           display: false,
  //                         },
  //                       },
  //                       y: {
  //                         // Adjust min/max based on your data - consider adding min/max to your widget data structure
  //                         min: widget.chartData.datasets && widget.chartData.datasets[0] && widget.chartData.datasets[0].data ? Math.min(...widget.chartData.datasets[0].data) - 10 : 0,
  //                         max: widget.chartData.datasets && widget.chartData.datasets[0] && widget.chartData.datasets[0].data ? Math.max(...widget.chartData.datasets[0].data) + 10 : 100,
  //                         display: false,
  //                         grid: {
  //                           display: false,
  //                         },
  //                         ticks: {
  //                           display: false,
  //                         },
  //                       },
  //                     },
  //                     elements: {
  //                       line: {
  //                         borderWidth: 1,
  //                         tension: 0.4,
  //                       },
  //                       point: {
  //                         radius: 4,
  //                         hitRadius: 10,
  //                         hoverRadius: 4,
  //                       },
  //                     },
  //                   }}
  //                 />
  //               )
  //             ) : null // Don't render chart if no chartData
  //           }
  //         />
  //       </CCol>
  //     ))}
  //   </CRow>
  // );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  // Define the expected structure of the widgetsData prop
  widgetsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Unique identifier for the widget
      title: PropTypes.string.isRequired, // Title of the widget
      value: PropTypes.string.isRequired, // Main value displayed
      percentageChange: PropTypes.string, // Percentage change (optional)
      changeIcon: PropTypes.string, // Icon for percentage change (optional)
      color: PropTypes.string, // Color of the widget
      chartData: PropTypes.object, // Chart data (optional)
      link: PropTypes.string, // Single link (will be shown in dropdown)
      buttonLink: PropTypes.string, // Prop for button link
      buttonText: PropTypes.string, // Prop for button text (optional)
      links: PropTypes.arrayOf( // Array of multiple links (will be shown in dropdown)
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          route: PropTypes.string.isRequired,
        })
      ),
      // Add any other properties your widget data might have (e.g., chartType)
    })
  ).isRequired,
  // Remove withCharts propType as we are now using widgetsData
  // withCharts: PropTypes.bool,
};

export default WidgetsDropdown;
