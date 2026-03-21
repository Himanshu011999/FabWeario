import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/common/Home'
import Shop from './components/common/Shop'
import Product from './components/common/Product'
import Cart from './components/common/Cart'
import Checkout from './components/common/Checkout'
import Login from './components/admin/Login'
import { ToastContainer } from 'react-toastify';
import Dashboard from './components/admin/Dashboard'
import { AdminAuthProvider } from './components/context/AdminAuth'
import { AdminRequireAuth } from './components/admin/AdminRequireAuth'

import {default as ShowCategories} from './components/admin/category/Show'
import {default as CreateCategory} from './components/admin/category/Create'
import {default as EditCategory} from './components/admin/category/Edit'

import {default as ShowBrands} from './components/admin/brand/Show'
import {default as CreateBrand} from './components/admin/brand/Create'
import {default as EditBrand} from './components/admin/brand/Edit'

import {default as ShowProducts} from './components/admin/product/Show'
import {default as CreateProduct} from './components/admin/product/Create'
import {default as EditProduct} from './components/admin/product/Edit'
import Register from './components/Register'
import {default as UserLogin} from './components/Login'
import { AuthProvider } from './components/context/Auth'
import Profile from './components/front/Profile'
import { RequireAuth } from './components/common/RequireAuth'
import Confirmation from './components/common/Confirmation'
import ShowOrders from './components/admin/orders/ShowOrders'
import OrderDetail from './components/admin/orders/OrderDetail'
import MyOrders from './components/front/MyOrders'
import {default as UserOrderDetail} from './components/front/OrderDetail'
import Shipping from './components/admin/shipping/Shipping'
import PublicRoute from './components/PublicRoute'
import AdminPublicRoute from './components/admin/AdminPublicRoute'
import Banner from './components/admin/banner/Banner'


function App() {

  return (
    <>
        <AdminAuthProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* User Routes */}
                        <Route path='/' element={<Home/>} />
                        <Route path='/shop' element={<Shop/>} />
                        <Route path='/product/:id' element={<Product/>} />
                        <Route path='/cart' element={<Cart/>} />
                        {/* <Route path='/checkout' element={<Checkout/>} /> */}
                        {/* <Route path='/admin/login' element={<Login/>} /> */}
                        <Route
                            path="/admin/login"
                            element={
                                <AdminPublicRoute>
                                    <Login />
                                </AdminPublicRoute>
                            }
                        />
                        {/* <Route path='/account/register' element={<Register/>} />
                        <Route path='/account/login' element={<UserLogin/>} /> */}

                        <Route
                            path="/account/login"
                            element={
                                <PublicRoute>
                                    <UserLogin />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/account/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />

                        <Route path='/account' element={
                            <RequireAuth>
                                <Profile/>
                            </RequireAuth>
                        } />

                        <Route path='/account/orders' element={
                            <RequireAuth>
                                <MyOrders/>
                            </RequireAuth>
                        } />

                        <Route path='/account/orders/details/:id' element={
                            <RequireAuth>
                                <UserOrderDetail/>
                            </RequireAuth>
                        } />

                        <Route path='/checkout' element={
                            <RequireAuth>
                                <Checkout/>
                            </RequireAuth>
                        } />

                        <Route path='/order/confirmation/:id' element={
                            <RequireAuth>
                                <Confirmation/>
                            </RequireAuth>
                        } />

                        {/* Admin Routes */}
                        <Route path='/admin/dashboard' element={
                            <AdminRequireAuth>
                                <Dashboard/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/categories' element={
                            <AdminRequireAuth>
                                <ShowCategories/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/categories/create' element={
                            <AdminRequireAuth>
                                <CreateCategory/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/categories/edit/:id' element={
                            <AdminRequireAuth>
                                <EditCategory/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/brands' element={
                            <AdminRequireAuth>
                                <ShowBrands/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/brands/create' element={
                            <AdminRequireAuth>
                                <CreateBrand/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/brands/edit/:id' element={
                            <AdminRequireAuth>
                                <EditBrand/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/products' element={
                            <AdminRequireAuth>
                                <ShowProducts/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/products/create' element={
                            <AdminRequireAuth>
                                <CreateProduct/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/products/edit/:id' element={
                            <AdminRequireAuth>
                                <EditProduct/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/orders' element={
                            <AdminRequireAuth>
                                <ShowOrders/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/orders/:id' element={
                            <AdminRequireAuth>
                                <OrderDetail/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/shipping' element={
                            <AdminRequireAuth>
                                <Shipping/>
                            </AdminRequireAuth>
                        } />

                        <Route path='/admin/banner' element={
                            <AdminRequireAuth>
                                <Banner/>
                            </AdminRequireAuth>
                        } />

                    </Routes>
                </BrowserRouter>
                <ToastContainer />
            </AuthProvider>
        </AdminAuthProvider>
    </>
  )
}

export default App
