import { useEffect, useState } from 'react'
import { ItemList } from './ItemList'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { dataBase } from '../firebase/config'



//recibe la prop del padre por parámetro.
export const ItemListContainer = () => {

  //se recibe el id de categoria por parámetro en el useParams
  let { deporteID } = useParams();

  const [titulo, setTitulo] = useState("FOTOS");

  let [fotos, setFotos] = useState([]);

  useEffect(() => {
    //se crea la referencia a la base de datos para acceder a la colección.
    const photoRef = collection(dataBase, 'photos');

    //se filtran las categorias.
    const qry = deporteID ? query(photoRef, where("evento.id", "==", deporteID)) : photoRef;

    const catagoriaRef = collection(dataBase, 'categorias');
    let qryCat = deporteID && query(catagoriaRef, where('id', "==", deporteID))

    //para traer los documentos de la colección.
    getDocs(qry)
      .then((res) => {
        setFotos(
          res.docs.map((doc) => {
            return { ...doc.data(), id: doc.id }
          }))

      })
    if (deporteID) {
      getDocs(qryCat)
        .then((res) => {
          setTitulo(res.docs[0].data().nombre)
        })

    }else{
      setTitulo("FOTOS");
    }

  }, [deporteID]);


  return (

    <div className="photo-container">
      
      <h2 className='titulo-foto'>{titulo}</h2>

      <ItemList fotos={fotos} />

    </div>
  )
}
