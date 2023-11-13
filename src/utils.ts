export enum S3_ACL {
  PRIVATE = 'private',
  public_read = 'public-read',
  public_read_write = 'public-read -write',
  authenticated_read = 'authenticated - read',
  aws_exec_read = 'aws - exec - read',
  bucket_owner_read = 'bucket - owner - read',
  bucket_owner_full_control = 'bucket - owner - full - control',
}

export enum S3Region {
  AFSouth1 = 'af-south-1',
  APEast1 = 'ap-east-1',
  APNortheast1 = 'ap-northeast-1',
  APNortheast2 = 'ap-northeast-2',
  APNortheast3 = 'ap-northeast-3',
  APSouth1 = 'ap-south-1',
  APSoutheast1 = 'ap-southeast-1',
  APSoutheast2 = 'ap-southeast-2',
  APSoutheast3 = 'ap-southeast-3',
  CACentral1 = 'ca-central-1',
  CNNorth1 = 'cn-north-1',
  CNNorthwest1 = 'cn-northwest-1',
  EU = 'eu',
  EUCentral1 = 'eu-central-1',
  EUNorth1 = 'eu-north-1',
  EUSouth1 = 'eu-south-1',
  EUWest1 = 'eu-west-1',
  EUWest2 = 'eu-west-2',
  EUWest3 = 'eu-west-3',
  MESouth1 = 'me-south-1',
  SAEast1 = 'sa-east-1',
  USEast2 = 'us-east-2',
  USGovEast1 = 'us-gov-east-1',
  USGovWest1 = 'us-gov-west-1',
  USWest1 = 'us-west-1',
  USWest2 = 'us-west-2',
  APSouth2 = 'ap-south-2',
  EUSouth2 = 'eu-south-2',
}

export const BucketRegex =
  /^(?!xn--|sthree-|sthree-configurator|--ol-s3)(?!.*(-s3alias$|\.$|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9]){2,62}$/;

