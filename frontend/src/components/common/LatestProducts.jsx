import React, { useEffect, useState } from 'react'
import { apiUrl } from "../common/http.jsx"
import { Link } from 'react-router-dom'

const LatestProducts = () => {
    const [products, setProducts] = useState([])

    const latestProducts = async () => {
        await fetch(apiUrl+'/get-latest-products',{
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(res => res.json())
        .then(result => {
            setProducts(result.data)
            // console.log(result)
        });
    }

    useEffect(() => {
        latestProducts();
    }, []);

  return (
    <section className="section-2 pt-5">
        <div className="container">
            <h2>New Arrivals</h2>
            <div className="row mt-4">
                {
                    products && products.map((product) => {
                        return (
                            <div className="col-md-3 col-6" key={`product-${product.id}`}>
                                <div className="product card border-0">
                                    <div className="card-img">
                                        {
                                            product.image_url ? <Link to={`/product/${product.id}`}><img src={product.image_url} alt="" className='w-100' /></Link> : <img src="https://placehold.co/400x460" alt="" className='w-100' />
                                        }   
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
                        )
                    })
                }
                

            </div>
        </div>
    </section>
  )
}

export default LatestProducts
