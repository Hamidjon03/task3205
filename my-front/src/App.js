import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [controller, setController] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Email yoki raqam noto‘g‘ri kiritilgan');
      return;
    }

    if (number && !validateNumber(number)) {
      setError('Email yoki raqam noto‘g‘ri kiritilgan');
      return;
    }

    if (controller) {
      controller.abort();
    }

    const newController = new AbortController();
    setController(newController);

    setLoading(true);
    setError(null);

    try {
      const formattedNumber = number.replace(/-/g, '');
      const response = await axios.post('http://localhost:3000/search',
        { email, number: formattedNumber },
        { signal: newController.signal }
      );
      setResults(response.data.map(user => ({
        ...user,
        number: formatNumber(user.number)
      })));
    } catch (error) {
      if (error.name !== 'CanceledError') {
        setError('Maʼlumot olishda xatolik');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateNumber = (number) => {
    const re = /^\d{2}-\d{2}-\d{2}$/;
    return re.test(number);
  };

  const formatNumber = (num) => {
    return num.replace(/(\d{2})(?=\d)/g, '$1-');
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Number (optional)"
          value={number}
          onChange={(e) => setNumber(formatNumber(e.target.value))}
        />
        <button type="submit">Submit</button>
      </form>
      {loading && <p>Yuklanmoqda...</p>}
      {error && <p>{error}</p>}
      <ul>
        {results.map((user, index) => (
          <li key={index}>
            {user.email} - {user.number}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
