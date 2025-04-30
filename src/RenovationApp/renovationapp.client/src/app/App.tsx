import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { IPublicClientApplication } from '@azure/msal-browser';
import { loginRequest, silentRequest} from '../config/authConfig';
import { useState, useEffect } from 'react'
import { IdTokenData } from '../components/ClaimsDisplay/authDataDisplay';
import './App.css';
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'


interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}


interface ForecastResponse {
    code: number;
    message: string;
}


function App({ instance }: { instance: IPublicClientApplication }) {
  

    console.log("Getting active account")
    const activeAccount = instance.getActiveAccount();
  
    const handleLogout = () => {
        instance.logoutRedirect().catch((error) => console.log(error));
    }
  
    const handleRedirect = () => {
        instance
            .loginRedirect({
                ...loginRequest,
                prompt: 'login',
            })
            .catch((error) => console.log(error));
    };
  
    const handlePopup = () => {
        instance.loginPopup().catch((error) => console.log(error));
    }
  


    useEffect(() => {
  
      // Default to using the first account if no account is active once page load completes
      if (!instance.getActiveAccount() && instance.getAllAccounts().length > 0) {
        // Account selection logic is app dependent. Adjust as needed for different use cases.
        instance.setActiveAccount(instance.getAllAccounts()[0]);
      }
    
    }, []);
    
    const [count, setCount] = useState(0)
  
  
  
    return (
      <MsalProvider instance={instance}>
        <>
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
          <div className="App">
            <AuthenticatedTemplate>
                <button className="signInButton" onClick={handleLogout}>
                    Log out
                </button>                
                
                {WeatherData(instance)}
                
                {activeAccount ? (
                    <div>
                        {activeAccount?.idTokenClaims && (
                            <IdTokenData idTokenClaims={activeAccount.idTokenClaims as Record<string, string[]>} />
                        )}
                    </div>
                ) : null}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <button className="signInButton" onClick={handleRedirect}>
                    Log in (redirect)
                </button>
  
                <button className="signInButton" onClick={handlePopup}>
                    Log in (popup)
                </button>
            </UnauthenticatedTemplate>
        </div>
        </>
      </MsalProvider>
    )
  }

function WeatherData(msalInstance: IPublicClientApplication) {
    const [forecasts, setForecasts] = useState<Forecast[]>();
    const [forecastRequest, setForecastRequest] = useState<ForecastResponse>({ code: 0, message: 'Request Pending' });

    useEffect(() => {
        setForecastRequest({ code: 0, message: 'Request Pending' });
        populateWeatherData(msalInstance);
    }, []);

    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.date}>
                        <td>{forecast.date}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Weather Forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            <div>
                <h2>Forecast Request Status</h2>
                <p>Status code: {forecastRequest.code}</p>
                <p>Message: {forecastRequest.message}</p>
            </div>
            {contents}
        </div>
    );

    async function populateWeatherData(msalInstance: IPublicClientApplication) {
        const token = await msalInstance.acquireTokenSilent(silentRequest);
        const headers = new Headers();
        //headers.append("accept", "text/plain");
        headers.append("Authorization", `Bearer ${token.accessToken}`);
        console.log("Got a token")
        const response = await fetch(
            'api/weatherforecast',
            { 
                method: "GET",
                headers: headers
            }
        );
        setForecastRequest({ code: response.status, message: response.statusText });
        if (response.ok) {
            const data = await response.json();
            setForecasts(data);
        }
    }
}

export default App;