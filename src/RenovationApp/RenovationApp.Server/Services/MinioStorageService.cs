using Minio;
using Minio.DataModel.Args;
using RenovationApp.Server.Dtos;



namespace RenovationApp.Server.Services
{
    public class MinioStorageService : IStorageService
    {
        private readonly IMinioClient _minio;
        private readonly ILogger<MinioStorageService> _logger;
        private readonly TimeSpan _defaultExpiry = TimeSpan.FromMinutes(10);
        private readonly string _bucketName = "project-files";

        public MinioStorageService(IConfiguration config, ILogger<MinioStorageService> logger)
        {
            _logger = logger;

            string endpoint = config["MINIO_ENDPOINT"] ?? throw new ArgumentNullException("MINIO_ENDPOINT");
            string accessKey = config["MINIO_ACCESSKEY"] ?? throw new ArgumentNullException("MINIO_ACCESSKEY");
            string secretKey = config["MINIO_SECRET"] ?? throw new ArgumentNullException("MINIO_SECRET");

            bool useSsl = false;

            var minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey);

            if (useSsl)
                minioClient = minioClient.WithSSL();

            _minio = minioClient.Build();
        }

        public async Task<PresignedUploadResult> GeneratePresignedUploadUrlAsync(string fileType, string projectId, string fileName, TimeSpan expiry)
        {
            // Ensure bucket exists
            if (!await _minio.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucketName)))
            {
                _logger.LogInformation($"Creating new bucket: {_bucketName}");
                await _minio.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucketName));
            }

            var safeFileName = Path.GetFileName(fileName);
            var objectKey = $"{projectId}/{fileType}/{Guid.NewGuid()}_{safeFileName}";

            var url = await _minio.PresignedPutObjectAsync(
                new PresignedPutObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(objectKey)
                    .WithExpiry((int)expiry.TotalSeconds)
            );

            return new PresignedUploadResult
            {
                Url = url,
                ObjectKey = objectKey
            };
        }

        public async Task<IEnumerable<string>> GetPresignedDownloadUrlsAsync(string projectId, string fileType)
        {
            var urls = new List<string>();

            if (!await _minio.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucketName)))
                return urls;

            var listArgs = new ListObjectsArgs()
                .WithBucket(_bucketName)
                .WithRecursive(true)
                .WithPrefix(fileType != null ? $"{fileType}/" : "");

            var objects = _minio.ListObjectsEnumAsync(listArgs);

            await foreach (var item in objects)
            {
                var url = await _minio.PresignedGetObjectAsync(new PresignedGetObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(item.Key)
                    .WithExpiry((int)_defaultExpiry.TotalSeconds));
                urls.Add(url);
            }

            return urls;
        }

        public async Task<string> GeneratePresignedDownloadUrlAsync(string objectKey)
        {
            if (!await _minio.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucketName)))
                throw new InvalidOperationException("Bucket does not exist.");

            var url = await _minio.PresignedGetObjectAsync(
                new PresignedGetObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(objectKey)
                    .WithExpiry((int)_defaultExpiry.TotalSeconds)
            );

            return url;
        }
    }
}
