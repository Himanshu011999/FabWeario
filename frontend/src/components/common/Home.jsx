import React from 'react'
import Hero from './Hero';
import LatestProducts from './LatestProducts';
import FeaturedProducts from './FeaturedProducts';
import Layout from './Layout';

const Home = () => {
  return (
    <>
        <Layout>
            <Hero/>
            <LatestProducts />
            <FeaturedProducts />
        </Layout>
    </>
  )
}

export default Home
