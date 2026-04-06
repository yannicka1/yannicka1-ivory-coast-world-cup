import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SurveyPage from "./pages/SurveyPage";
import PresentationPage from "./pages/PresentationPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/presentation" element={<PresentationPage />} />
        <Route path="*" element={<Navigate to="/survey" replace />} />
      </Routes>
    </BrowserRouter>
  );
}