using Minio;
using Minio.DataModel.Args;
using RenovationApp.Server.Services.Fileservice.Dtos;

namespace RenovationApp.Server.Services
{
    public class MinioStorageService : IStorageService
    {
        private readonly IMinioClient _minio;
        private readonly ILogger<MinioStorageService> _logger;
        private readonly TimeSpan _defaultExpiry = TimeSpan.FromMinutes(10);
        private readonly string _RFQ_BUCKET;
        private readonly string _PROJECT_BUCKET;

        public MinioStorageService(IConfiguration config, ILogger<MinioStorageService> logger)
        {
            _logger = logger;

            string endpoint = config["MINIO_ENDPOINT"] ?? throw new ArgumentNullException("MINIO_ENDPOINT");
            string accessKey = config["MINIO_ACCESSKEY"] ?? throw new ArgumentNullException("MINIO_ACCESSKEY");
            string secretKey = config["MINIO_SECRET"] ?? throw new ArgumentNullException("MINIO_SECRET");

            _RFQ_BUCKET = config["MINIO_RFQ_BUCKET"] ?? throw new ArgumentNullException("MINIO_RFQ_BUCKET");
            _PROJECT_BUCKET = config["MINIO_PROJECT_BUCKET"] ?? throw new ArgumentNullException("MINIO_PROJECT_BUCKET");

            bool useSsl = false;

            var minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey);

            if (useSsl)
                minioClient = minioClient.WithSSL();

            _minio = minioClient.Build();

            // Check and create buckets synchronously on startup
            EnsureBucketExists(_RFQ_BUCKET);
            EnsureBucketExists(_PROJECT_BUCKET);
        }

        private void EnsureBucketExists(string bucketName)
        {
            if (!_minio.BucketExistsAsync(new BucketExistsArgs().WithBucket(bucketName)).GetAwaiter().GetResult())
            {
                _logger.LogInformation($"Bucket '{bucketName}' does not exist. Creating it...");
                _minio.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucketName)).GetAwaiter().GetResult();
                _logger.LogInformation($"Bucket '{bucketName}' created successfully.");
            }
        }

        public async Task<PresignedUploadResult> GeneratePresignedUploadUrlAsync(string bucketName, string fileType, int projectId, string fileName, TimeSpan expiry)
        {
            var safeFileName = Path.GetFileName(fileName);
            var objectKey = $"{projectId}/{fileType}/{Guid.NewGuid()}_{safeFileName}";
            EnsureBucketExists(bucketName);
            var url = await _minio.PresignedPutObjectAsync(
                new PresignedPutObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectKey)
                    .WithExpiry((int)expiry.TotalSeconds)
            );

            return new PresignedUploadResult
            {
                Url = url,
                ObjectKey = objectKey
            };
        }

        public async Task<IEnumerable<string>> GetPresignedDownloadUrlsAsync(string bucketName, int projectId, string fileType)
        {
            var urls = new List<string>();

            var listArgs = new ListObjectsArgs()
                .WithBucket(bucketName)
                .WithRecursive(true)
                .WithPrefix(fileType != null ? $"{fileType}/" : "");

            var objects = _minio.ListObjectsEnumAsync(listArgs);

            await foreach (var item in objects)
            {
                var url = await _minio.PresignedGetObjectAsync(new PresignedGetObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(item.Key)
                    .WithExpiry((int)_defaultExpiry.TotalSeconds));
                urls.Add(url);
            }

            return urls;
        }

        public async Task<string> GeneratePresignedDownloadUrlAsync(string bucketName, string objectKey)
        {
            var url = await _minio.PresignedGetObjectAsync(
                new PresignedGetObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectKey)
                    .WithExpiry((int)_defaultExpiry.TotalSeconds)
            );

            return url;
        }
    }
}
