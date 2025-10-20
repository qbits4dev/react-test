import { element } from 'prop-types'
import React from 'react'

//Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const ClientDashboard = React.lazy(() => import('./views/dashboard/ClientDashboard'))
const AdminDashboard = React.lazy(() => import('./views/dashboard/AdminDashboard'))
const AgentDashboard = React.lazy(() => import('./views/dashboard/AgentDashboard'))
const Plots = React.lazy(() => import('./views/pages/Plots'))
const Reports = React.lazy(() => import('./views/pages/Reports'))
const Invoice = React.lazy(() => import('./views/pages/Invoice'))
const ForgotUserId = React.lazy(() => import('./views/pages/register/ForgotUID'))
const ForgotPassword = React.lazy(() => import('./views/pages/register/ForgotPassword'))
const Targets = React.lazy(() => import('./views/pages/API/Targets'))
const VisitCalender = React.lazy(() => import('./views/pages/register/VisitCalender'))
const Loginheader = React.lazy(() => import('./components/LoginHeader/LoginHeader.js'))
const venture2 = React.lazy(() => import('./views/pages/Projects/venture2.js'))
const CoastalGardenPhase2 = React.lazy(() => import('./views/pages/Projects/CoastalGardenPhase2.js'))
const Unauthorized = React.lazy(() => import('./views/pages/Unauthorized'))


const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))
const bookvisit = React.lazy(() => import('./views/pages/bookvisit'))
const BookSite = React.lazy(() => import('./views/pages/bookSite'))
const Projects = React.lazy(() => import('./views/pages/register/Projects'))
const newProjects = React.lazy(() => import('./views/pages/newProjects'))
const Profile = React.lazy(() => import('./views/pages/Profile'))
const ARegister = React.lazy(() => import('./views/pages/register/ARegister'))
const AgentRegister = React.lazy(() => import('./views/pages/register/register_agent'))
const venture = React.lazy(() => import('./views/pages/Projects/venture'))

