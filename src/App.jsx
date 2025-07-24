// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Signin from './pages/Signin';
import Package from './pages/Package';
import AllProperty from './pages/AllProperty';
import AddProperty from './subpages/AddProperty';
import Amenities from './pages/Amenities';
import Subscriber from './pages/Subscriber';
import AddSubscription from './subpages/AddSubscription';
import AddPackage from './subpages/AddPackage';
import Customer from './pages/Customer';
import ViewPropertyDetails from './subpages/ViewPropertyDetails';
import AllRequirement from './pages/AllRequirement';
import ProtectedRoute from './components/ProtectedRoute';
import AddRequirement from './subpages/AddRequirement';
import EditPackage from './subpages/EditPackage';
import EditRequirement from './subpages/EditRequirement';
import EditProperty from './subpages/EditProperty';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/allproperty"
            element={
              <ProtectedRoute>
                <Layout>
                  <AllProperty />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/allrequirement"
            element={
              <ProtectedRoute>
                <Layout>
                  <AllRequirement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/amenities"
            element={
              <ProtectedRoute>
                <Layout>
                  <Amenities />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/package"
            element={
              <ProtectedRoute>
                <Layout>
                  <Package />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscriber"
            element={
              <ProtectedRoute>
                <Layout>
                  <Subscriber />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoute>
                <Layout>
                  <Customer />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/addproperty"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddProperty />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/addrequirement"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddRequirement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editrequirement/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditRequirement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/addsubscription"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddSubscription />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/addpackage"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddPackage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editpackage/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditPackage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/allproperty/:propertyId"
            element={
              <ProtectedRoute>
                <Layout>
                  <ViewPropertyDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editproperty/:propertyId"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditProperty />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
