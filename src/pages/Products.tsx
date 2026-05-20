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
    name: 'Product Name 1',
    description: 'A short description of this product and what makes it great for locksport enthusiasts.',
    price: '$0.00',
    imageUrl: '',
    productUrl: '#'
  },
  {
    id: '2',
    name: 'Product Name 2',
    description: 'A short description of this product and what makes it great for locksport enthusiasts.',
    price: '$0.00',
    imageUrl: '',
    productUrl: '#'
  },
  {
    id: '3',
    name: 'Product Name 3',
    description: 'A short description of this product and what makes it great for locksport enthusiasts.',
    price: '$0.00',
    imageUrl: '',
    productUrl: '#'
  },
  {
    id: '4',
    name: 'Product Name 4',
    description: 'A short description of this product and what makes it great for locksport enthusiasts.',
    price: '$0.00',
    imageUrl: '',
    productUrl: '#'
  },
  {
    id: '5',
    name: 'Product Name 5',
    description: 'A short description of this product and what makes it great for locksport enthusiasts.',
    price: '$0.00',
    imageUrl: '',
    productUrl: '#'
  }
]

export default function Products() {
  return (
    <div className="products-page">
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <div className="product-img">
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

function LockIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  )
}
