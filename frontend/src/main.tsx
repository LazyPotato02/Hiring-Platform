import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./auth/AuthContect.tsx";
import NavBar from "./components/NavBar/NavBar.tsx";
import RegisterPage from "./components/RegisterPage/Registerage.tsx";
import {HomePage} from "./components/HomePage/HomePage.tsx";
import {IsAuthGuard} from "./guards/isAuthGuard.tsx";
// import {AuthorizationGuard} from "./guards/authorizationGuard.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <NavBar/>

                <Routes>
                    <Route path={''} element={<HomePage/>}/>
                    <Route path="login" element={<IsAuthGuard><LoginPage/></IsAuthGuard>}/>
                    <Route path="register" element={<IsAuthGuard><RegisterPage/></IsAuthGuard>}/>
                </Routes>

            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)

