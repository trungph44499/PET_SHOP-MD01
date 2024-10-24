import { useEffect, useState } from 'react';
import AuthNavigator from './navigator/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from './Layout/WelcomeScreen';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { StatusBar } from 'react-native';

export default function App() {

  const [checkWelcome, setcheckWelcome] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setcheckWelcome(false);
    }, 2000);
    return () => clearTimeout(timeout)
  }, [])

  return (
    <Provider store={store}>
      <StatusBar translucent backgroundColor={"rgba(0,0,0,0.4)"}/>
      {checkWelcome
      ? <WelcomeScreen/>
      : <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>}
    </Provider>
  );
}

