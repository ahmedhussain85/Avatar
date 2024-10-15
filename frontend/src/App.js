//import logo from './logo.svg';
import './App.css';
import BankIDLogin from './components/BankIDLogin';
import GameModalDemo from './components/GameModalDemo';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GamePage from './components/GamePage'; // Import your GamePage component

//<BankIDLogin/>
//<GameModalDemo/>
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BankIDLogin />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
