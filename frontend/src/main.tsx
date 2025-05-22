import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./auth/AuthContect.tsx";
import NavBar from "./components/NavBar/NavBar.tsx";
import RegisterPage from "./components/RegisterPage/Registerage.tsx";
import {HomePage} from "./components/HomePage/HomePage.tsx";
// import {AuthorizationGuard} from "./guards/authorizationGuard.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <NavBar/>

                <Routes>
                    <Route path={''} element={<HomePage/>}/>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Routes>

            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)


// How to implement Authorization Guard
// {/*<Route path={''} element={<AuthorizationGuard><Component/></AuthorizationGuard>}/>*/}
