import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import ProductImg from "../../assets/images/eight.jpg";
import { Link, useSearchParams } from 'react-router-dom';
import { apiUrl } from './http';

const Shop = () => {

    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [products, setProducts] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [catChecked, setCatChecked] = useState(() => {
        const category = searchParams.get('category');
        return category ? category.split(',') : [] ;
    })
    const [brandChecked, setBrandChecked] = useState(() => {
        const brand = searchParams.get('brand');
        return brand ? brand.split(',') : [] ;
    })
    const fetchProducts = () => {
        let search = []
        let params =''

        if(catChecked.length > 0) {
            search.push(['category',catChecked])
        }

        if(brandChecked.length > 0) {
            search.push(['brand',brandChecked])
        }

        if(search.length > 0) {
            params = new URLSearchParams(search)
            setSearchParams(params)
        } else {
            setSearchParams([])
        }

        fetch(`${apiUrl}/get-products?${params}`,{
            method:'GET',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result);
            if (result.status == 200) {
                setProducts(result.data);
            } else {
                console.log("Something went Wrong");
            }
        })
    }

    const fetchCategories = () => {
        fetch(`${apiUrl}/get-categories`,{
            method:'GET',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(res => res.json())
        .then(result => {
            if (result.status == 200) {
                setCategories(result.data);
            } else {
                console.log("Something went Wrong");
            }
        })
    }

    const fetchBrands = () => {
        fetch(`${apiUrl}/get-brands`,{
            method:'GET',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(res => res.json())
        .then(result => {
            if (result.status == 200) {
                setBrands(result.data);
            } else {
                console.log("Something went Wrong");
            }
        })
    }

    const handleCategory = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setCatChecked(prev => [...prev, value]);
        } else {
            setCatChecked(catChecked.filter(id => id != value));
        }
    };

    const handleBrand = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setBrandChecked(prev => [...prev, value]);
        } else {
            setBrandChecked(brandChecked.filter(id => id != value));
        }
    };

    useEffect(() => {
        fetchCategories()
        fetchBrands()
        fetchProducts()
    }, [catChecked,brandChecked])

  return (
    <Layout>
      <div className="container">
        <nav aria-label="breadcrumb" className='py-4'>
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">Shop</li>
            </ol>
        </nav>
        <div className="row">
            <div className="col-md-3">
                <div className="card shadow border-0 mb-3">
                    <div className="card-body p-4">
                        <h3 className='mb-3'>Categories</h3>
                        <ul>
                            {
                                categories && categories.map(category => {
                                    return (
                                        <li className="mb-2" key={`cat-${category.id}`}>
                                            <input
                                            defaultChecked = { searchParams.get('category') 
                                                ? searchParams.get('category').includes(category.id) 
                                                : false
                                            }
                                            onClick={handleCategory}
                                            type="checkbox" value={category.id} name="" id="" />
                                            <label htmlFor="" className="ps-2">{category.name}</label>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>

                <div className="card shadow border-0 mb-3">
                    <div className="card-body p-4">
                        <h3 className='mb-3'>Brands</h3>
                        <ul>
                            {
                                brands && brands.map(brand => {
                                    return (
                                        <li className="mb-2" key={`brand-${brand.id}`}>
                                            <input 
                                            defaultChecked = { searchParams.get('brand') 
                                                ? searchParams.get('brand').includes(brand.id) 
                                                : false
                                            }
                                            type="checkbox"
                                            onClick={handleBrand}
                                            value={brand.id} name="" id="" />
                                            <label htmlFor="" className="ps-2">{brand.name}</label>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <div className="col-md-9">
                <div className="row pb-5">
                    {
                        products && products.map(product => {
                            return (
                                <div className="col-md-4 col-6" key={`product-${product.id}`}>
                                    <div className="product card border-0">
                                        <div className="card-img">
                                            <Link to={`/product/${product.id}`}>
                                                {
                                                    product.image_url ? <img src={product.image_url} alt="" className='w-100' /> : <img src="https://placehold.co/400x460" alt="" className='w-100' />
                                                } 
                                            </Link>
                                        </div>
                                        <div className="card-body pt-3">
                                            <Link to={`/product/${product.id}`}>{product.title}</Link>
                                            <div className="price">
                                                ${product.price} &nbsp;
                                                {
                                                    product.compare_price && <span className='text-decoration-line-through'>${product.compare_price}</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
      </div>
    </Layout>
  )
}

export default Shop
