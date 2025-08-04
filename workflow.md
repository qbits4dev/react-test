Task 1:
LandingPage:
    - To change the landing page, check DefaultLayout.js 
    - In DefaultLayout, check the components imported
    - There are four components imported from the components/index folder 
        1. AppContent
        2. AppSidebar
        3. AppFooter
        4. AppHeader
    - AppContent is the main component for the Layout Page
    - In AppContent, Route element is used to navigate the Landing Page
    - In Route elements, at ' Navigate to="#" '. At the # place the page name which is required as the Landing Page.

 Task 2:
    Exclude Login, Register Page:
        -The pages which are included in the routes.js are displayed under the DefaultLayout includes Header, Footer, NavBar.
        -To Display the page without header and other components, place the path in Routes element
        - The Login Page, Register Page are excluded from the other components
        
 Task 3:
    Login Redirect to Dashboard:
    - In Login.js, import useNavigate from react-Navigate-dom 
    - Assign a new variable Navigate to useNavigate
    - new Method 'handleLogin' is defined. In the definition, place the path of the page to be redirected when the buttton is pressed
    - use Navigate('path') for navigation

 Task 4:
    - Added a new page BookVisit
    - lead dropdown added including forms
 Task 5: 
   - added new verification page for otp verification