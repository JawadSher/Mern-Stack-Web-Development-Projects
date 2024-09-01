import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ContextProvider from './context/Context.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path:'/', 
    element:<App />
},
])

createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <RouterProvider router={router}/>
  </ContextProvider>
 
)
