import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const ProtectedRoute = ({ component: Component,allowedAccessTypes, ...rest }) => {
  const { isAuthenticated, accessType, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && allowedAccessTypes.includes(parseInt(accessType)) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: "/login",
            state: { from: props.location }
          }} />
        )
      }
    />
  );
};

export default ProtectedRoute;
// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Assuming you're using an auth context

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   const { isAuthenticated } = useAuth(); // Get isAuthenticated directly from AuthContext

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/login" />
//         )
//       }
//     />
//   );
// };

// export default ProtectedRoute;
