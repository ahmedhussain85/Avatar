//import logo from './logo.svg';
import './App.css';
import BankIDLogin from './BankIDLogin';
import GameModalDemo from './GameModalDemo';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GamePage from './GamePage'; // Import your GamePage component

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
