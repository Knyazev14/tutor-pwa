import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Form() {
  const [count, setCount] = useState(0)
  const [email, setEmail] = useState('tutor@gmail.com')
  const [password, setPassword] = useState('tutor1488')
  const [loginStatus, setLoginStatus] = useState('')
  const [data, setData] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [showAllData, setShowAllData] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginStatus('Вход в систему...')
    
    try {
      const response = await fetch('http://kattylrj.beget.tech/api/login_check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      
      if (response.ok && result.token) {
        setToken(result.token);
        setIsLoggedIn(true);
        setLoginStatus('✅ Успешный вход');
        localStorage.setItem('jwt_token', result.token);
        await fetchCalendarData(result.token);
      } else {
        setLoginStatus('❌ Ошибка входа');
      }
    } catch (error) {
      setLoginStatus(`❌ Ошибка: ${error.message}`);
    }
  }

  const fetchCalendarData = async (authToken = token) => {
    if (!authToken) return;
    
    try {
      setLoginStatus('Загрузка данных...');
      const response = await fetch('http://kattylrj.beget.tech/api/calendar/get', {
        headers: { 'Authorization': 'Bearer ' + authToken }
      });
      
      if (response.ok) {
        const jsonData = await response.json();
        setData(jsonData.books || jsonData.data || jsonData);
        setLoginStatus(`✅ Данные получены: ${jsonData.books?.length || jsonData.data?.length || jsonData.length} записей`);
        setShowAllData(false);
      }
    } catch (error) {
      setLoginStatus(`❌ Ошибка: ${error.message}`);
    }
  };

  const handleLogout = () => {
    setToken('');
    setIsLoggedIn(false);
    setData(null);
    setLoginStatus('');
    setShowAllData(false);
    localStorage.removeItem('jwt_token');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('jwt_token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      fetchCalendarData(savedToken);
    }
  }, []);

  const renderData = () => {
    if (!data) return null;
    
    if (showAllData) {
      return (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button onClick={() => setShowAllData(false)}>
              📋 Показать сокращенно
            </button>
            <button onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(data, null, 2));
              alert('Данные скопированы в буфер обмена!');
            }}>
              📋 Копировать все
            </button>
          </div>
          <pre style={{ 
            background: '#1e1e1e', 
            color: '#d4d4d4',
            padding: '20px', 
            height: 'calc(100vh - 400px)',
            minHeight: '400px',
            overflow: 'auto',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
    } else {
      return (
        <div style={{ background: 'black', padding: '15px', borderRadius: '4px', height: 'calc(100vh - 400px)', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ color: 'white' }}>📅 Данные: {data.length} событий</h4>
            <button onClick={() => setShowAllData(true)}>
              🔍 Показать все
            </button>
          </div>
          <pre style={{ 
            background: 'black', 
            color: 'white',
            padding: '10px', 
            flex: 1,
            overflow: 'auto',
            margin: 0
          }}>
            {JSON.stringify(data.slice(0, 3), null, 2)}
            {data.length > 3 && '\n... и еще ' + (data.length - 3) + ' записей'}
          </pre>
        </div>
      );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        
        <h1 style={{ textAlign: 'center' }}>Vite + React</h1>
        
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '20px', 
          border: '1px solid #ccc', 
          borderRadius: '8px',
          minHeight: '600px'
        }}>
          
          {!isLoggedIn ? (
            <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto' }}>
              <h3>Вход в систему</h3>
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                required
              />
              
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                required
              />
              
              <button type="submit" style={{ width: '100%', padding: '10px', background: '#8936FF', color: 'white', border: 'none', borderRadius: '4px' }}>
                Войти
              </button>
            </form>
          ) : (
            <div style={{ height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>✅ Вы вошли</h3>
                <button onClick={handleLogout} style={{ padding: '5px 10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}>
                  Выйти
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => fetchCalendarData()}>
                  🔍 Обновить данные
                </button>
                {data && (
                  <button onClick={() => console.log('Все данные:', data)}>
                    📋 В консоль
                  </button>
                )}
              </div>
              
              {data && renderData()}
            </div>
          )}
          
          {loginStatus && (
            <p style={{ marginTop: '15px', padding: '10px', background: 'black', color: 'white', borderRadius: '4px', textAlign: 'left' }}>
              {loginStatus}
            </p>
          )}
        </div>

        <div className="card" style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Form