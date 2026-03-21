import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { adminToken, apiUrl } from '../../common/http';
import { toast } from 'react-toastify';
import Layout from '../../common/Layout';
import { Link } from 'react-router-dom';
import Sidebar from '../../common/Sidebar';

const Banner = () => {
    const [disable, setDisable] = useState(false);
    const [gallery, setGallery] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);

    const { 
        register, 
        handleSubmit, 
        reset,
        formState: { errors } 
    } = useForm();
    
    const saveBanner = async (data) => {
        const formData = {...data, "gallery": gallery}
        console.log(formData);
        setDisable(true);
        const res = await fetch(`${apiUrl}/save-banner`,{
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}` 
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(result => {
            setDisable(false);
            if (result.status == 200) {
                toast.success(result.message);
                reset();
                setGallery([]);
                setGalleryImages([]);
            } else {
                toast.error("Something went wrong.");
            }
        })
    }

    const handleFile = async (e) => {
            const formData = new FormData();
            const file = e.target.files[0];
            formData.append("image",file);
            setDisable(true)
    
            const res = await fetch(`${apiUrl}/temp-images`,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}` 
                },
                body: formData
            })
            .then(res => res.json())
            .then(result => {
                gallery.push(result.data.id);
                setGallery(gallery)
    
                galleryImages.push(result.data.image_url);
                setGalleryImages(galleryImages)
                setDisable(false)
                e.target.value = ""
            })
        }
    
        const deleteImage = (image) => {
            const newGallery = galleryImages.filter(gallery => gallery != image)
            setGalleryImages(newGallery)
        }
    
  return (
    <Layout>
        <div className="container">
            <div className="row">
                <div className="d-flex justify-content-between mt-5 pb-3">
                    <h4 className="h4 pb-0 mb-0">Banner</h4>
                    {/* <Link to="" className='btn btn-primary'>Button</Link> */}
                </div>

                <div className="col-md-3">
                    <Sidebar />
                </div>

                <div className="col-md-9">
                    <form action="" onSubmit={handleSubmit(saveBanner)}>
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label htmlFor="" className='form-label'>Image</label>
                                    <input
                                    
                                    onChange={handleFile}
                                    type="file" className='form-control'/>
                                </div>

                                <div className="mb-3">
                                    <div className="row">
                                        {
                                            galleryImages && galleryImages.map((image,index) => {
                                                return(
                                                    <div className="col-md-3" key={`image-${index}`}>
                                                        <div className="card shadow">
                                                            <img src={image} alt={`gallery-${index}`} className='w-100'/>
                                                        </div>
                                                        <button className="btn btn-danger mt-3 w-100" onClick={() => deleteImage(image)}>Delete</button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button disabled={disable} type='submit' className="btn btn-primary mt-3">Save</button>
                    </form>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Banner
