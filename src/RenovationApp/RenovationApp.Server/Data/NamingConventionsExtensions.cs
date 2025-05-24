using Microsoft.EntityFrameworkCore;

namespace RenovationApp.Server.Data
{
    public static class NamingConventionsExtensions
    {
        public static void EnforceLowerCaseSchema(this ModelBuilder builder)
        {
            foreach (var entity in builder.Model.GetEntityTypes())
            {
                var tableName = entity.GetTableName();
                if (tableName != null)
                    entity.SetTableName(tableName.ToLowerInvariant());

                foreach (var property in entity.GetProperties())
                {
                    var columnName = property.Name;
                    if (columnName != null)
                        property.SetColumnName(columnName.ToLowerInvariant());
                }

                foreach (var key in entity.GetKeys())
                {
                    var keyName = key.GetName();
                    if (keyName != null)
                        key.SetName(keyName.ToLowerInvariant());
                }

                foreach (var fk in entity.GetForeignKeys())
                {
                    var constraintName = fk.GetConstraintName();
                    if (constraintName != null)
                        fk.SetConstraintName(constraintName.ToLowerInvariant());
                }

                foreach (var index in entity.GetIndexes())
                {
                    var indexName = index.GetDatabaseName();
                    if (indexName != null)
                        index.SetDatabaseName(indexName.ToLowerInvariant());
                }
            }
        }
    }
}