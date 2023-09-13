import { useEffect, useState } from "react";
import { Searchbar } from "./Searchbar/Searchbar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { fetchPhotoByQ, itemsPerPage } from "./api";
import { Layout } from "./Layout";
import { Loader } from "./Loader/Loader";
import { ModalWindow } from "./Modal/Modal";


export const App =()=> {
const [images, setImages] = useState([]);
const [query, setQuery] = useState('');
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);
const [isVisible, setIsVisible] = useState(false);
const [isEmpty, setIsEmpty] = useState(false);
const [showModal, setShowModal] = useState(false);
const [modalImg, satModalImg]= useState({
  url:'',
  alt:''
})

useEffect(()=>{fetchPhoto(query,page)},[query,page])

const fetchPhoto = async(query, page)=>{
  if (!query) {
    return;
  }
  setLoading(true);
  try {
    const {totalHits, hits} = await fetchPhotoByQ(query, page);
    if (hits.length === 0) {
      setIsEmpty(true);
    }
    setImages(prevImages => [...prevImages, ...hits]);
    setIsVisible(page < Math.ceil(totalHits/itemsPerPage))
    
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false);
  }
}

const handleSubmit = (evt) => {
  evt.preventDefault();
  const serchWord = evt.target.elements.query.value.trim();
  setQuery(serchWord);
  setImages([]);
  setPage(1);
  setIsEmpty(false);
  setError(null);
};

const handleLoadMore = () => {
  setPage(prevPage => prevPage + 1);    
};

const handleOpenModal = ()=> {
  setShowModal(true);
}

const showLargeImg = (largeImageURL, tags)=>{
  satModalImg({ 
    url: largeImageURL,
    alt: tags,
  } );
}

const handleCloseModal = ()=> {
  setShowModal(false);
}

    return (
      <Layout>
        <ModalWindow isOpen={showModal} handleCloseModal={handleCloseModal} modalImg={modalImg}/>

        <Searchbar onSubmit={handleSubmit}/>

        {loading && <Loader/>}
        {error && (<p >❌ Something went wrong - {error}</p>)}
        {isEmpty && (<p >Sorry. There are no images ... 😭</p>)}
        {images.length > 0 &&  (<ImageGallery images={images} onClick={handleOpenModal}  onShowModalImg={showLargeImg}/>)}
        {isVisible &&  (<Button onClick={handleLoadMore}/>)}

        </Layout>
    );
}