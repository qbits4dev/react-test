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
   6. 