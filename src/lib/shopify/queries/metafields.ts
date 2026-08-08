export const METAFIELD_FRAGMENT = /* GraphQL */ `
  fragment ArtifactMetafields on Product {
    artifactNumber: metafield(namespace: "otaru", key: "artifact_number") {
      value
      type
    }
    artifactName: metafield(namespace: "otaru", key: "artifact_name") {
      value
      type
    }
    chapterId: metafield(namespace: "otaru", key: "chapter_id") {
      value
      type
    }
    gsm: metafield(namespace: "otaru", key: "gsm") {
      value
      type
    }
    construction: metafield(namespace: "otaru", key: "construction") {
      value
      type
    }
    wash: metafield(namespace: "otaru", key: "wash") {
      value
      type
    }
    printTechnique: metafield(namespace: "otaru", key: "print_technique") {
      value
      type
    }
    symbolMeaning: metafield(namespace: "otaru", key: "symbol_meaning") {
      value
      type
    }
  }
`;

export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

export const MONEY_FRAGMENT = /* GraphQL */ `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

export const VARIANT_FRAGMENT = /* GraphQL */ `
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    price {
      ...MoneyFields
    }
    compareAtPrice {
      ...MoneyFields
    }
    selectedOptions {
      name
      value
    }
  }
  ${MONEY_FRAGMENT}
`;

export const SEO_FRAGMENT = /* GraphQL */ `
  fragment SeoFields on SEO {
    title
    description
  }
`;
