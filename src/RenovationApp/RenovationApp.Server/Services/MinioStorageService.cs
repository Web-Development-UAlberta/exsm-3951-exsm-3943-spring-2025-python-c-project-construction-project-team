using Amazon.S3;
using Amazon.S3.Model;
using Amazon;
using Amazon.Runtime;
using RenovationApp.Server.Services.Fileservice.Dtos;

namespace RenovationApp.Server.Services
{
    public class MinioStorageService : IStorageService
    {
        private readonly IAmazonS3 _s3;
        private readonly ILogger<MinioStorageService> _logger;
        private readonly TimeSpan _defaultExpiry = TimeSpan.FromMinutes(10);
        private readonly string _RFQ_BUCKET;
        private readonly string _PROJECT_BUCKET;

        public MinioStorageService(IConfiguration config, ILogger<MinioStorageService> logger)
        {
            _logger = logger;

            // Use existing MINIO_* environment variable names for AWS S3 config
            string endpoint = config["MINIO_ENDPOINT"] ?? throw new ArgumentNullException("MINIO_ENDPOINT");
            string accessKey = config["MINIO_ACCESSKEY"] ?? throw new ArgumentNullException("MINIO_ACCESSKEY");
            string secretKey = config["MINIO_SECRET"] ?? throw new ArgumentNullException("MINIO_SECRET");

            _RFQ_BUCKET = config["MINIO_RFQ_BUCKET"] ?? throw new ArgumentNullException("MINIO_RFQ_BUCKET");
            _PROJECT_BUCKET = config["MINIO_PROJECT_BUCKET"] ?? throw new ArgumentNullException("MINIO_PROJECT_BUCKET");

            var credentials = new BasicAWSCredentials(accessKey, secretKey);
            var configS3 = new AmazonS3Config
            {
                RegionEndpoint = RegionEndpoint.USEast1,
                ServiceURL = endpoint,
                ForcePathStyle = true, // Required for Minio/S3-compatible endpoints
            };
            _s3 = new AmazonS3Client(credentials, configS3);
        }

        public async Task EnsureBucketExistsAsync(string bucketName)
        {
            try
            {
                var buckets = await _s3.ListBucketsAsync();
                var bucketList = buckets.Buckets ?? new List<S3Bucket>();
                if (!bucketList.Any(b => b.BucketName == bucketName))
                {
                    _logger.LogInformation($"Bucket '{bucketName}' does not exist. Creating...");
                    await _s3.PutBucketAsync(new PutBucketRequest
                    {
                        BucketName = bucketName
                    });
                    _logger.LogInformation($"Bucket '{bucketName}' created.");
                }
                else
                {
                    _logger.LogInformation($"Bucket '{bucketName}' exists.");
                }
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, $"Error while ensuring bucket '{bucketName}' exists.");
                throw;
            }
        }

        public PresignedUploadResult GeneratePresignedUploadUrl(string bucketName, string fileType, int projectId, string fileName, TimeSpan expiry)
        {
            var safeFileName = Path.GetFileName(fileName);
            var objectKey = $"{projectId}/{fileType}/{Guid.NewGuid()}_{safeFileName}";

            var request = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = objectKey,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.Add(expiry)
            };

            var url = _s3.GetPreSignedURL(request);

            return new PresignedUploadResult
            {
                Url = url,
                ObjectKey = objectKey
            };
        }

        public string GeneratePresignedDownloadUrl(string bucketName, string objectKey)
        {
            var url = _s3.GetPreSignedURL(new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = objectKey,
                Expires = DateTime.UtcNow.Add(_defaultExpiry),
                Verb = HttpVerb.GET
            });

            return url;
        }

        public async Task<bool> ObjectExistsAsync(string bucketName, string objectKey)
        {
            try
            {
                var request = new GetObjectMetadataRequest
                {
                    BucketName = bucketName,
                    Key = objectKey
                };
                var response = await _s3.GetObjectMetadataAsync(request);
                return true;
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                _logger.LogWarning($"Object '{objectKey}' in bucket '{bucketName}' does not exist or could not be accessed. Exception: {ex.Message}");
                return false;
            }
        }

        public string RFQBucket => _RFQ_BUCKET;
        public string ProjectBucket => _PROJECT_BUCKET;
    }
}
