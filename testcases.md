### Phase 1 ###

## Test case 1 ## Login Page
   1. /auth/Register Register a new user 
      - Response Successful
   2. /auth/Login Login user
      - Response Successful
   3. /auth/refresh Refresh JWT Tokens
      - Error: Response status is 5000
   4. /auth/send-otp Send OTP to registered Email
      - OTP not generated
   5.  /auth/verify-otp Verify OTP
      - OTP not Verified
## Test Case 2 ## Register Page
   1. /register/ Retrive agent-related data
      - agents: Error Response status is 400
   2. /register/forgot-uid Retrieve UID by number
      - Response Successful
   3. /register/forgot-password Reset password for a user 
      - Response Successful 
      - password reset working
   4. /register/agent Register a new agent
      - Error: Response status is 422
   5. /register/customer Register a new customer 
      - Response successful 
      - customer login success
   6. /register/client Register a new client
      - Id generated success
      - login password not generated
## Test Case 3 ## Projects
   1. /projects/ Get projects
      - Response Successful 
   2. /projects/ Create Projects
      - Response Successful
   3. /projects/plots Get plots
      - Response Succssful
   4. /projects/plots Create plots
      - Response Successful 


### Phase 2 ###

   1. auth:
      1. /auth/Register Register a new User - Response Success
      2. /auth/Login Login User - Response Success
      3. /auth/refresh Refresh JWT tokens
      4. /auth/send-otp Send OTP to registered email- Response 
      5. /auth/verify-otp Verify OTP - Otp verified 15mins valid
   
   2. register:
      1. /register/ Retrieve agent-related data - Response Success
      2. /register/forgot-uid Retrieve UID by mobile number - Response Success
      3. /register/forgot-password Reset password for a user - Response Success and Login Success
      4. /register/agent Register a new agent - Response success and file validation working
      5. /register/customer Register a new Customer - Response success 
      6. /register/client Register a new client - Response success

   3. Projects: 
      1. /projects/ Get Projects - Response success
      2. /projects/ Create Projects - Response success
      3. /projects/plots Get Plots -  Response success
      4. /projects/plots Create Plot - Response succes
   
   4. Site Visits: 
      1. /visits/ Get Site Visits - working
      2. /visits/ Book Site Visit - Response status is 500 
   
   5. users:
      1. /users/roles Get Roles - Response success
      2. /users/roles Create Role - Response success
      3. /users/targets Get Target - Response success
      4. /users/targets Create Target - Response success
      5. 
   
   6. User:
      Internal server error 500
   
   7. Clients:
      Internal server error 500
   
   8. Projects: 
      Response success 
   
   9. Plots:
      Response success
   
   10. Customers:
      Internal server error 500

   11. Bookings:
      Internal server error 500
   
   12. Visits: 
      Internal server error 500

   13. Feedbacks:
      Internal server error 500

   14. Admins:
      Internal server error 500
   
   15. Agents:
      Internal server error 500

   16. Roles: 
      Internal server error 500
   
   17. Targets: 
      Internal server error 500
   
   18. Debug:
      Internal server error 500