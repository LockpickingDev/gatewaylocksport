import { useState } from 'react'
import SEO from '../components/SEO'
import './Products.css'

interface Product {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
  productUrl: string
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Practice Lock Kit',
    description: 'Everything you need to get started with locksport.  Includes a grubbed mortise cylinder for easy repinning, pin kit with spools and serrated security pins, precut keys, pinning tray, plug follower, and plug holder.',
    price: '$50.00',
    imageUrl: '/products/Practice Lock Kit 1916.jpg',
    productUrl: '#'
  },
  {
    id: '2',
    name: 'Covert Instruments FNG (0.025")',
    description: '',
    price: '$15.00',
    imageUrl: '/products/FNG 1916.jpg',
    productUrl: ''
    //productUrl: 'https://covertinstruments.com/products/the-fng'
  },
  {
    id: '3',
    name: 'Covert Instruments Genesis Pick Set (0.025")',
    description: '',
    price: '$30.00',
    imageUrl: '/products/CI Genesis.JPG',
    productUrl: ''
    //productUrl: 'https://covertinstruments.com/products/genesis-lock-pick'
  },
  {
    id: '4',
    name: 'Jimy Longs Basics Set v5.0 (0.019")',
    description: '',
    price: '$25.00',
    imageUrl: '/products/Jimy Basics.JPG',
    productUrl: ''
    //productUrl: 'https://jimylongs.com/products/basics-set-v5-0-019'
  },
  {
    id: '5',
    name: 'Jimy Longs Intermediate Set v5.0 (0.019")',
    description: '',
    price: '$35.00',
    imageUrl: '/products/Jimy Intermediate.JPG',
    productUrl: ''
    //productUrl: 'https://jimylongs.com/products/intermediate-set-v5-0-019'
  }  
]

export default function Products() {
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null)

  return (
    <div className="products-page">
      <SEO
        title="Products & Gear"
        description="Shop lockpicking tools and gear at Gateway Locksport meetups. We carry picks from Covert Instruments and Jimy Longs, plus our own beginner practice lock kits."
        canonical="/products"
      />
      <section className="products-hero">
        <div className="section-label">Gear & Merch</div>
        <div className="section-title">Products</div>
      </section>

      <section className="products-section">
        <p className="products-intro">
          We proudly carry products from our friends at{' '}
          <a className="products-disclaimer-link" href="https://covertinstruments.com/" target="_blank" rel="noopener noreferrer">Covert Instruments</a>
          {' '}and{' '}
          <a className="products-disclaimer-link" href="https://jimylongs.com/" target="_blank" rel="noopener noreferrer">Jimy Longs</a>
          {' '}— two fantastic companies we fully support and encourage you to check out directly.
          That said, buying at a meetup can save you a few dollars once shipping and tax are factored in,
          and a small portion goes into keeping the club running.
        </p>

        <div className="products-disclaimer">
          <span className="products-disclaimer-icon">⚠</span>
          <span>All items are available for <strong>in-person purchase only</strong> at Gateway Locksport meetups.</span>
        </div>

        <div className="products-grid">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} onImageClick={() => setLightboxProduct(product)} />
          ))}
        </div>
      </section>

      {lightboxProduct && (
        <div className="lightbox" onClick={() => setLightboxProduct(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxProduct(null)} aria-label="Close">
              <CloseIcon />
            </button>
            <img src={lightboxProduct.imageUrl} alt={lightboxProduct.name} />
            <div className="lightbox-meta">
              <span className="lightbox-caption">{lightboxProduct.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product, onImageClick }: { product: Product; onImageClick: () => void }) {
  return (
    <div className="product-card">
      <div
        className={`product-img${product.imageUrl ? ' product-img-clickable' : ''}`}
        onClick={product.imageUrl ? onImageClick : undefined}
      >
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} />
          : <div className="product-img-placeholder"><LockIcon /></div>
        }
      </div>
      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-price">{product.price}</span>
        <p className="product-desc">{product.description}</p>
        {product.productUrl && product.productUrl !== '#' && (
          <a
            className="product-link"
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Product →
          </a>
        )}
      </div>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  )
}
