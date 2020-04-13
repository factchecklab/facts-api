import gql from 'graphql-tag';

export default gql`
  extend type Mutation {
    """
    Upload a file and create an Asset object associated with the file.
    """
    uploadAsset(file: Upload!): UploadedAsset!
  }

  """
  Asset contains information of a file.
  """
  type Asset {
    """
    The ID of the asset.
    """
    id: ID!

    """
    The content type of the asset file.
    """
    contentType: String!

    """
    The filename of the file.
    """
    filename: String!

    """
    Get the URL for viewing the asset.
    """
    url: URL!

    """
    Get the download URL for the asset.
    """
    downloadUrl: URL!
  }

  """
  UploadedAsset contains information about an uploaded file.
  """
  type UploadedAsset {
    """
    The ID of the asset.
    """
    id: ID!

    """
    The content type of the asset file.
    """
    contentType: String!

    """
    The filename of the file.
    """
    filename: String!

    """
    Get the URL for viewing the asset.
    """
    url: URL!

    """
    Get the download URL for the asset.
    """
    downloadUrl: URL!

    """
    The asset token is opaque data returned to the upload as a proof that
    it is uploaded by the same user.
    """
    token: AssetToken!
  }

  """
  Asset Input represents an input for associating this asset with other
  objects.
  """
  input AssetInput {
    """
    The ID of the asset. This is required to be the same as the existing asset
    ID already associated with the object.
    """
    id: ID

    """
    The asset token of the asset to be associated with the object.
    """
    token: AssetToken
  }
`;
