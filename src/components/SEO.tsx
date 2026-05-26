import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  canonical: string
  noindex?: boolean
}

const SITE_NAME = 'Gateway Locksport'
const DEFAULT_TITLE = 'Gateway Locksport — St. Louis Locksport Club'
const DEFAULT_DESC = 'Gateway Locksport is a free, welcoming community for lock sport enthusiasts in the St. Louis area. We host monthly meetups open to all skill levels.'
const OG_IMAGE = 'https://gatewaylocksport.com/GL-Site-Preview-Banner.jpg'
const BASE_URL = 'https://gatewaylocksport.com'

export default function SEO({ title, description, canonical, noindex }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const desc = description ?? DEFAULT_DESC
  const url = `${BASE_URL}${canonical}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  )
}
