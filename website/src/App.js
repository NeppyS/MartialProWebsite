import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OSR from "./screens/OnScreenRegistrationForm/OSR.jsx";
import Gymregistration from "./screens/GymRegistrationForm/gymregistrationform.jsx";
import Twogymregistration from "./screens/2GymRegistration/2gymregistration.js";
import GymRegistrationList from "./screens/Dashboard/GymRegistrationList/Applied/GymRegistrationList.js";
import DashLandingPage from "./screens/Dashboard/DashLandingPage/dashlandingpage.js";
import ViewGymRegistration from "./screens/Dashboard/ViewGymRegistration/viewgymregistration.js";
import UsersPage from "./screens/Dashboard/DashNavigation/UsersPage.js";
import VideoUploadForm from './screens/VideoUploadForm/VideoUploadForm.js';
import VideoPlayer from './screens/VideoUploadForm/VideoPlayer.js';
import GymOwnerAccountRegistration from "./screens/GymOwnerAccountRegistration/GymOwnerAccountRegistration.js";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/OSR" element={<OSR />} />
          <Route path="/GymOwnerAccountRegistration" element={<GymOwnerAccountRegistration />} />
          <Route path="/GymRegistration" element={<Gymregistration />} />
          <Route path="/TwoGymRegistration" element={<Twogymregistration />} />
          <Route path="/GymRegistrationList" element={<GymRegistrationList />} />
          <Route path="/" element={<DashLandingPage />} />
          <Route path="/ViewGymRegistration/:id" element={<ViewGymRegistration />} />
          <Route path="/UsersPage" element={<UsersPage />} />
          <Route path="/VideoUploadForm" element={<VideoUploadForm />} />
          <Route path="/VideoPlayer" element={<VideoPlayer />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
