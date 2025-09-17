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
      - Error: Response  status is 400 