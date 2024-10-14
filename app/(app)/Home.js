import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Importaciones de componentes
import Carrusel from '../../components/carousel/Carousel.js';
import CartItems from '../../components/cart/CardHome.js';
import Categories from '../../components/categories/Categories.js';
import SearchHome from '../../components/search/SearchHome.js';
import CardIProductos from '../../components/cart/CardProduct.js'; // Asegúrate de que esta ruta sea correcta

// Importaciones de Api
import { urlFor } from '../../sanity.js';
import { getCategories, getEvento, fetchProducts } from '../../conection/SanityConection/api.js';
import CustomKeyboardView from '../../components/keyboard/CustomKeyboardView.js';

export default function Home() {
  const [carouselItems, setCarouselItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para la búsqueda
  const [products, setProducts] = useState([]); // Estado para todos los productos
  const [filteredProductsByCategory, setFilteredProductsByCategory] = useState([]); // Productos filtrados por categoría
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del popup

  // Mostrar el popup al cargar la pantalla
  useEffect(() => {
    setModalVisible(true); // cambiar
  }, []);

  // Obtener eventos para el carrusel
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getEvento();
        const formattedData = data.map(evento => {
          const imageUrl = urlFor(evento.image.asset._ref).url();
          return {
            title: evento.name,
            text: evento.description,
            image: imageUrl,
          };
        });
        setCarouselItems(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchEventos();
  }, []);

  // Obtener categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Obtener todos los productos al cargar el componente
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchAllProducts();
  }, []);

  // Filtrar productos por categoría cuando se seleccione una categoría
  useEffect(() => {
    if (activeCategory) {
      const filtered = products.filter(product => {
        const categoryRef = product?.category?._ref || '';
        return categoryRef === activeCategory;
      });
      setFilteredProductsByCategory(filtered);
    } else {
      setFilteredProductsByCategory([]); // Restablecer si no hay categoría activa
    }
  }, [activeCategory, products]);

  return (
    <CustomKeyboardView>
      <StatusBar barStyle="dark-content" />

      {/* Buscador */}
      <View>
        <SearchHome 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          modalVisible={modalVisible} 
          setModalVisible={setModalVisible} 
        />
      </View>

      {/* Mostrar productos si hay búsqueda o categorías activas */}
      {searchQuery ? (
        <CardIProductos searchQuery={searchQuery} />
      ) : activeCategory ? (
        <CardIProductos products={filteredProductsByCategory} />
      ) : (
        <>
          {/* Mostrar categorías */}
          <View style={{ paddingTop: hp(4) }}>
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </View>

          {/* Carrusel de eventos */}
          <View className="px-4">
            <Text style={{ paddingTop: hp(4) }} className="text-2xl font-bold text-zinc-700">
              Eventos de Cerveza
            </Text>
            <Carrusel items={carouselItems} />
          </View>

          {/* Sección de promociones */}
          <View style={{ paddingTop: hp(4) }}>
            <Text className="text-2xl font-bold text-zinc-700 px-4">Promociones</Text>
            <View style={{ paddingTop: hp(2) }}>
              <CartItems />
            </View>
          </View>

          {/* Sección de productos populares */}
          <View style={{ paddingTop: hp(4) }}>
            <Text className="text-2xl font-bold text-zinc-700 px-4">Populares</Text>
            <View style={{ paddingTop: hp(2) }}>
              <CartItems />
            </View>
          </View>
        </>
      )}
    </CustomKeyboardView>
  );
}
