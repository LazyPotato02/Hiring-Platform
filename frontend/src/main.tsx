import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./auth/AuthContect.tsx";
import NavBar from "./components/NavBar/NavBar.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <NavBar/>
                <Routes>
                    <Route path="login" element={<LoginPage />} />
                </Routes>

            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
