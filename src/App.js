import { Switch, Route } from "react-router-dom";
import { useState, createContext, useEffect, useRef } from 'react';
import Home from "./page/Home/Home";
import Login from "./page/Auth/Login";
import Signup from "./page/Auth/Signup";
import CreatePost from "./page/Post/CreatePost";
import PostDetail from "./page/Post/PostDetail"
import NotFound from "./page/NotFound/404";
import api from './api'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export const AuthContext = createContext();

function App() {

  const [ user, setUser ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [firstRender, setFirstRender] = useState(true)

  const verifyAuth = async () =>{
    setLoading(true);
    try {
      const res = await api({
        url: '/auth/verify',
        method: 'GET'
    });
      
      if(res.success) {
      setUser(res.data)
      setLoading(false);
    }else{
      setLoading(false);
    }
  }catch (err) {
    setLoading(false);
    }
  }

  useEffect(() =>{
    const token = localStorage.getItem('token');
    if(token) {
      verifyAuth();
    }
    setFirstRender(false);
    //  else{
    //   setLoading(false);
    // }
  }, [])

  const login = ({ user, token }) =>{
    localStorage.setItem('token', token);
    setUser(user);
  }

  const logout = () =>{
    localStorage.removeItem('token');
    setUser(null);
  }

  if (loading || firstRender.current ) return <div>Loading...</div>

  const authValue = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authValue}>
      <div className="App">
        <Switch>
          <Route path='/' exact>
            <Home />
          </Route>
          <Route path='/login' exact>
            <Login />
          </Route>
          <Route path='/signup' exact>
            <Signup />
          </Route>
          <Route path='/upload' exact>
            <CreatePost />
          </Route>
          <Route path='/posts/:id' exact>
            <PostDetail />
          </Route>
          <Route path='*' exact>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