//Projects
const skandagreenvalley = React.lazy(() => import('./views/pages/Projects/Skandagreenvalley'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

//API
const GetProjects = React.lazy(() => import('./views/pages/Projects/GetProjects'))
const PostProjects = React.lazy(() => import('./views/pages/Projects/PostProjects'))
const Getlots = React.lazy(() => import('./views/pages/Projects/GetPlots'))
const PostPlots = React.lazy(() => import('./views/pages/Projects/PostPlots'))
const GetTargets = React.lazy(() => import('./views/pages/API/GetTargets'))
const PostTargets = React.lazy(() => import('./views/pages/API/PostTargets'))
const GetAgents = React.lazy(() => import('./views/pages/API/GetAgents'))
const GetBookVisit = React.lazy(() => import('./views/pages/register/GetBookVisit'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home',meta:{allowedRoles:["admin","agent"]} },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/Clientdashboard', name: 'Dashboard', element: ClientDashboard ,meta:{allowedRoles:["admin"]}},
  { path: '/Admindashboard', name: 'Dashboard', element: AdminDashboard,meta:{allowedRoles:["admin"]} },
  { path: '/Agentdashboard', name: 'Dashboard', element: AgentDashboard,meta:{allowedRoles:["agent"]} },
  { path: '/unauthorized', name: 'Unauthorized', element: Unauthorized ,meta:{allowedRoles:["agent"]}},
  { path: '/theme', name: 'Theme', element: Colors, exact: true,meta:{allowedRoles:["admin","agent"]} },
  { path: '/theme/colors', name: 'Colors', element: Colors ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/theme/typography', name: 'Typography', element: Typography,meta:{allowedRoles:["admin","agent"]} },
  { path: '/base', name: 'Base', element: Cards, exact: true ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/base/accordion', name: 'Accordion', element: Accordion ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs,meta:{allowedRoles:["admin","agent"]} },
  { path: '/base/cards', name: 'Cards', element: Cards ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/base/carousels', name: 'Carousel', element: Carousels,meta:{allowedRoles:["admin","agent"]} },
  { path: '/base/collapses', name: 'Collapse', element: Collapses ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/base/navs', name: 'Navs', element: Navs ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/base/paginations', name: 'Paginations', element: Paginations ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders,meta:{allowedRoles:["admin","agent"]} },
  { path: '/base/popovers', name: 'Popovers', element: Popovers,meta:{allowedRoles:["admin","agent"]} },
  { path: '/base/progress', name: 'Progress', element: Progress,meta:{allowedRoles:["admin","agent"]} },
  { path: '/base/spinners', name: 'Spinners', element: Spinners ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/base/tabs', name: 'Tabs', element: Tabs ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/base/tables', name: 'Tables', element: Tables ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/charts', name: 'Charts', element: Charts ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/forms', name: 'Forms', element: FormControl, exact: true ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/forms/form-control', name: 'Form Control', element: FormControl ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/forms/select', name: 'Select', element: Select ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/forms/range', name: 'Range', element: Range ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup,meta:{allowedRoles:["admin","agent"]} },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels,meta:{allowedRoles:["admin","agent"]} },
  { path: '/forms/layout', name: 'Layout', element: Layout ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/forms/validation', name: 'Validation', element: Validation,meta:{allowedRoles:["admin","agent"]} },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons,meta:{allowedRoles:["admin","agent"]} },
  { path: '/icons/flags', name: 'Flags', element: Flags ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/icons/brands', name: 'Brands', element: Brands ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/notifications/badges', name: 'Badges', element: Badges ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/notifications/modals', name: 'Modals', element: Modals ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/widgets', name: 'Widgets', element: Widgets ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/bookvisit', name: 'Book Visit', element: bookvisit ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/bookSite', name: 'Book Site', element: BookSite ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/Projects', name: 'Projects', element: Projects ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/Plots', name: 'Plots', element: Plots ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/newProjects', name: 'newProjects', element: newProjects,meta:{allowedRoles:["admin","agent"]} },
  { path: '/Projects/skanda', name: 'skandagreenvalley', element: skandagreenvalley ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/GetProjects', name: 'Get Projects', element: GetProjects,meta:{allowedRoles:["admin","agent"]} },
  { path: '/PostProjects', name: 'Post Projects', element: PostProjects ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/GetPlots', name: 'Get Plots', element: Getlots ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/PostPlots', name: 'Post Plots', element: PostPlots,meta:{allowedRoles:["admin","agent"]} },
  { path: '/PostTargets', name: 'Post Targets', element: PostTargets,meta:{allowedRoles:["admin","agent"]} },
  { path: '/GetTargets', name: 'Get Targets', element: GetTargets,meta:{allowedRoles:["admin","agent"]} },
  { path: '/GetAgents', name: 'Get Agents', element: GetAgents,meta:{allowedRoles:["admin","agent"]} },
  { path: '/Profile', name: 'User Profile', element: Profile ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/Reports', name: 'Reports', element: Reports,meta:{allowedRoles:["admin","agent"]} },
  { path: '/Invoice', name: 'Invoice', element: Invoice,meta:{allowedRoles:["admin","agent"]} },
  { path: '/ForgotUId', name: 'Forgot User ID', element: ForgotUserId ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/ForgotPassword', name: 'Forgot Password', element: ForgotPassword ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/ARegister', name: 'Agent Register', element: ARegister ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/register_agent', name: 'Agent Register', element: AgentRegister ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/Targets', name: 'Targets', element: Targets ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/GetBookVisit', name: 'Get Book Visit', element: GetBookVisit ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/VisitCalender', name: 'Visit Calender', element: VisitCalender ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/Loginheader', name: 'Loginheader', element: Loginheader ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/venture', name: 'Venture Details', element: venture ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/venture2', name: 'Varahi Gradens', element: venture2 ,meta:{allowedRoles:["admin","agent"]}},
  { path: '/CoastalGardenPhase2', name: 'Coastal Garden Phase II', element: CoastalGardenPhase2 ,meta:{allowedRoles:["admin","agent"]}},
]

export default routes
